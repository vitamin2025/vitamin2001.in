import type { Metadata } from "next";
import { CatalogPage, catalogTitle } from "@/components/shop/pages/catalog-page";
import type { SearchParams } from "@/lib/shop/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return { title: { absolute: await catalogTitle(null, await searchParams) } };
}

export default async function HouseShopProductsPage({ searchParams }: Props) {
  return <CatalogPage seller={null} params={await searchParams} />;
}
