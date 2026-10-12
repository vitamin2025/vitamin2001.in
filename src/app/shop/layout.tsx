import type { ReactNode } from "react";
import { ShopLayout } from "@/components/shop/shop-layout";

/** vitamin2001.in/shop: the Vitamin 2001 house shop (the API's plain routes). */
export default function HouseShopLayout({ children }: { children: ReactNode }) {
  return <ShopLayout seller={null}>{children}</ShopLayout>;
}
