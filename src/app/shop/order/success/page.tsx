import type { Metadata } from "next";
import { OrderPage } from "@/components/shop/pages/order-page";
import { firstParam, type SearchParams } from "@/lib/shop/server";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

/** Where PayU sends the shopper back, and what order emails link to: `?order=<code>`. */
export default async function ShopOrderPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const code = firstParam((await searchParams).order)?.trim();
  return <OrderPage code={code && /^[A-Za-z0-9]{1,40}$/.test(code) ? code : null} />;
}
