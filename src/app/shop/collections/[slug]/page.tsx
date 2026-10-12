import type { Metadata } from "next";
import { CollectionPage, collectionMetadata } from "@/components/shop/pages/collection-page";
import type { SearchParams } from "@/lib/shop/server";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return collectionMetadata(null, (await params).slug);
}

export default async function HouseShopCollectionPage({ params, searchParams }: Props) {
  return <CollectionPage seller={null} slug={(await params).slug} params={await searchParams} />;
}
