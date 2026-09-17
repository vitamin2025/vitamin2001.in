"use client";

import { useQuery } from "@tanstack/react-query";
import { useCommand, type Command } from "./command";
import { toAdminError } from "./errors";
import { adminRequest } from "./http";
import { asMemberId, asOrgId, asUserId, type MemberId, type OrgId, type UserId } from "./ids";
import { useActor } from "./identity";
import { keys } from "./keys";
import {
  parsePageNumber,
  parsePageSize,
  queryStatus,
  type CollectionResult,
  type DetailResult,
  type ListResult,
  type QueryCodec,
} from "./paging";
import {
  membershipCapabilities,
  orgCapabilities,
  parseOrgRole,
  SYSTEM_ORG_SLUG,
  type MembershipCapabilities,
  type OrgCapabilities,
  type OrgRole,
  type Permit,
} from "./policy";
import { bool, date, jsonObject, list, num, obj, optStr, str } from "./read";
import { retryUnlessAuthz } from "./errors";

export type OrgRow = {
  readonly id: OrgId;
  readonly name: string;
  readonly slug: string;
  readonly logoUrl: string | null;
  readonly isSystem: boolean;
  readonly active: boolean;
  readonly deactivatedAt: Date | null;
  readonly memberCount: number;
  readonly pendingInvitationCount: number;
  readonly createdAt: Date;
  readonly can: OrgCapabilities;
};

export type Invitation = {
  readonly id: string;
  readonly email: string;
  readonly role: OrgRole;
  readonly status: string;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly expired: boolean;
};

export type OrgDetail = OrgRow & {
  readonly invitations: readonly Invitation[];
  readonly extraMetadata: Readonly<Record<string, unknown>>;
};

export type OrgMember = {
  readonly memberId: MemberId;
  readonly role: OrgRole;
  readonly joinedAt: Date;
  readonly user: {
    readonly id: UserId;
    readonly name: string;
    readonly email: string;
    readonly suspended: boolean;
  };
  readonly can: MembershipCapabilities;
};

export type OrgListQuery = {
  readonly page: number;
  readonly limit: number;
  readonly q: string;
};

function parseOrgRow(raw: unknown, at: string): OrgRow {
  const row = obj(raw, at);
  const slug = str(row, "slug", at);
  const meta = jsonObject(row, "metadata", at);
  const active = meta.active !== false;
  const deactivatedAt =
    typeof meta.deactivatedAt === "string" ? new Date(meta.deactivatedAt) : null;
  return {
    id: asOrgId(str(row, "id", at)),
    name: str(row, "name", at),
    slug,
    logoUrl: optStr(row, "logo", at),
    isSystem: slug === SYSTEM_ORG_SLUG,
    active,
    deactivatedAt:
      deactivatedAt && !Number.isNaN(deactivatedAt.getTime()) ? deactivatedAt : null,
    memberCount: num(row, "membersCount", at),
    pendingInvitationCount: num(row, "pendingInvitationsCount", at),
    createdAt: date(row, "createdAt", at),
    can: orgCapabilities({ slug, active }),
  };
}

function parseInvitation(raw: unknown, at: string): Invitation {
  const row = obj(raw, at);
  const expiresAt = date(row, "expiresAt", at);
  return {
    id: str(row, "id", at),
    email: str(row, "email", at),
    role: parseOrgRole(str(row, "role", at)),
    status: str(row, "status", at),
    expiresAt,
    createdAt: date(row, "createdAt", at),
    expired: expiresAt.getTime() < Date.now(),
  };
}

function parseOrgDetail(raw: unknown, at: string): OrgDetail {
  const envelope = obj(raw, at);
  const organization = obj(envelope.organization, `${at}.organization`);
  const row = parseOrgRow(
    {
      ...organization,
      membersCount: 0,
      pendingInvitationsCount: Array.isArray(envelope.invitations)
        ? envelope.invitations.length
        : 0,
    },
    `${at}.organization`,
  );
  const extra = jsonObject(organization, "metadata", `${at}.organization`);
  const rest = { ...extra };
  delete rest.active;
  delete rest.deactivatedAt;
  delete rest.deactivatedBy;
  return {
    ...row,
    memberCount: Array.isArray(envelope.members) ? envelope.members.length : 0,
    invitations: list(envelope.invitations, `${at}.invitations`, parseInvitation),
    extraMetadata: rest,
  };
}

function parseOrgMember(
  raw: unknown,
  at: string,
  actor: ReturnType<typeof useActor>,
  orgSlug: string,
): OrgMember {
  const row = obj(raw, at);
  const userId = asUserId(str(row, "userId", at));
  const role = parseOrgRole(str(row, "role", at));
  return {
    memberId: asMemberId(str(row, "memberId", at)),
    role,
    joinedAt: date(row, "joinedAt", at),
    user: {
      id: userId,
      name: str(row, "userName", at),
      email: str(row, "userEmail", at),
      suspended: bool(row, "userBanned", at),
    },
    can: membershipCapabilities(actor, {
      userId,
      role,
      orgSlug,
    }),
  };
}

