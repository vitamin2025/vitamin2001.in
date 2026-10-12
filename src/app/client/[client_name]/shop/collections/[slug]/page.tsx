import type { Metadata } from "next";
import { CollectionPage, collectionMetadata } from "@/components/shop/pages/collection-page";
import { clientSeller, type SearchParams } from "@/lib/shop/server";

interface Props {
  params: Promise<{ client_name: string; slug: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return collectionMetadata(await clientSeller(params), (await params).slug);
}

export default async function ClientShopCollectionPage({ params, searchParams }: Props) {
  return (
    <CollectionPage seller={await clientSeller(params)} slug={(await params).slug} params={await searchParams} />
  );
}
