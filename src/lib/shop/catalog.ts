import { cache } from "react";
import { isShopApiError, shopFetch, storePrefix, type StoreSlug } from "./api";
import type {
  CollectionDetail,
  CollectionNode,
  ProductDetail,
  ProductList,
  ProductQuery,
  Seller,
} from "./types";

/**
 * Catalog reads for server components. Answers are public and the same for every shopper, so Next
 * caches them for a minute, as the API does.
 */
const REVALIDATE_SECONDS = 60;

export type ShopAvailability =
  | { readonly status: "open"; readonly seller: Seller }
  /** The seller was open and has been removed. */
  | { readonly status: "closed" }
  /** No shop here, or the shop API is switched off. */
  | { readonly status: "none" };

/** Whether a store has an open shop, and its seller. Throws when the API can't answer. */
export const getShopAvailability = cache(
  async (seller: StoreSlug): Promise<ShopAvailability> => {
    try {
      if (seller) {
        const found = await shopFetch<Seller>(`/sellers/${encodeURIComponent(seller)}`, {
          revalidate: REVALIDATE_SECONDS,
        });
        return { status: "open", seller: found };
      }
      const { items } = await shopFetch<{ items: Seller[] }>("/sellers", {
        revalidate: REVALIDATE_SECONDS,
      });
      const house = items.find((item) => item.isHouseShop);
      return house ? { status: "open", seller: house } : { status: "none" };
    } catch (error) {
      if (isShopApiError(error) && error.code === "STORE_CLOSED") return { status: "closed" };
      if (isShopApiError(error) && error.isNotFound) return { status: "none" };
      throw error;
    }
  },
);

export const listProducts = cache(
  (seller: StoreSlug, query: ProductQuery = {}): Promise<ProductList> =>
    shopFetch<ProductList>(`${storePrefix(seller)}/products`, {
      query: { ...query },
      revalidate: REVALIDATE_SECONDS,
    }),
);

export const getProduct = cache(
  (seller: StoreSlug, slug: string): Promise<ProductDetail> =>
    shopFetch<ProductDetail>(`${storePrefix(seller)}/products/${encodeURIComponent(slug)}`, {
      revalidate: REVALIDATE_SECONDS,
    }),
);

export const listCollections = cache(
  async (seller: StoreSlug): Promise<readonly CollectionNode[]> =>
    (
      await shopFetch<{ items: CollectionNode[] }>(`${storePrefix(seller)}/collections`, {
        revalidate: REVALIDATE_SECONDS,
      })
    ).items,
);

export const getCollection = cache(
  (seller: StoreSlug, slug: string): Promise<CollectionDetail> =>
    shopFetch<CollectionDetail>(
      `${storePrefix(seller)}/collections/${encodeURIComponent(slug)}`,
      { revalidate: REVALIDATE_SECONDS },
    ),
);
