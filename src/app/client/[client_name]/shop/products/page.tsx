import type { Metadata } from "next";
import { CatalogPage, catalogTitle } from "@/components/shop/pages/catalog-page";
import { clientSeller, type SearchParams } from "@/lib/shop/server";

interface Props {
  params: Promise<{ client_name: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return { title: { absolute: await catalogTitle(await clientSeller(params), await searchParams) } };
}

export default async function ClientShopProductsPage({ params, searchParams }: Props) {
  return <CatalogPage seller={await clientSeller(params)} params={await searchParams} />;
}
