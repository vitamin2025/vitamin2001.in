import type { Address, PriceRange } from "./types";

const formatters = new Map<string, Intl.NumberFormat>();

/** Paise to a price: 59000 → "₹590", 26910 → "₹269.10". Whole rupees drop the decimals. */
export function formatMoney(minor: number, currency = "INR"): string {
  const digits = minor % 100 === 0 ? 0 : 2;
  const key = `${currency}:${digits}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    formatters.set(key, formatter);
  }
  return formatter.format(minor / 100);
}

/** "₹590" or "₹590 – ₹990" for products whose variants differ in price. */
export function formatPriceRange(price: PriceRange | null): string {
  if (!price) return "";
  if (price.minMinor === price.maxMinor) return formatMoney(price.minMinor, price.currency);
  return `${formatMoney(price.minMinor, price.currency)} – ${formatMoney(price.maxMinor, price.currency)}`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function addressLines(address: Address): string[] {
  return [
    address.fullName,
    address.company,
    address.streetLine1,
    address.streetLine2,
    [address.city, address.province, address.postalCode].filter(Boolean).join(", "),
    address.phoneNumber,
  ].filter((line): line is string => Boolean(line));
}

const ORDER_STATES: Record<string, string> = {
  ArrangingPayment: "Awaiting payment",
  PaymentAuthorized: "Payment received",
  PaymentSettled: "Confirmed",
  PartiallyShipped: "Partly shipped",
  Shipped: "Shipped",
  PartiallyDelivered: "Partly delivered",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
  Modifying: "Being updated",
  ArrangingAdditionalPayment: "Awaiting payment",
};

/** A shopper-facing name for a shop order state, e.g. `PaymentSettled` → "Confirmed". */
export function orderStateLabel(state: string): string {
  return ORDER_STATES[state] ?? state.replace(/([a-z])([A-Z])/g, "$1 $2");
}

/** How to colour an order state. */
export function orderStateTone(state: string): "positive" | "neutral" | "negative" {
  if (state === "Cancelled") return "negative";
  if (state === "Delivered" || state === "Shipped" || state === "PartiallyShipped" || state === "PartiallyDelivered") {
    return "positive";
  }
  return "neutral";
}
