import type { ReactNode } from "react";
import { formatMoney } from "@/lib/shop/format";
import type { Cart } from "@/lib/shop/types";
import { ProductImage } from "./product-card";

function Row({ label, value, strong }: { label: ReactNode; value: ReactNode; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between text-base font-semibold text-slate-900" : "flex justify-between text-sm text-slate-600"}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

/** Totals for a cart. `showLines` lists the items too (checkout). */
export function OrderSummary({
  cart,
  showLines = false,
  footer,
}: {
  cart: Omit<Cart, "checkout">;
  showLines?: boolean;
  footer?: ReactNode;
}) {
  const money = (minor: number) => formatMoney(minor, cart.currency);
  const shippingChosen = cart.shipping.length > 0;
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6" aria-label="Order summary">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Order summary</h2>
      {showLines && (
        <ul className="mb-5 space-y-4 border-b border-slate-200 pb-5">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex gap-3">
              <div className="relative">
                <ProductImage src={line.image} alt={line.productName} className="h-14 w-14 rounded-xl ring-1 ring-slate-200" />
                <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-700 px-1 text-[11px] font-semibold text-white">
                  {line.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium text-slate-900">{line.productName}</p>
                {line.variantName !== line.productName && <p className="truncate text-slate-500">{line.variantName}</p>}
              </div>
              <p className="text-sm font-medium tabular-nums text-slate-900">{money(line.linePriceMinor)}</p>
            </li>
          ))}
        </ul>
      )}
      <dl className="space-y-2.5">
        <Row label={`Items (${cart.itemCount})`} value={money(cart.subTotalMinor)} />
        {cart.discounts.map((discount) => (
          <Row
            key={discount.description}
            label={discount.description}
            value={<span className="text-emerald-700">{money(discount.amountMinor)}</span>}
          />
        ))}
        <Row
          label={shippingChosen ? `Shipping (${cart.shipping.map((s) => s.name).join(", ")})` : "Shipping"}
          value={shippingChosen ? (cart.shippingMinor ? money(cart.shippingMinor) : "Free") : "At checkout"}
        />
        <div className="border-t border-slate-200 pt-3">
          <Row label="Total" value={money(cart.totalMinor)} strong />
          <p className="mt-1 text-right text-xs text-slate-500">Includes {money(cart.taxMinor)} GST</p>
        </div>
      </dl>
      {footer && <div className="mt-6">{footer}</div>}
    </section>
  );
}
