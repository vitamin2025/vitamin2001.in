import type { ReactNode } from "react";
import { CheckCircle2, Circle, PackageCheck, Truck } from "lucide-react";
import { addressLines, formatDate, formatMoney } from "@/lib/shop/format";
import type { Address, OrderSnapshot } from "@/lib/shop/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-card";

export function AddressBlock({ title, address }: { title: string; address: Address }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      <address className="text-sm not-italic leading-relaxed text-slate-600">
        {addressLines(address).map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
    </div>
  );
}

function Row({ label, value, strong }: { label: ReactNode; value: ReactNode; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4", strong ? "text-base font-semibold text-slate-900" : "text-sm text-slate-600")}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

/** The order as it was paid for: items, totals with the GST split, and addresses. */
export function PaidOrderDetails({ order }: { order: OrderSnapshot }) {
  const money = (minor: number) => formatMoney(minor, order.currency);
  return (
    <div className="space-y-8">
      <ul className="divide-y divide-slate-200 rounded-3xl border border-slate-200">
        {order.lines.map((line) => (
          <li key={`${line.sku}-${line.variantName}`} className="flex gap-4 p-4">
            <ProductImage src={line.image} alt={line.productName} className="h-16 w-16 shrink-0 rounded-xl ring-1 ring-slate-200" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium text-slate-900">{line.productName}</p>
              {line.variantName !== line.productName && <p className="text-slate-500">{line.variantName}</p>}
              <p className="mt-1 text-slate-500">Qty {line.quantity}</p>
            </div>
            <p className="text-sm font-semibold tabular-nums text-slate-900">{money(line.totalMinor)}</p>
          </li>
        ))}
      </ul>

      <dl className="space-y-2.5 rounded-3xl bg-slate-50 p-5">
        <Row label={`Items (${order.itemCount})`} value={money(order.subTotalMinor)} />
        {order.discounts.map((discount) => (
          <Row
            key={discount.description}
            label={discount.description}
            value={<span className="text-emerald-700">{money(discount.amountMinor)}</span>}
          />
        ))}
        {order.shipping.map((method) => (
          <Row key={method.name} label={method.name} value={method.totalMinor ? money(method.totalMinor) : "Free"} />
        ))}
        <div className="border-t border-slate-200 pt-3">
          <Row label="Total paid" value={money(order.totalMinor)} strong />
          {order.taxSummary.map((tax) => (
            <p key={`${tax.description}-${tax.rate}`} className="mt-1 text-right text-xs text-slate-500">
              Includes {money(tax.taxMinor)} {tax.description} at {tax.rate}%
            </p>
          ))}
        </div>
      </dl>

      {(order.shippingAddress || order.billingAddress) && (
        <div className="grid gap-6 sm:grid-cols-2">
          {order.shippingAddress && <AddressBlock title="Delivering to" address={order.shippingAddress} />}
          {order.billingAddress && <AddressBlock title="Billing address" address={order.billingAddress} />}
        </div>
      )}
    </div>
  );
}

export interface TrackingStep {
  readonly label: string;
  readonly detail?: ReactNode;
  readonly done: boolean;
}

/** Confirmed, shipped, delivered, with tracking numbers where the seller gave them. */
export function TrackingSteps({ steps }: { steps: readonly TrackingStep[] }) {
  const icons = [CheckCircle2, Truck, PackageCheck];
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const Icon = step.done ? icons[Math.min(index, icons.length - 1)] : Circle;
        const last = index === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5",
                  steps[index + 1]?.done ? "bg-(--shop-accent)" : "bg-slate-200",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                step.done ? "bg-(--shop-accent) text-white" : "bg-slate-100 text-slate-400",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="pt-1 text-sm">
              <p className={cn("font-medium", step.done ? "text-slate-900" : "text-slate-500")}>{step.label}</p>
              {step.detail && <div className="mt-0.5 text-slate-500">{step.detail}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function TrackingCodes({ codes }: { codes: readonly string[] }) {
  if (!codes.length) return null;
  return (
    <p>
      Tracking number{codes.length > 1 ? "s" : ""}:{" "}
      {codes.map((code, index) => (
        <span key={code}>
          {index > 0 && ", "}
          <span className="font-mono font-medium text-slate-800">{code}</span>
        </span>
      ))}
    </p>
  );
}

export function placedOn(iso: string | null | undefined): string {
  return iso ? `Placed on ${formatDate(iso)}` : "";
}
