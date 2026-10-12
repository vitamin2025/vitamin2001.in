import type { Metadata } from "next";
import { CartPage } from "@/components/shop/pages/cart-page";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function ShopCartPage() {
  return <CartPage />;
}
