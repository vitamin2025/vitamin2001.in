"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Download, PackageSearch, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientSession } from "@/lib/client-admin";
import { isShopApiError, shopErrorMessage } from "@/lib/shop/api";
import { formatDate, formatMoney } from "@/lib/shop/format";
import { useMyOrder } from "@/lib/shop/hooks";
import { loginHref, useShopStore } from "@/lib/shop/store-context";
import { useHydrated } from "@/lib/shop/use-hydrated";
import type { MyOrder } from "@/lib/shop/types";
import { accentLinkClass, outlineLinkClass } from "../accent-button";
import { OrderSummary } from "../order-summary";
import { AddressBlock, TrackingCodes, TrackingSteps, type TrackingStep } from "../paid-order";
import { ProductImage } from "../product-card";
import { EmptyState } from "../shop-states";
import { StateBadge } from "./account-page";

function trackingSteps(order: MyOrder): TrackingStep[] {
  const sent = order.fulfillments.filter((fulfillment) => fulfillment.state !== "Cancelled");
  const shipped = sent.filter((fulfillment) => fulfillment.state === "Shipped" || fulfillment.state === "Delivered");
  const delivered = order.state === "Delivered" || (sent.length > 0 && sent.every((f) => f.state === "Delivered"));
  const cancelled = order.state === "Cancelled";
  const codes = [...new Set(shipped.map((f) => f.trackingCode).filter((code): code is string => Boolean(code)))];
  const methods = [...new Set(shipped.map((f) => f.method).filter(Boolean))];
  if (cancelled) {
    return [
      { label: "Order placed", detail: formatDate(order.placedAt), done: true },
      { label: "Cancelled", done: true },
    ];
  }
  return [
    { label: "Order confirmed", detail: formatDate(order.placedAt), done: true },
    {
      label: shipped.length ? "Shipped" : "Packing your order",
      detail: shipped.length ? (
        <>
          {methods.length > 0 && <p>{methods.join(", ")}</p>}
          <TrackingCodes codes={codes} />
        </>
      ) : (
        "We'll email you the tracking details when it ships."
      ),
      done: shipped.length > 0 || delivered,
    },
    { label: "Delivered", done: delivered },
  ];
}

export function AccountOrderPage({ code }: { code: string }) {
  const { basePath, userRoot } = useShopStore();
  const pathname = usePathname();
  const session = useClientSession();
  const signedIn = session.status === "granted";
  const { data: order, isPending, isError, error, refetch } = useMyOrder(code, signedIn);
  const hydrated = useHydrated();

  const back = (
    <Link href={`${basePath}/account`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
      <ArrowLeft className="h-4 w-4" /> All orders
    </Link>
  );

  if (!hydrated || session.status === "checking" || (signedIn && isPending)) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-10 sm:px-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-6 md:grid-cols-[1fr_340px]">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <EmptyState
        icon={<UserRound className="h-7 w-7" />}
        title="Sign in to see this order"
        action={
          <Link href={loginHref(userRoot, pathname)} className={accentLinkClass()}>
            Sign in
          </Link>
        }
      >
        Checked out as a guest? Open the link in your order confirmation email instead.
      </EmptyState>
    );
  }

  if (isError) {
    const notFound = isShopApiError(error) && (error.code === "ORDER_NOT_FOUND" || error.isNotFound);
    return (
      <EmptyState
        icon={<PackageSearch className="h-7 w-7" />}
        title={notFound ? "Order not found" : "We couldn't load this order"}
        action={notFound ? back : <Button onClick={() => refetch()}>Try again</Button>}
      >
        {notFound ? `There's no order ${code} on this account in this shop.` : shopErrorMessage(error)}
      </EmptyState>
    );
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {back}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-tight">{order.code}</h1>
            <StateBadge state={order.state} />
          </div>
          <p className="mt-1 text-sm text-slate-500">Placed on {formatDate(order.placedAt)}</p>
        </div>
        {order.invoice && (
          <a href={order.invoice.url} target="_blank" rel="noopener noreferrer" className={outlineLinkClass()}>
            <Download /> GST invoice {order.invoice.number}
          </a>
        )}
      </div>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section aria-label="Delivery" className="rounded-3xl border border-slate-200 p-5 sm:p-6">
            <h2 className="mb-4 text-base font-semibold">Delivery</h2>
            <TrackingSteps steps={trackingSteps(order)} />
          </section>

          <section aria-label="Items">
            <h2 className="mb-3 text-base font-semibold">Items</h2>
            <ul className="divide-y divide-slate-200 rounded-3xl border border-slate-200">
              {order.lines.map((line) => (
                <li key={line.id} className="flex gap-4 p-4">
                  <Link href={`${basePath}/products/${line.productSlug}`} className="shrink-0">
                    <ProductImage src={line.image} alt={line.productName} className="h-16 w-16 rounded-xl ring-1 ring-slate-200" />
                  </Link>
                  <div className="min-w-0 flex-1 text-sm">
                    <Link href={`${basePath}/products/${line.productSlug}`} className="font-medium text-slate-900 hover:underline">
                      {line.productName}
                    </Link>
                    {line.variantName !== line.productName && <p className="text-slate-500">{line.variantName}</p>}
                    <p className="mt-1 text-slate-500">
                      {line.quantity} × {formatMoney(line.unitPriceMinor, order.currency)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{formatMoney(line.linePriceMinor, order.currency)}</p>
                </li>
              ))}
            </ul>
          </section>

          {(order.shippingAddress || order.billingAddress) && (
            <section className="grid gap-6 sm:grid-cols-2">
              {order.shippingAddress && <AddressBlock title="Delivering to" address={order.shippingAddress} />}
              {order.billingAddress && <AddressBlock title="Billing address" address={order.billingAddress} />}
            </section>
          )}
        </div>

        <div className="space-y-4 md:sticky md:top-24">
          <OrderSummary cart={order} />
          {order.payments.length > 0 && (
            <section className="rounded-3xl border border-slate-200 p-5 text-sm">
              <h2 className="mb-3 font-semibold">Payment</h2>
              <ul className="space-y-2 text-slate-600">
                {order.payments.map((payment, index) => (
                  <li key={`${payment.createdAt}-${index}`} className="flex justify-between gap-3">
                    <span>
                      {payment.method === "payu" ? "PayU" : payment.method} · {formatDate(payment.createdAt)}
                    </span>
                    <span className="tabular-nums">{formatMoney(payment.amountMinor, order.currency)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
