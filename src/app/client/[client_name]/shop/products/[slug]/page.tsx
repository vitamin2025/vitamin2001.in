import type { Metadata } from "next";
import { ProductPage, productMetadata } from "@/components/shop/pages/product-page";
import { clientSeller } from "@/lib/shop/server";

interface Props {
  params: Promise<{ client_name: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return productMetadata(await clientSeller(params), (await params).slug);
}

export default async function ClientShopProductPage({ params }: Props) {
  return <ProductPage seller={await clientSeller(params)} slug={(await params).slug} />;
}
