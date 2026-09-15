"use client";

import { useQuery } from "@tanstack/react-query";
import { useCommand, type Command } from "./command";
import { toAdminError } from "./errors";
import { adminRequest } from "./http";
import {
  asMemberId,
  asOrgId,
  asUserId,
  type MemberId,
  type OrgId,
  type UserId,
} from "./ids";
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
  parseOrgRole,
  userCapabilities,
  membershipCapabilities,
  SYSTEM_ORG_SLUG,
  type MembershipCapabilities,
  type OrgRole,
  type Permit,
  type Suspension,
  type UserCapabilities,
} from "./policy";
import { bool, date, list, num, obj, optDate, optStr, str } from "./read";
import { retryUnlessAuthz } from "./errors";

export type UserRow = {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly imageUrl: string | null;
  readonly suspension: Suspension;
  readonly membershipCount: number;
  readonly activeSessionCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly can: UserCapabilities;
};

export type LinkedAccount = {
  readonly id: string;
  readonly provider: string;
  readonly linkedAt: Date;
};

export type UserDetail = Omit<UserRow, "membershipCount" | "activeSessionCount"> & {
  readonly credentials: readonly LinkedAccount[];
  readonly membershipCount: number;
  readonly activeSessionCount: number;
};

export type OrgRef = {
  readonly id: OrgId;
  readonly name: string;
  readonly slug: string;
  readonly isSystem: boolean;
};

export type Membership = {
  readonly memberId: MemberId;
  readonly userId: UserId;
  readonly org: OrgRef;
  readonly role: OrgRole;
  readonly joinedAt: Date;
  readonly can: MembershipCapabilities;
};

export type UserListQuery = {
  readonly page: number;
  readonly limit: number;
  readonly q: string;
  readonly orgId: OrgId | undefined;
  readonly banned: boolean | undefined;
};

export type CreateUserInput = {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly assignment?: { readonly orgId: OrgId; readonly role: OrgRole };
};

export type UpdateProfileInput = {
  readonly permit: Permit<"user.update">;
  readonly userId: UserId;
  readonly name?: string;
  readonly email?: string;
};

export type SetSuspendedInput =
  | {
      readonly permit: Permit<"user.suspend">;
      readonly userId: UserId;
      readonly suspended: true;
      readonly reason?: string;
      readonly expiresAt?: Date;
    }
  | {
      readonly permit: Permit<"user.unsuspend">;
      readonly userId: UserId;
      readonly suspended: false;
    };

export type ResetPasswordInput = {
  readonly permit: Permit<"user.resetPassword">;
  readonly userId: UserId;
  readonly newPassword: string;
};

function parseSuspension(row: Record<string, unknown>, at: string): Suspension {
  const banned = bool(row, "banned", at);
  if (!banned) return { state: "active" };
  return {
    state: "suspended",
    reason: optStr(row, "banReason", at),
    expiresAt: optDate(row, "banExpires", at),
  };
}

function parseUserRow(raw: unknown, at: string, actor: ReturnType<typeof useActor>): UserRow {
  const row = obj(raw, at);
  const id = asUserId(str(row, "id", at));
  const suspension = parseSuspension(row, at);
  const activeSessionCount = num(row, "activeSessionsCount", at);
  return {
    id,
    name: str(row, "name", at),
    email: str(row, "email", at),
    emailVerified: bool(row, "emailVerified", at),
    imageUrl: optStr(row, "image", at),
    suspension,
    membershipCount: num(row, "membershipsCount", at),
    activeSessionCount,
    createdAt: date(row, "createdAt", at),
    updatedAt: date(row, "updatedAt", at),
    can: userCapabilities(actor, { id, suspension, activeSessionCount }),
  };
}

function parseMembership(raw: unknown, at: string, userId: UserId, actor: ReturnType<typeof useActor>): Membership {
  const row = obj(raw, at);
  const slug = str(row, "organizationSlug", at);
  return {
    memberId: asMemberId(str(row, "memberId", at)),
    userId,
    org: {
      id: asOrgId(str(row, "organizationId", at)),
      name: str(row, "organizationName", at),
      slug,
      isSystem: slug === SYSTEM_ORG_SLUG,
    },
    role: parseOrgRole(str(row, "role", at)),
    joinedAt: date(row, "joinedAt", at),
    can: membershipCapabilities(actor, {
      userId,
      role: parseOrgRole(str(row, "role", at)),
      orgSlug: slug,
    }),
  };
}

