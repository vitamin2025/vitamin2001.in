"use client";

import { Badge } from "@/components/ui/badge";
import { AdminPageHeader, ErrorState, StatCard } from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientBilling, useClientInvoices } from "@/lib/client-admin";

export function BillingView() {
  const billing = useClientBilling();
  const invoices = useClientInvoices();

  if (billing.status === "failed" && billing.error) {
    return <ErrorState error={billing.error} onRetry={billing.reload} />;
  }

  if (!billing.item) {
    return <Skeleton className="h-64 w-full" />;
  }

  const subscription = billing.item;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Billing"
        description="Plan, seats, and invoices for this organization."
      />
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{subscription.plan}</Badge>
        <Badge variant="success">{subscription.status}</Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Seats used" value={subscription.seatsAllocated} />
        <StatCard label="Seat limit" value={subscription.maxSeats} />
        <StatCard label="Billing cycle" value={subscription.billingCycle} />
        <StatCard
          label="Payment method"
          value={subscription.paymentMethod ?? "None"}
        />
      </div>
      {subscription.message ? (
        <p className="text-sm text-slate-500">{subscription.message}</p>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Invoices</h2>
        {invoices.status === "failed" && invoices.error ? (
          <ErrorState error={invoices.error} onRetry={invoices.reload} />
        ) : !invoices.item ? (
          <Skeleton className="h-24 w-full" />
        ) : invoices.item.items.length === 0 ? (
          <p className="text-sm text-slate-500">
            {invoices.item.message ?? "No invoices yet."}
          </p>
        ) : (
          <ul className="space-y-2">
            {invoices.item.items.map((invoice) => (
              <li
                key={invoice.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                {invoice.label}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
