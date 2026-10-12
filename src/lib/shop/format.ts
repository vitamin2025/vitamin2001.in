import type { Address, PriceRange } from "./types";

const formatters = new Map<string, Intl.NumberFormat>();

/** Paise to a price, e.g. 59000 → "₹590". Whole rupees drop the decimals. */
export function formatMoney(minor: number, currency = "INR"): string {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    formatters.set(currency, formatter);
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
