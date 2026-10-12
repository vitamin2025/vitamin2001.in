import Link from "next/link";
import { notFound } from "next/navigation";
import { isShopApiError, type StoreSlug } from "@/lib/shop/api";
import { getCollection, getShopAvailability } from "@/lib/shop/catalog";
import { parseProductQuery } from "@/lib/shop/query";
import { descriptionText, sanitizeDescription } from "@/lib/shop/sanitize";
import { shopBasePath } from "@/lib/shop/server";
import type { CollectionDetail } from "@/lib/shop/types";
import { CatalogView } from "../catalog-view";

type RawParams = Record<string, string | string[] | undefined>;

async function loadCollection(seller: StoreSlug, slug: string): Promise<CollectionDetail> {
  try {
    return await getCollection(seller, slug);
  } catch (error) {
    if (isShopApiError(error) && error.isNotFound) notFound();
    throw error;
  }
}

export async function collectionMetadata(seller: StoreSlug, slug: string) {
  const [collection, availability] = await Promise.all([
    loadCollection(seller, slug),
    getShopAvailability(seller),
  ]);
  const name = availability.status === "open" ? availability.seller.name : "Shop";
  return {
    title: { absolute: `${collection.name} | ${name}` },
    description: descriptionText(collection.description) || undefined,
  };
}

/** One category: its description, sub-categories and products. */
export async function CollectionPage({
  seller,
  slug,
  params,
}: {
  seller: StoreSlug;
  slug: string;
  params: RawParams;
}) {
  const basePath = await shopBasePath(seller);
  const collection = await loadCollection(seller, slug);
  const query = { ...parseProductQuery(params), collection: collection.slug };
  const description = sanitizeDescription(collection.description);

  return (
    <CatalogView
      seller={seller}
      pagePath={`${basePath}/collections/${collection.slug}`}
      query={query}
      title={collection.name}
      showCollections={false}
      crumbs={[
        { href: basePath, label: "Shop" },
        ...collection.breadcrumbs
          .filter((crumb) => crumb.slug !== collection.slug)
          .map((crumb) => ({ href: `${basePath}/collections/${crumb.slug}`, label: crumb.name })),
        { href: `${basePath}/collections/${collection.slug}`, label: collection.name },
      ]}
      intro={
        <>
          {description && (
            <div className="shop-prose mt-3 max-w-3xl text-sm" dangerouslySetInnerHTML={{ __html: description }} />
          )}
          {collection.children.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {collection.children.map((child) => (
                <Link
                  key={child.slug}
                  href={`${basePath}/collections/${child.slug}`}
                  className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-(--shop-accent) hover:text-(--shop-accent-strong)"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </>
      }
    />
  );
}
