"use client";

import { useQuery } from "@tanstack/react-query";
import { orgRequest } from "@/lib/admin/http";
import { toAdminError, retryUnlessAuthz } from "@/lib/admin/errors";
import { queryStatus, type DetailResult } from "@/lib/admin/paging";
import { list, num, obj, optStr, str } from "@/lib/admin/read";
import { useActor } from "@/lib/admin/identity";
import { useClientDashboard } from "./identity";
import { clientAdminKeys } from "./keys";

export type ClientBilling = {
  readonly plan: string;
  readonly status: string;
  readonly seatsAllocated: number;
  readonly maxSeats: number;
  readonly billingCycle: string;
  readonly paymentMethod: string | null;
  readonly message: string | null;
};

export type ClientInvoice = {
  readonly id: string;
  readonly label: string;
};

export type ClientInvoices = {
  readonly organizationId: string;
  readonly items: readonly ClientInvoice[];
  readonly total: number;
  readonly message: string | null;
};

function parseBilling(raw: unknown, at: string): ClientBilling {
  const row = obj(raw, at);
  return {
    plan: str(row, "plan", at),
    status: str(row, "status", at),
    seatsAllocated: num(row, "seatsAllocated", at),
    maxSeats: num(row, "maxSeats", at),
    billingCycle: str(row, "billingCycle", at),
    paymentMethod: optStr(row, "paymentMethod", at),
    message: optStr(row, "message", at),
  };
}

function parseInvoice(raw: unknown, at: string): ClientInvoice {
  const row = obj(raw, at);
  const id = optStr(row, "id", at) ?? String(row.id ?? at);
  const label =
    optStr(row, "number", at) ??
    optStr(row, "label", at) ??
    optStr(row, "id", at) ??
    "Invoice";
  return { id, label };
}

function parseInvoices(raw: unknown, at: string): ClientInvoices {
  const row = obj(raw, at);
  return {
    organizationId: str(row, "organizationId", at),
    items: Array.isArray(row.data)
      ? list(row.data, `${at}.data`, parseInvoice)
      : [],
    total: num(row, "total", at),
    message: optStr(row, "message", at),
  };
}

export function useClientBilling(): DetailResult<ClientBilling> {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;
  const result = useQuery({
    queryKey: clientAdminKeys.billing(actor.id, slug),
    queryFn: () =>
      orgRequest({
        method: "GET",
        path: "/admin/billing",
        parse: parseBilling,
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

export function useClientInvoices(): DetailResult<ClientInvoices> {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;
  const result = useQuery({
    queryKey: clientAdminKeys.invoices(actor.id, slug),
    queryFn: () =>
      orgRequest({
        method: "GET",
        path: "/admin/billing/invoices",
        parse: parseInvoices,
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
