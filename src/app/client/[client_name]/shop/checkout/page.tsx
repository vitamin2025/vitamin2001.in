import type { Metadata } from "next";
import { CheckoutPage } from "@/components/shop/pages/checkout-page";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function ShopCheckoutPage() {
  return <CheckoutPage />;
}
