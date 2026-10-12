"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Info, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { shopErrorMessage } from "@/lib/shop/api";
import { formatMoney } from "@/lib/shop/format";
import {
  orderPageUrl,
  useApplyCoupon,
  useCart,
  useRemoveCartLine,
  useRemoveCoupon,
  useUpdateCartLine,
} from "@/lib/shop/hooks";
import { useShopStore } from "@/lib/shop/store-context";
import { useHydrated } from "@/lib/shop/use-hydrated";
import type { Cart, CartLine } from "@/lib/shop/types";
import { AccentButton, accentLinkClass } from "../accent-button";
import { OrderSummary } from "../order-summary";
import { ProductImage } from "../product-card";
import { QuantityStepper } from "../quantity-stepper";
import { EmptyState } from "../shop-states";

function LineItem({ line, currency }: { line: CartLine; currency: string }) {
  const { basePath } = useShopStore();
  const update = useUpdateCartLine();
  const remove = useRemoveCartLine();
  const busy = update.isPending || remove.isPending;
  const error = update.error ?? remove.error;

  return (
    <li className="flex gap-4 py-6">
      <Link href={`${basePath}/products/${line.productSlug}`} className="shrink-0">
        <ProductImage src={line.image} alt={line.productName} className="h-24 w-24 rounded-2xl ring-1 ring-slate-200 sm:h-28 sm:w-28" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <Link href={`${basePath}/products/${line.productSlug}`} className="font-medium text-slate-900 hover:underline">
              {line.productName}
            </Link>
            {line.variantName !== line.productName && <p className="text-sm text-slate-500">{line.variantName}</p>}
            <p className="mt-1 text-sm text-slate-500">{formatMoney(line.unitPriceMinor, currency)} each</p>
          </div>
          <p className="font-semibold tabular-nums text-slate-900">{formatMoney(line.linePriceMinor, currency)}</p>
        </div>
        <div className="mt-auto flex items-center gap-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            disabled={busy}
            onChange={(quantity) => update.mutate({ lineId: line.id, quantity })}
          />
          <button
            type="button"
            onClick={() => remove.mutate(line.id)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-rose-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
        {error && <p className="text-sm text-rose-600">{shopErrorMessage(error)}</p>}
      </div>
    </li>
  );
}

function CouponForm({ cart }: { cart: Cart }) {
  const apply = useApplyCoupon();
  const remove = useRemoveCoupon();
  const [code, setCode] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = code.trim();
    if (!value) return;
    apply.mutate(value, { onSuccess: () => setCode("") });
  };

  return (
    <div className="space-y-3">
      <form onSubmit={submit} className="flex gap-2">
        <label htmlFor="coupon" className="sr-only">
          Coupon code
        </label>
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="coupon"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Coupon code"
            maxLength={50}
            className="h-10 w-full rounded-full border border-slate-300 pl-9 pr-3 text-sm uppercase outline-none placeholder:normal-case focus:ring-2 focus:ring-(--shop-accent-ring)"
          />
        </div>
        <Button type="submit" variant="outline" className="h-10 rounded-full" disabled={apply.isPending || !code.trim()}>
          Apply
        </Button>
      </form>
      {apply.isError && <p className="text-sm text-rose-600">{shopErrorMessage(apply.error)}</p>}
      {cart.couponCodes.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {cart.couponCodes.map((coupon) => (
            <li key={coupon} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
              {coupon}
              <button
                type="button"
                onClick={() => remove.mutate(coupon)}
                aria-label={`Remove coupon ${coupon}`}
                className="rounded-full p-0.5 hover:bg-emerald-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CartPage() {
  const { basePath } = useShopStore();
  const router = useRouter();
  const { data: cart, isPending, isError, error, refetch } = useCart();
  const hydrated = useHydrated();

  if (!hydrated || isPending) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-6">
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex gap-4">
              <Skeleton className="h-28 w-28 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="We couldn't load your cart"
        action={<Button onClick={() => refetch()}>Try again</Button>}
      >
        {shopErrorMessage(error)}
      </EmptyState>
    );
  }

  if (!cart.lines.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-7 w-7" />}
        title="Your cart is empty"
        action={
          <Link href={`${basePath}/products`} className={accentLinkClass()}>
            Start shopping <ArrowRight />
          </Link>
        }
      >
        Products you add will show up here.
      </EmptyState>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
      {cart.state === "ArrangingPayment" && cart.code && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            You started paying for this cart. If you completed the payment,{" "}
            <a href={orderPageUrl(basePath, cart.code)} className="font-semibold underline">
              see your order
            </a>
            . Otherwise you can change the cart and pay again.
          </span>
        </p>
      )}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {cart.lines.map((line) => (
              <LineItem key={line.id} line={line} currency={cart.currency} />
            ))}
          </ul>
          <Link href={`${basePath}/products`} className="mt-6 inline-block text-sm font-medium text-(--shop-accent) hover:underline">
            Continue shopping
          </Link>
        </div>
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            cart={cart}
            footer={
              <div className="space-y-5">
                <CouponForm cart={cart} />
                <AccentButton size="lg" className="w-full" onClick={() => router.push(`${basePath}/checkout`)}>
                  Checkout <ArrowRight />
                </AccentButton>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