function parseUserDetail(raw: unknown, at: string, actor: ReturnType<typeof useActor>): UserDetail {
  const envelope = obj(raw, at);
  const row = obj(envelope.user, `${at}.user`);
  const id = asUserId(str(row, "id", `${at}.user`));
  const suspension = parseSuspension(row, `${at}.user`);
  const memberships = list(envelope.memberships, `${at}.memberships`, (item, itemAt) =>
    parseMembership(item, itemAt, id, actor),
  );
  const credentials = list(envelope.accounts, `${at}.accounts`, (item, itemAt) => {
    const account = obj(item, itemAt);
    return {
      id: str(account, "id", itemAt),
      provider: str(account, "providerId", itemAt),
      linkedAt: date(account, "createdAt", itemAt),
    };
  });
  return {
    id,
    name: str(row, "name", `${at}.user`),
    email: str(row, "email", `${at}.user`),
    emailVerified: bool(row, "emailVerified", `${at}.user`),
    imageUrl: optStr(row, "image", `${at}.user`),
    suspension,
    membershipCount: memberships.length,
    activeSessionCount: 0,
    createdAt: date(row, "createdAt", `${at}.user`),
    updatedAt: date(row, "updatedAt", `${at}.user`),
    credentials,
    can: userCapabilities(actor, {
      id,
      suspension,
      activeSessionCount: 0,
    }),
  };
}

export const userListQuery: QueryCodec<UserListQuery> = {
  parse: (params) => ({
    page: parsePageNumber(params.get("page")),
    limit: parsePageSize(params.get("limit")),
    q: params.get("q") ?? "",
    orgId: params.get("organizationId")
      ? asOrgId(params.get("organizationId") as string)
      : undefined,
    banned:
      params.get("banned") === "true"
        ? true
        : params.get("banned") === "false"
          ? false
          : undefined,
  }),
  serialize: (query) => {
    const params = new URLSearchParams();
    if (query.page > 1) params.set("page", String(query.page));
    if (query.limit !== 20) params.set("limit", String(query.limit));
    if (query.q) params.set("q", query.q);
    if (query.orgId) params.set("organizationId", query.orgId);
    if (query.banned !== undefined) params.set("banned", String(query.banned));
    return params;
  },
};

