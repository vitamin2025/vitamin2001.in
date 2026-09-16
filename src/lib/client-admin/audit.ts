"use client";

import { useQuery } from "@tanstack/react-query";
import { orgRequest } from "@/lib/admin/http";
import { toAdminError, retryUnlessAuthz } from "@/lib/admin/errors";
import {
  parsePageNumber,
  parsePageSize,
  queryStatus,
  type ListResult,
  type QueryCodec,
} from "@/lib/admin/paging";
import { list, num, obj } from "@/lib/admin/read";
import {
  parseAuditEntry,
  type AuditEntry,
} from "@/lib/admin/audit";
import { useActor } from "@/lib/admin/identity";
import { useClientDashboard } from "./identity";
import { clientAdminKeys } from "./keys";

export type ClientAuditQuery = {
  readonly page: number;
  readonly limit: number;
  readonly action: string | undefined;
};

export const clientAuditQuery: QueryCodec<ClientAuditQuery> = {
  parse: (params) => ({
    page: parsePageNumber(params.get("page")),
    limit: parsePageSize(params.get("limit")),
    action: params.get("action") || undefined,
  }),
  serialize: (query) => {
    const params = new URLSearchParams();
    if (query.page > 1) params.set("page", String(query.page));
    if (query.limit !== 20) params.set("limit", String(query.limit));
    if (query.action) params.set("action", query.action);
    return params;
  },
};

function parseAuditPage(
  raw: unknown,
  at: string,
): {
  items: AuditEntry[];
  page: { page: number; limit: number; total: number; totalPages: number };
} {
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

export function useClientAuditLog(query: ClientAuditQuery): ListResult<AuditEntry> {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;
  const result = useQuery({
    queryKey: clientAdminKeys.audit(actor.id, slug, query),
    queryFn: () =>
      orgRequest({
        method: "GET",
        path: "/admin/audit",
        query: {
          page: query.page,
          limit: query.limit,
          action: query.action,
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