export const orgListQuery: QueryCodec<OrgListQuery> = {
  parse: (params) => ({
    page: parsePageNumber(params.get("page")),
    limit: parsePageSize(params.get("limit")),
    q: params.get("q") ?? "",
  }),
  serialize: (query) => {
    const params = new URLSearchParams();
    if (query.page > 1) params.set("page", String(query.page));
    if (query.limit !== 20) params.set("limit", String(query.limit));
    if (query.q) params.set("q", query.q);
    return params;
  },
};

export function useOrgs(query: OrgListQuery): ListResult<OrgRow> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.orgs.list(actor.id, query),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: "/organizations",
        query: {
          page: query.page,
          limit: query.limit,
          q: query.q || undefined,
        },
        parse: (raw, at) => {
          const envelope = obj(raw, at);
          return {
            items: list(envelope.data, `${at}.data`, parseOrgRow),
            page: {
              page: num(envelope, "page", at),
              limit: num(envelope, "limit", at),
              total: num(envelope, "total", at),
              totalPages: num(envelope, "totalPages", at),
            },
          };
        },
      }),
    retry: retryUnlessAuthz,
  });

  return {
    items: result.data?.items ?? [],
    page: result.data?.page ?? {
      page: query.page,
      limit: query.limit,
      total: 0,
      totalPages: 0,
    },
    status: queryStatus(result),
    error: result.error ? toAdminError(result.error) : null,
    reload: () => {
      void result.refetch();
    },
  };
}

export function useOrg(orgId: OrgId): DetailResult<OrgDetail> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.orgs.detail(actor.id, orgId),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: `/organizations/${encodeURIComponent(orgId)}`,
        parse: parseOrgDetail,
      }),
    retry: retryUnlessAuthz,
  });

  return {
    item: result.data ?? null,
    status: queryStatus(result),
    error: result.error ? toAdminError(result.error) : null,
    reload: () => {
      void result.refetch();
    },
  };
}

export function useOrgMembers(orgId: OrgId, orgSlug: string): CollectionResult<OrgMember> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.orgs.members(actor.id, orgId),
    enabled: Boolean(orgSlug),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: `/organizations/${encodeURIComponent(orgId)}/members`,
        parse: (raw, at) =>
          list(raw, at, (item, itemAt) => parseOrgMember(item, itemAt, actor, orgSlug)),
      }),
    retry: retryUnlessAuthz,
  });

  return {
    items: result.data ?? [],
    status: queryStatus(result),
    error: result.error ? toAdminError(result.error) : null,
    reload: () => {
      void result.refetch();
    },
  };
}

export function useOrgCommands(): {
  readonly create: Command<
    {
      name: string;
      slug: string;
      logoUrl?: string;
      metadata?: Record<string, unknown>;
    },
    OrgId
  >;
  readonly update: Command<{
    permit: Permit<"org.update">;
    orgId: OrgId;
    name?: string;
    slug?: string;
    logoUrl?: string;
  }>;
  readonly setActive: Command<{
    permit: Permit<"org.deactivate"> | Permit<"org.reactivate">;
    orgId: OrgId;
    active: boolean;
    extraMetadata: Record<string, unknown>;
  }>;
} {
  const actor = useActor();

  const create = useCommand<
    {
      name: string;
      slug: string;
      logoUrl?: string;
      metadata?: Record<string, unknown>;
    },
    OrgId
  >({
    actorId: actor.id,
    fields: ["name", "slug", "logo", "metadata"],
    send: async (input) =>
      adminRequest({
        method: "POST",
        path: "/organizations",
        body: {
          name: input.name,
          slug: input.slug,
          logo: input.logoUrl,
          metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
        },
        parse: (raw, at) => asOrgId(str(obj(raw, at), "id", at)),
      }),
    effect: (_input, orgId) => ({ on: "org.created", orgId }),
    toast: () => "Organization created",
  });

  const update = useCommand<{
    permit: Permit<"org.update">;
    orgId: OrgId;
    name?: string;
    slug?: string;
    logoUrl?: string;
  }>({
    actorId: actor.id,
    fields: ["name", "slug", "logo"],
    send: async (input) => {
      await adminRequest({
        method: "PATCH",
        path: `/organizations/${encodeURIComponent(input.orgId)}`,
        body: {
          name: input.name,
          slug: input.slug,
          logo: input.logoUrl,
        },
        parse: () => undefined,
      });
    },
    effect: (input) => ({ on: "org.updated", orgId: input.orgId }),
    toast: () => "Organization updated",
  });

  const setActive = useCommand<{
    permit: Permit<"org.deactivate"> | Permit<"org.reactivate">;
    orgId: OrgId;
    active: boolean;
    extraMetadata: Record<string, unknown>;
  }>({
    actorId: actor.id,
    send: async (input) => {
      if (!input.active) {
        await adminRequest({
          method: "DELETE",
          path: `/organizations/${encodeURIComponent(input.orgId)}`,
          parse: () => undefined,
        });
        return;
      }
      await adminRequest({
        method: "PATCH",
        path: `/organizations/${encodeURIComponent(input.orgId)}`,
        body: {
          metadata: JSON.stringify({ ...input.extraMetadata, active: true }),
        },
        parse: () => undefined,
      });
    },
    effect: (input) => ({ on: "org.activeChanged", orgId: input.orgId }),
    toast: (input) => (input.active ? "Organization reactivated" : "Organization deactivated"),
  });

  return { create, update, setActive };
}