export function useUsers(query: UserListQuery): ListResult<UserRow> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.users.list(actor.id, query),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: "/users",
        query: {
          page: query.page,
          limit: query.limit,
          q: query.q || undefined,
          organizationId: query.orgId,
          banned: query.banned,
        },
        parse: (raw, at) => {
          const envelope = obj(raw, at);
          return {
            items: list(envelope.data, `${at}.data`, (item, itemAt) =>
              parseUserRow(item, itemAt, actor),
            ),
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

export function useUser(userId: UserId): DetailResult<UserDetail> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.users.detail(actor.id, userId),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: `/users/${encodeURIComponent(userId)}`,
        parse: (raw, at) => parseUserDetail(raw, at, actor),
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

export function useUserMemberships(userId: UserId): CollectionResult<Membership> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.users.memberships(actor.id, userId),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: `/users/${encodeURIComponent(userId)}/memberships`,
        parse: (raw, at) =>
          list(raw, at, (item, itemAt) => parseMembership(item, itemAt, userId, actor)),
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

export function useUserCommands(): {
  readonly create: Command<CreateUserInput, UserId>;
  readonly updateProfile: Command<UpdateProfileInput>;
  readonly setSuspended: Command<SetSuspendedInput>;
  readonly resetPassword: Command<ResetPasswordInput>;
} {
  const actor = useActor();

  const create = useCommand<CreateUserInput, UserId>({
    actorId: actor.id,
    fields: ["name", "email", "password", "organizationId", "role"],
    send: async (input) =>
      adminRequest({
        method: "POST",
        path: "/users",
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
          organizationId: input.assignment?.orgId,
          role: input.assignment?.role,
        },
        parse: (raw, at) => asUserId(str(obj(raw, at), "id", at)),
      }),
    effect: (input, userId) => ({
      on: "user.created",
      userId,
      orgId: input.assignment?.orgId ?? null,
    }),
    toast: () => "User created",
  });

  const updateProfile = useCommand<UpdateProfileInput>({
    actorId: actor.id,
    fields: ["name", "email"],
    send: async (input) => {
      await adminRequest({
        method: "PATCH",
        path: `/users/${encodeURIComponent(input.userId)}`,
        body: { name: input.name, email: input.email },
        parse: () => undefined,
      });
    },
    effect: (input) => ({ on: "user.updated", userId: input.userId }),
    toast: () => "User updated",
  });

  const setSuspended = useCommand<SetSuspendedInput>({
    actorId: actor.id,
    fields: ["banned", "banReason", "banExpires"],
    send: async (input) => {
      await adminRequest({
        method: "PATCH",
        path: `/users/${encodeURIComponent(input.userId)}/suspend`,
        body: input.suspended
          ? {
              banned: true,
              banReason: input.reason,
              banExpires: input.expiresAt?.toISOString(),
            }
          : { banned: false },
        parse: () => undefined,
      });
    },
    effect: (input) => ({ on: "user.suspensionChanged", userId: input.userId }),
    toast: (input) => (input.suspended ? "User suspended" : "User restored"),
  });

  const resetPassword = useCommand<ResetPasswordInput>({
    actorId: actor.id,
    fields: ["newPassword"],
    send: async (input) => {
      await adminRequest({
        method: "POST",
        path: `/users/${encodeURIComponent(input.userId)}/reset-password`,
        body: { newPassword: input.newPassword },
        parse: () => undefined,
      });
    },
    effect: (input) => ({ on: "user.passwordReset", userId: input.userId }),
    toast: () => "Password reset",
    onDone: (input) => {
      if (input.userId === actor.id) {
        // Full reload so the actor-scoped query cache cannot leak after self-kick.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`${window.location.origin}/admin/login`);
      }
    },
  });

  return { create, updateProfile, setSuspended, resetPassword };
}

export function useMembershipCommands(userId: UserId): {
  readonly add: Command<
    { permit: Permit<"membership.add">; orgId: OrgId; role: OrgRole },
    MemberId
  >;
  readonly setRole: Command<{
    permit: Permit<"membership.update">;
    memberId: MemberId;
    role: OrgRole;
  }>;
  readonly remove: Command<{
    permit: Permit<"membership.remove">;
    memberId: MemberId;
  }>;
} {
  const actor = useActor();

  const add = useCommand<
    { permit: Permit<"membership.add">; orgId: OrgId; role: OrgRole },
    MemberId
  >({
    actorId: actor.id,
    fields: ["organizationId", "role"],
    send: async (input) =>
      adminRequest({
        method: "POST",
        path: `/users/${encodeURIComponent(userId)}/memberships`,
        body: { organizationId: input.orgId, role: input.role },
        parse: (raw, at) => asMemberId(str(obj(raw, at), "memberId", at)),
      }),
    effect: (input) => ({
      on: "membership.changed",
      userId,
      orgId: input.orgId,
    }),
    toast: () => "Membership added",
  });

  const setRole = useCommand<{
    permit: Permit<"membership.update">;
    memberId: MemberId;
    role: OrgRole;
  }>({
    actorId: actor.id,
    fields: ["role"],
    send: async (input) => {
      await adminRequest({
        method: "PATCH",
        path: `/users/${encodeURIComponent(userId)}/memberships/${encodeURIComponent(input.memberId)}`,
        body: { role: input.role },
        parse: () => undefined,
      });
    },
    effect: () => ({ on: "membership.changed", userId, orgId: null }),
    toast: () => "Role updated",
  });

  const remove = useCommand<{
    permit: Permit<"membership.remove">;
    memberId: MemberId;
  }>({
    actorId: actor.id,
    send: async (input) => {
      await adminRequest({
        method: "DELETE",
        path: `/users/${encodeURIComponent(userId)}/memberships/${encodeURIComponent(input.memberId)}`,
        parse: () => undefined,
      });
    },
    effect: () => ({ on: "membership.changed", userId, orgId: null }),
    toast: () => "Membership removed",
  });

  return { add, setRole, remove };
}
