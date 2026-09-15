"use client";

import { useQuery } from "@tanstack/react-query";
import { toAdminError } from "./errors";
import { adminRequest } from "./http";
import { asUserId, type UserId } from "./ids";
import { useActor } from "./identity";
import { keys } from "./keys";
import {
  parsePageNumber,
  parsePageSize,
  queryStatus,
  type ListResult,
  type CollectionResult,
  type QueryCodec,
} from "./paging";
import { date, list, num, obj, optStr, str } from "./read";
import { retryUnlessAuthz } from "./errors";

export const AUDIT_ACTIONS = [
  "user.create",
  "user.update",
  "user.suspend",
  "user.unsuspend",
  "user.reset_password",
  "user.add_membership",
  "user.update_membership",
  "user.remove_membership",
  "org.create",
  "org.update",
  "org.deactivate",
  "session.revoke",
  "session.revoke_all",
] as const;

export type KnownAuditAction = (typeof AUDIT_ACTIONS)[number];
export type AuditActionName = KnownAuditAction | (string & {});

export type EntityRef = {
  readonly type: string;
  readonly id: string;
};

export type AuditEntry = {
  readonly id: string;
  readonly action: AuditActionName;
  readonly actor: {
    readonly id: UserId;
    readonly name: string;
    readonly email: string;
  } | null;
  readonly entity: EntityRef;
  readonly details: Readonly<Record<string, unknown>> | null;
  readonly ipAddress: string | null;
  readonly at: Date;
};

export type AuditQuery = {
  readonly page: number;
  readonly limit: number;
  readonly action: string | undefined;
  readonly entityType: string | undefined;
  readonly actorId: UserId | undefined;
  readonly from: string | undefined;
  readonly to: string | undefined;
};

export function parseAuditEntry(raw: unknown, at: string): AuditEntry {
  const row = obj(raw, at);
  const actorId = optStr(row, "actorId", at);
  const actorName = optStr(row, "actorName", at);
  const actorEmail = optStr(row, "actorEmail", at);
  const detailsRaw = row.details;
  let details: Record<string, unknown> | null = null;
  if (detailsRaw && typeof detailsRaw === "object" && !Array.isArray(detailsRaw)) {
    details = detailsRaw as Record<string, unknown>;
  }
  return {
    id: str(row, "id", at),
    action: str(row, "action", at),
    actor:
      actorId && actorName && actorEmail
        ? { id: asUserId(actorId), name: actorName, email: actorEmail }
        : null,
    entity: {
      type: str(row, "entityType", at),
      id: str(row, "entityId", at),
    },
    details,
    ipAddress: optStr(row, "ipAddress", at),
    at: date(row, "createdAt", at),
  };
}

export const auditQuery: QueryCodec<AuditQuery> = {
  parse: (params) => ({
    page: parsePageNumber(params.get("page")),
    limit: parsePageSize(params.get("limit")),
    action: params.get("action") || undefined,
    entityType: params.get("entityType") || undefined,
    actorId: params.get("actorId") ? asUserId(params.get("actorId") as string) : undefined,
    from: params.get("from") || undefined,
    to: params.get("to") || undefined,
  }),
  serialize: (query) => {
    const params = new URLSearchParams();
    if (query.page > 1) params.set("page", String(query.page));
    if (query.limit !== 20) params.set("limit", String(query.limit));
    if (query.action) params.set("action", query.action);
    if (query.entityType) params.set("entityType", query.entityType);
    if (query.actorId) params.set("actorId", query.actorId);
    if (query.from) params.set("from", query.from);
    if (query.to) params.set("to", query.to);
    return params;
  },
};

function parseAuditPage(raw: unknown, at: string): { items: AuditEntry[]; page: { page: number; limit: number; total: number; totalPages: number } } {
  const envelope = obj(raw, at);
  return {
    items: list(envelope.data, `${at}.data`, parseAuditEntry),
    page: {
      page: num(envelope, "page", at),
      limit: num(envelope, "limit", at),
      total: num(envelope, "total", at),
      totalPages: num(envelope, "totalPages", at),
    },
  };
}

export function useAuditLog(query: AuditQuery): ListResult<AuditEntry> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.audit.list(actor.id, query),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: "/audit",
        query: {
          page: query.page,
          limit: query.limit,
          action: query.action,
          entityType: query.entityType,
          actorId: query.actorId,
          startDate: query.from,
          endDate: query.to,
        },
        parse: parseAuditPage,
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

export function useEntityTrail(entity: EntityRef): CollectionResult<AuditEntry> {
  const actor = useActor();
  const result = useQuery({
    queryKey: keys.audit.entity(actor.id, entity.type, entity.id),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: `/audit/${encodeURIComponent(entity.type)}/${encodeURIComponent(entity.id)}`,
        parse: (raw, at) => list(raw, at, parseAuditEntry),
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
