import type { Metadata } from "next";
import { connection } from "next/server";
import { ThemedShopHome } from "@/components/shop/pages/home-page";
import { getShopAvailability } from "@/lib/shop/catalog";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const availability = await getShopAvailability(null).catch(() => null);
  const name = availability?.status === "open" ? availability.seller.name : "Vitamin 2001";
  return { title: `Shop | ${name}` };
}

export default function HouseShopHomePage() {
  return <ThemedShopHome seller={null} />;
}
