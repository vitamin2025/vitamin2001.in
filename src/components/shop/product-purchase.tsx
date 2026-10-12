"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { shopErrorMessage, isShopApiError } from "@/lib/shop/api";
import { formatMoney, formatPriceRange } from "@/lib/shop/format";
import { orderPageUrl, useAddToCart, useCart } from "@/lib/shop/hooks";
import { useShopStore } from "@/lib/shop/store-context";
import type { ProductDetail, ProductVariant } from "@/lib/shop/types";
import { cn } from "@/lib/utils";
import { AccentButton } from "./accent-button";
import { ProductGallery } from "./product-gallery";
import { QuantityStepper } from "./quantity-stepper";

type Selection = Record<string, string>;

function optionOf(variant: ProductVariant, group: string): string | undefined {
  return variant.options.find((option) => option.group === group)?.code;
}

function matches(variant: ProductVariant, selection: Selection): boolean {
  return Object.entries(selection).every(([group, code]) => optionOf(variant, group) === code);
}

function initialSelection(product: ProductDetail): Selection {
  const start = product.variants.find((variant) => variant.inStock) ?? product.variants[0];
  const selection: Selection = {};
  if (!start) return selection;
  for (const group of product.optionGroups) {
    const code = optionOf(start, group.code);
    if (code) selection[group.code] = code;
  }
  return selection;
}

function StockNote({ variant }: { variant: ProductVariant | undefined }) {
  if (!variant) return <p className="text-sm text-slate-500">This combination isn&apos;t available.</p>;
  if (!variant.inStock) return <p className="text-sm font-medium text-rose-600">Out of stock</p>;
  if (variant.stockLevel === "LOW_STOCK") {
    return <p className="text-sm font-medium text-amber-600">Only a few left</p>;
  }
  return <p className="text-sm font-medium text-emerald-600">In stock</p>;
}

/** Gallery, options, quantity and add to cart for a product page. `details` sits under the button. */
export function ProductPurchase({ product, details }: { product: ProductDetail; details?: ReactNode }) {
  const { basePath } = useShopStore();
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [variantId, setVariantId] = useState<string | undefined>(
    () => (product.variants.find((variant) => variant.inStock) ?? product.variants[0])?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState<string | null>(null);

  const usesOptions = product.optionGroups.length > 0;
  const variant = usesOptions
    ? product.variants.find((candidate) => matches(candidate, selection))
    : product.variants.find((candidate) => candidate.id === variantId);

  const images = useMemo(() => {
    const all = [product.image, ...product.images, ...product.variants.map((v) => v.image)];
    return [...new Set(all.filter((src): src is string => Boolean(src)))];
  }, [product]);

  const choose = (group: string, code: string) => {
    setAdded(null);
    addToCart.reset();
    const next = { ...selection, [group]: code };
    // Keep the other choices if they still exist with this one; otherwise take the first that does.
    if (!product.variants.some((candidate) => matches(candidate, next))) {
      const fallback =
        product.variants.find((c) => optionOf(c, group) === code && c.inStock) ??
        product.variants.find((c) => optionOf(c, group) === code);
      if (fallback) {
        for (const g of product.optionGroups) {
          const value = optionOf(fallback, g.code);
          if (value) next[g.code] = value;
        }
      }
    }
    setSelection(next);
  };

  /** Whether picking this option (with the other current choices) gives a variant, and in stock. */
  const optionState = (group: string, code: string): "ok" | "soldout" | "none" => {
    const candidates = product.variants.filter((c) => matches(c, { ...selection, [group]: code }));
    if (!candidates.length) return "none";
    return candidates.some((c) => c.inStock) ? "ok" : "soldout";
  };

  const add = () => {
    if (!variant) return;
    setAdded(null);
    addToCart.mutate(
      { variantId: variant.id, quantity },
      { onSuccess: () => setAdded(variant.name) },
    );
  };

  const paymentPending =
    isShopApiError(addToCart.error) && addToCart.error.code === "PAYMENT_IN_PROGRESS" && cart?.code;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={images} name={product.name} focus={variant?.image} />

      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-slate-900">
            {variant ? formatMoney(variant.priceMinor, variant.currency) : formatPriceRange(product.price)}
          </p>
          <p className="text-xs text-slate-500">Inclusive of all taxes</p>
        </div>

        {usesOptions
          ? product.optionGroups.map((group) => (
              <fieldset key={group.code} className="space-y-2.5">
                <legend className="text-sm font-medium text-slate-800">
                  {group.name}
                  {selection[group.code] && (
                    <span className="ml-2 font-normal text-slate-500">
                      {group.options.find((o) => o.code === selection[group.code])?.name}
                    </span>
                  )}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const state = optionState(group.code, option.code);
                    const active = selection[group.code] === option.code;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => choose(group.code, option.code)}
                        aria-pressed={active}
                        disabled={state === "none" && !active}
                        className={cn(
                          "min-w-12 rounded-full border px-4 py-2 text-sm font-medium transition",
                          active
                            ? "border-(--shop-accent) bg-(--shop-accent-soft) text-(--shop-accent-strong) ring-1 ring-(--shop-accent)"
                            : "border-slate-300 text-slate-700 hover:border-slate-400",
                          state === "soldout" && !active && "text-slate-400 line-through",
                          state === "none" && "cursor-not-allowed opacity-40",
                        )}
                      >
                        {option.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))
          : product.variants.length > 1 && (
              <fieldset className="space-y-2.5">
                <legend className="text-sm font-medium text-slate-800">Choose</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => {
                        setVariantId(candidate.id);
                        setAdded(null);
                      }}
                      aria-pressed={candidate.id === variant?.id}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        candidate.id === variant?.id
                          ? "border-(--shop-accent) bg-(--shop-accent-soft) text-(--shop-accent-strong) ring-1 ring-(--shop-accent)"
                          : "border-slate-300 text-slate-700 hover:border-slate-400",
                        !candidate.inStock && "text-slate-400 line-through",
                      )}
                    >
                      {candidate.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

        <StockNote variant={variant} />

        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} disabled={!variant?.inStock} />
          <AccentButton
            size="lg"
            className="flex-1"
            onClick={add}
            disabled={!variant?.inStock || addToCart.isPending}
          >
            {addToCart.isPending ? "Adding…" : variant?.inStock === false ? "Out of stock" : "Add to cart"}
          </AccentButton>
        </div>

        {added && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="flex-1">Added {added} to your cart.</span>
            <Link href={`${basePath}/cart`} className="font-semibold underline-offset-2 hover:underline">
              View cart
            </Link>
            <Link href={`${basePath}/checkout`} className="font-semibold underline-offset-2 hover:underline">
              Checkout
            </Link>
          </div>
        )}
        {addToCart.isError && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
            {shopErrorMessage(addToCart.error)}{" "}
            {paymentPending && (
              <a href={orderPageUrl(basePath, cart?.code ?? undefined)} className="font-semibold underline">
                See your order
              </a>
            )}
          </p>
        )}

        <ul className="grid gap-2 border-y border-slate-200 py-4 text-sm text-slate-600">
          <li className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-(--shop-accent)" /> Secure payment with PayU: UPI, cards and netbanking
          </li>
          <li className="flex items-center gap-2.5">
            <Truck className="h-4 w-4 text-(--shop-accent)" /> Shipping is worked out at checkout
          </li>
        </ul>

        {details}
      </div>
    </div>
  );
}
