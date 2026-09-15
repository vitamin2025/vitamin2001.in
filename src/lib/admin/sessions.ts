"use client";

import { useQuery } from "@tanstack/react-query";
import { useCommand, type Command } from "./command";
import { toAdminError } from "./errors";
import { adminRequest } from "./http";
import { asOrgId, asSessionId, asUserId, type OrgId, type SessionId, type UserId } from "./ids";
import { useActor } from "./identity";
import { keys } from "./keys";
import {
  parsePageNumber,
  parsePageSize,
  queryStatus,
  type CollectionResult,
  type ListResult,
  type QueryCodec,
} from "./paging";
import { sessionCapabilities, type SessionCapabilities, type Permit } from "./policy";
import { date, describeClient, list, num, obj, optStr, str } from "./read";
import { retryUnlessAuthz } from "./errors";
import { adminRoutes } from "./routes";

export type SessionRow = {
  readonly id: SessionId;
  readonly user: {
    readonly id: UserId;
    readonly name: string;
    readonly email: string;
  };
  readonly ipAddress: string | null;
  readonly client: string;
  readonly userAgent: string | null;
  readonly activeOrgId: OrgId | null;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  readonly isCurrent: boolean;
  readonly can: SessionCapabilities;
};

export type SessionListQuery = {
  readonly page: number;
  readonly limit: number;
  readonly userId: UserId | undefined;
};

function parseSessionRow(
  raw: unknown,
  at: string,
  actor: ReturnType<typeof useActor>,
  userFallback?: { id: UserId; name: string; email: string },
): SessionRow {
  const row = obj(raw, at);
  const id = asSessionId(str(row, "id", at));
  const userId = row.userId ? asUserId(str(row, "userId", at)) : userFallback?.id;
  if (!userId) {
    throw toAdminError({ kind: "malformed", message: "Missing userId", at });
  }
  const userAgent = optStr(row, "userAgent", at);
  return {
    id,
    user: {
      id: userId,
      name: optStr(row, "userName", at) ?? userFallback?.name ?? "Unknown",
      email: optStr(row, "userEmail", at) ?? userFallback?.email ?? "",
    },
    ipAddress: optStr(row, "ipAddress", at),
    client: describeClient(userAgent),
    userAgent,
    activeOrgId: optStr(row, "activeOrganizationId", at)
      ? asOrgId(optStr(row, "activeOrganizationId", at) as string)
      : null,
    createdAt: date(row, "createdAt", at),
    expiresAt: date(row, "expiresAt", at),
    isCurrent: id === actor.sessionId,
    can: sessionCapabilities(actor, { id }),
  };
}

export const sessionListQuery: QueryCodec<SessionListQuery> = {
  parse: (params) => ({
    page: parsePageNumber(params.get("page")),
    limit: parsePageSize(params.get("limit")),
    userId: params.get("userId") ? asUserId(params.get("userId") as string) : undefined,
  }),
  serialize: (query) => {
    const params = new URLSearchParams();
    if (query.page > 1) params.set("page", String(query.page));
    if (query.limit !== 20) params.set("limit", String(query.limit));
    if (query.userId) params.set("userId", query.userId);
    return params;
  },
};

export function useSessions(query: SessionListQuery): ListResult<SessionRow> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.sessions.list(actor.id, query),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: "/sessions",
        query: {
          page: query.page,
          limit: query.limit,
          userId: query.userId,
        },
        parse: (raw, at) => {
          const envelope = obj(raw, at);
          return {
            items: list(envelope.data, `${at}.data`, (item, itemAt) =>
              parseSessionRow(item, itemAt, actor),
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

export function useUserSessions(userId: UserId): CollectionResult<SessionRow> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.sessions.byUser(actor.id, userId),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: `/sessions/user/${encodeURIComponent(userId)}`,
        parse: (raw, at) => {
          const envelope = obj(raw, at);
          const user = obj(envelope.user, `${at}.user`);
          const fallback = {
            id: asUserId(str(user, "id", `${at}.user`)),
            name: str(user, "name", `${at}.user`),
            email: str(user, "email", `${at}.user`),
          };
          return list(envelope.sessions, `${at}.sessions`, (item, itemAt) =>
            parseSessionRow(item, itemAt, actor, fallback),
          );
        },
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

export function useSessionCommands(): {
  readonly revoke: Command<{ permit: Permit<"session.revoke">; sessionId: SessionId }>;
  readonly revokeAllForUser: Command<{
    permit: Permit<"session.revokeAllForUser">;
    userId: UserId;
  }>;
} {
  const actor = useActor();

  const revoke = useCommand<{ permit: Permit<"session.revoke">; sessionId: SessionId }>({
    actorId: actor.id,
    send: async (input) => {
      await adminRequest({
        method: "DELETE",
        path: `/sessions/${encodeURIComponent(input.sessionId)}`,
        parse: () => undefined,
      });
    },
    effect: () => ({ on: "session.revoked", userId: null }),
    toast: () => "Session revoked",
    onDone: (input) => {
      if (input.sessionId === actor.sessionId) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`${window.location.origin}${adminRoutes.login()}`);
      }
    },
  });

  const revokeAllForUser = useCommand<{
    permit: Permit<"session.revokeAllForUser">;
    userId: UserId;
  }>({
    actorId: actor.id,
    send: async (input) => {
      await adminRequest({
        method: "DELETE",
        path: `/sessions/user/${encodeURIComponent(input.userId)}`,
        parse: () => undefined,
      });
    },
    effect: (input) => ({ on: "session.revoked", userId: input.userId }),
    toast: () => "Sessions revoked",
    onDone: (input) => {
      if (input.userId === actor.id) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`${window.location.origin}${adminRoutes.login()}`);
      }
    },
  });

  return { revoke, revokeAllForUser };
}
