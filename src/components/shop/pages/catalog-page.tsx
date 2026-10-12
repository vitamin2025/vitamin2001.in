import type { StoreSlug } from "@/lib/shop/api";
import { getShopAvailability } from "@/lib/shop/catalog";
import { parseProductQuery } from "@/lib/shop/query";
import { shopBasePath } from "@/lib/shop/server";
import { CatalogView } from "../catalog-view";

type RawParams = Record<string, string | string[] | undefined>;

export async function catalogTitle(seller: StoreSlug, params: RawParams): Promise<string> {
  const availability = await getShopAvailability(seller);
  const name = availability.status === "open" ? availability.seller.name : "Shop";
  const { q } = parseProductQuery(params);
  return q ? `Search: ${q} | ${name}` : `All products | ${name}`;
}

/** All products, or search results with `?q=`. */
export async function CatalogPage({ seller, params }: { seller: StoreSlug; params: RawParams }) {
  const basePath = await shopBasePath(seller);
  const query = parseProductQuery(params);
  return (
    <CatalogView
      seller={seller}
      pagePath={`${basePath}/products`}
      query={query}
      title={query.q ? `Results for “${query.q}”` : "All products"}
      crumbs={[
        { href: basePath, label: "Shop" },
        { href: `${basePath}/products`, label: query.q ? "Search" : "All products" },
      ]}
    />
  );
}
