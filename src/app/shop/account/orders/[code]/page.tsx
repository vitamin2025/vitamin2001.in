import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountOrderPage } from "@/components/shop/pages/account-order-page";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

export default async function ShopAccountOrderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[A-Za-z0-9]{1,40}$/.test(code)) notFound();
  return <AccountOrderPage code={code} />;
}
