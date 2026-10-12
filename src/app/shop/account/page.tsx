import type { Metadata } from "next";
import { AccountPage } from "@/components/shop/pages/account-page";
import { firstParam, type SearchParams } from "@/lib/shop/server";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function ShopAccountPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const tab = firstParam((await searchParams).tab) === "addresses" ? "addresses" : "orders";
  return <AccountPage tab={tab} />;
}
