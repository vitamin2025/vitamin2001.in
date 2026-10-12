"use client";

import { useQuery } from "@tanstack/react-query";
import { isShopApiError, shopFetch } from "./api";
import type { Seller } from "./types";

/**
 * The shop of the client with this slug: the approved seller with the same slug, or null when
 * the client has none (or it closed). For links to the shop from the client's own pages.
 */
export function useClientShop(slug: string) {
  return useQuery({
    queryKey: ["shop", "presence", slug.toLowerCase()],
    queryFn: async () => {
      try {
        return await shopFetch<Seller>(`/sellers/${encodeURIComponent(slug.toLowerCase())}`);
      } catch (error) {
        if (isShopApiError(error) && error.isNotFound) return null;
        throw error;
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
}
