import type { ReactNode } from "react";
import { ShopLayout } from "@/components/shop/shop-layout";
import { clientSeller } from "@/lib/shop/server";

/** A client's shop: the approved seller with the client's slug, e.g. runachan.vitamin2001.in/shop. */
export default async function ClientShopLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ client_name: string }>;
}) {
  return <ShopLayout seller={await clientSeller(params)}>{children}</ShopLayout>;
}
