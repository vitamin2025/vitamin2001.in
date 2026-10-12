import type { Metadata } from "next";
import { ProductPage, productMetadata } from "@/components/shop/pages/product-page";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return productMetadata(null, (await params).slug);
}

export default async function HouseShopProductPage({ params }: Props) {
  return <ProductPage seller={null} slug={(await params).slug} />;
}
