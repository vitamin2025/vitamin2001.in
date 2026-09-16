"use client";

import { useQuery } from "@tanstack/react-query";
import { orgRequest } from "@/lib/admin/http";
import { asMemberId, asUserId, type MemberId, type UserId } from "@/lib/admin/ids";
import { toAdminError, retryUnlessAuthz } from "@/lib/admin/errors";
import {
  membershipCapabilities,
  parseOrgRole,
  type MembershipCapabilities,
  type OrgRole,
} from "@/lib/admin/policy";
import { queryStatus, type CollectionResult } from "@/lib/admin/paging";
import { date, list, obj, optStr, str } from "@/lib/admin/read";
import { useActor } from "@/lib/admin/identity";
import { useClientAdminCommand, type ClientCommand } from "./command";
import { useClientDashboard } from "./identity";
import { clientAdminKeys } from "./keys";

export type ClientMember = {
  readonly memberId: MemberId;
  readonly userId: UserId;
  readonly name: string;
  readonly email: string;
  readonly role: OrgRole;
  readonly joinedAt: Date;
  readonly can: MembershipCapabilities;
};

export type ClientInvitation = {
  readonly id: string;
  readonly email: string;
  readonly role: OrgRole;
  readonly status: string;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly inviterName: string | null;
};

export type ClientMembersResult = CollectionResult<ClientMember> & {
  readonly invitations: readonly ClientInvitation[];
};

type ParsedMember = Omit<ClientMember, "can">;

function parseMember(raw: unknown, at: string): ParsedMember {
  const row = obj(raw, at);
  return {
    memberId: asMemberId(str(row, "memberId", at)),
    userId: asUserId(str(row, "userId", at)),
    name: str(row, "userName", at),
    email: str(row, "userEmail", at),
    role: parseOrgRole(str(row, "role", at)),
    joinedAt: date(row, "joinedAt", at),
  };
}

function parseInvitation(raw: unknown, at: string): ClientInvitation {
  const row = obj(raw, at);
  return {
    id: str(row, "id", at),
    email: str(row, "email", at),
    role: parseOrgRole(str(row, "role", at)),
    status: str(row, "status", at),
    expiresAt: date(row, "expiresAt", at),
    createdAt: date(row, "createdAt", at),
    inviterName: optStr(row, "inviterName", at),
  };
}

function withCapabilities(
  members: readonly ParsedMember[],
  actor: ReturnType<typeof useActor>,
  slug: string,
): ClientMember[] {
  const ownerCount = members.filter((member) => member.role === "owner").length;
  return members.map((member) => {
    const lastOwner = member.role === "owner" && ownerCount <= 1;
    return {
      ...member,
      can: lastOwner
        ? {
            changeRole: {
              allowed: false,
              reason: "Cannot change the only organization owner.",
            },
            remove: {
              allowed: false,
              reason: "Cannot remove the only organization owner.",
            },
          }
        : membershipCapabilities(actor, {
            userId: member.userId,
            role: member.role,
            orgSlug: slug,
          }),
    };
  });
}

export function useClientMembers(): ClientMembersResult {
  const actor = useActor();
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;

  const result = useQuery({
    queryKey: clientAdminKeys.members(actor.id, slug),
    queryFn: () =>
      orgRequest({
        method: "GET",
        path: "/admin/members",
        parse: (raw, at) => {
          const envelope = obj(raw, at);
          return {
            members: list(envelope.members, `${at}.members`, parseMember),
            invitations: list(
              envelope.pendingInvitations,
              `${at}.pendingInvitations`,
              parseInvitation,
            ),
          };
        },
      }),
    retry: retryUnlessAuthz,
  });

  return {
    items: result.data
      ? withCapabilities(result.data.members, actor, slug)
      : [],
    invitations: result.data?.invitations ?? [],
    status: queryStatus(result),
    error: result.error ? toAdminError(result.error) : null,
    reload: () => {
      void result.refetch();
    },
  };
}

export function useClientMemberCommands(): {
  readonly invite: ClientCommand<{ email: string; role: "admin" | "member" }>;
  readonly updateRole: ClientCommand<{ memberId: MemberId; role: OrgRole }>;
  readonly remove: ClientCommand<{ memberId: MemberId }>;
} {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;

  const invite = useClientAdminCommand<{
    email: string;
    role: "admin" | "member";
  }>({
    fields: ["email", "role"],
    send: async (input) => {
      await orgRequest({
        method: "POST",
        path: "/admin/members/invite",
        body: { email: input.email, role: input.role },
        parse: () => undefined,
      });
    },
    effect: () => ({ on: "members.changed", actorId: actor.id, slug }),
    toast: (input) => `Invitation sent to ${input.email}`,
  });

  const updateRole = useClientAdminCommand<{
    memberId: MemberId;
    role: OrgRole;
  }>({
    fields: ["role"],
    send: async (input) => {
      await orgRequest({
        method: "PATCH",
        path: `/admin/members/${encodeURIComponent(input.memberId)}/role`,
        body: { role: input.role },
        parse: () => undefined,
      });
    },
    effect: () => ({ on: "members.changed", actorId: actor.id, slug }),
    toast: () => "Member role updated",
  });

  const remove = useClientAdminCommand<{ memberId: MemberId }>({
    send: async (input) => {
      await orgRequest({
        method: "DELETE",
        path: `/admin/members/${encodeURIComponent(input.memberId)}`,
        parse: () => undefined,
      });
    },
    effect: () => ({ on: "members.changed", actorId: actor.id, slug }),
    toast: () => "Member removed",
  });

  return { invite, updateRole, remove };
}
