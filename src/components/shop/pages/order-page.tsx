"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, Download, Loader2, PackageSearch, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isShopApiError, shopErrorMessage } from "@/lib/shop/api";
import { formatDate, formatMoney } from "@/lib/shop/format";
import { shopKeys, useOrderStatus } from "@/lib/shop/hooks";
import { loginHref, useShopStore } from "@/lib/shop/store-context";
import { useHydrated } from "@/lib/shop/use-hydrated";
import type { OrderStatus, Shipment } from "@/lib/shop/types";
import { accentLinkClass, outlineLinkClass } from "../accent-button";
import { PaidOrderDetails, placedOn, TrackingCodes, TrackingSteps, type TrackingStep } from "../paid-order";
import { EmptyState } from "../shop-states";

function trackingSteps(status: OrderStatus): TrackingStep[] {
  const shipments: readonly Shipment[] = status.shipments ?? [];
  const shipped = shipments.length > 0;
  const delivered = shipped && shipments.every((shipment) => shipment.status === "delivered");
  const codes = [...new Set(shipments.flatMap((shipment) => shipment.trackingCodes))];
  const lastUpdate = shipments[0]?.updatedAt;
  return [
    {
      label: "Order confirmed",
      detail: status.order?.placedAt ? formatDate(status.order.placedAt) : undefined,
      done: true,
    },
    {
      label: shipped ? "Shipped" : "Packing your order",
      detail: shipped ? (
        <>
          {!delivered && lastUpdate && <p>{formatDate(lastUpdate)}</p>}
          <TrackingCodes codes={codes} />
        </>
      ) : (
        "We'll email you the tracking details when it ships."
      ),
      done: shipped,
    },
    {
      label: "Delivered",
      detail: delivered && lastUpdate ? formatDate(lastUpdate) : undefined,
      done: delivered,
    },
  ];
}

function Confirmed({ status }: { status: OrderStatus }) {
  const { basePath } = useShopStore();
  const order = status.order;
  const name = order?.customer?.name.split(" ")[0];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {name ? `Thank you, ${name}!` : "Thank you for your order!"}
        </h1>
        <p className="mt-3 text-slate-600">
          Order <span className="font-mono font-semibold text-slate-900">{status.code}</span> is confirmed.
          {order?.customer?.email && (
            <>
              {" "}
              We&apos;ve emailed the details to <span className="font-medium text-slate-900">{order.customer.email}</span>.
            </>
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {status.invoice && (
            <a href={status.invoice.url} target="_blank" rel="noopener noreferrer" className={outlineLinkClass()}>
              <Download /> GST invoice {status.invoice.number}
            </a>
          )}
          <Link href={`${basePath}/products`} className={accentLinkClass()}>
            Continue shopping
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[220px_1fr]">
        <section aria-label="Delivery">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Delivery</h2>
          <TrackingSteps steps={trackingSteps(status)} />
        </section>
        <section aria-label="Order details">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Order details</h2>
            <p className="text-sm text-slate-500">{placedOn(order?.placedAt)}</p>
          </div>
          {order ? (
            <PaidOrderDetails order={order} />
          ) : (
            <p className="text-sm text-slate-600">
              Paid {formatMoney(status.payment.amountMinor, status.payment.currency)}.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function Waiting({ status, stillConfirming }: { status: OrderStatus; stillConfirming: boolean }) {
  const paid = status.payment.status === "paid";
  return (
    <EmptyState
      icon={stillConfirming ? <Clock className="h-7 w-7" /> : <Loader2 className="h-7 w-7 animate-spin" />}
      title={
        stillConfirming
          ? "We're still confirming your payment"
          : paid
            ? "Payment received, confirming your order"
            : "Waiting for payment confirmation"
      }
    >
      {stillConfirming ? (
        <p>You&apos;ll get an email as soon as it&apos;s done. There&apos;s no need to pay again.</p>
      ) : (
        <p>This usually takes a few seconds. Keep this page open; it updates by itself.</p>
      )}
      <p className="mt-3 text-xs text-slate-400">
        Order {status.code} · {formatMoney(status.payment.amountMinor, status.payment.currency)}
      </p>
    </EmptyState>
  );
}

export function OrderPage({ code }: { code: string | null }) {
  const { basePath, seller, userRoot } = useShopStore();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: status, isPending, isError, error, refetch, stillConfirming } = useOrderStatus(code);
  const paymentStatus = status?.payment.status;
  const hydrated = useHydrated();

  // A confirmed payment empties the cart; a failed one unlocks it.
  useEffect(() => {
    if (paymentStatus && paymentStatus !== "pending" && paymentStatus !== "paid") {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart(seller) });
    }
  }, [paymentStatus, queryClient, seller]);

  if (!code) {
    return (
      <EmptyState
        icon={<PackageSearch className="h-7 w-7" />}
        title="No order to show"
        action={
          <Link href={`${basePath}/account`} className={accentLinkClass()}>
            See your orders
          </Link>
        }
      >
        Open the link in your order confirmation email, or sign in to see your orders.
      </EmptyState>
    );
  }

  if (!hydrated || (isPending && !isError)) {
    return (
      <EmptyState icon={<Loader2 className="h-7 w-7 animate-spin" />} title="Checking your order…">
        One moment while we look up order {code}.
      </EmptyState>
    );
  }

  if (isError) {
    if (isShopApiError(error) && error.code === "ORDER_NOT_FOUND") {
      return (
        <EmptyState
          icon={<PackageSearch className="h-7 w-7" />}
          title="We can't show this order here"
          action={
            <Link href={loginHref(userRoot, `${pathname}?order=${encodeURIComponent(code)}`)} className={accentLinkClass()}>
              Sign in
            </Link>
          }
        >
          Sign in, or open this page on the device you paid with. Your confirmation email has the order details.
        </EmptyState>
      );
    }
    return (
      <EmptyState
        icon={<AlertTriangle className="h-7 w-7" />}
        title="We couldn't check your order"
        action={<Button onClick={() => refetch()}>Try again</Button>}
      >
        {shopErrorMessage(error)} If you paid, your payment is safe; you&apos;ll also get an email.
      </EmptyState>
    );
  }

  switch (status.payment.status) {
    case "confirmed":
      return <Confirmed status={status} />;
    case "pending":
    case "paid":
      return <Waiting status={status} stillConfirming={stillConfirming} />;
    case "failed":
      return (
        <EmptyState
          icon={<XCircle className="h-7 w-7" />}
          title="Payment failed"
          action={
            <Link href={`${basePath}/checkout`} className={accentLinkClass()}>
              Back to checkout
            </Link>
          }
        >
          The payment didn&apos;t go through, so your order isn&apos;t placed. Your cart is saved, so you can try
          again. If money was deducted anyway, we keep checking with the bank and will email you if it completes.
        </EmptyState>
      );
    case "cancelled":
      return (
        <EmptyState
          icon={<XCircle className="h-7 w-7" />}
          title="Payment not completed"
          action={
            <Link href={`${basePath}/cart`} className={accentLinkClass()}>
              Go to your cart
            </Link>
          }
        >
          This payment was closed without being paid. Your cart is still there if you&apos;d like to try again.
        </EmptyState>
      );
    case "review":
      return (
        <EmptyState icon={<ShieldCheck className="h-7 w-7" />} title="We received your payment">
          Our team needs to check something about order {status.code} and will contact you soon. There&apos;s no need
          to pay again.
        </EmptyState>
      );
  }
}
