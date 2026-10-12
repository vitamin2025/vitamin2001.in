"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StoreSlug } from "./api";
import type { Seller } from "./types";

export interface ShopStoreValue {
  /** Seller slug for API calls, or null for the house shop on vitamin2001.in. */
  readonly seller: StoreSlug;
  /** The open seller's public profile. */
  readonly profile: Seller;
  /**
   * Where the shop lives in this site's URLs, without a trailing slash: `/shop` on a client's
   * subdomain or vitamin2001.in, `/client/<slug>/shop` when the app is reached without one.
   */
  readonly basePath: string;
}

const ShopStoreContext = createContext<ShopStoreValue | null>(null);

export function ShopStoreProvider({
  value,
  children,
}: {
  value: ShopStoreValue;
  children: ReactNode;
}) {
  return <ShopStoreContext.Provider value={value}>{children}</ShopStoreContext.Provider>;
}

export function useShopStore(): ShopStoreValue {
  const value = useContext(ShopStoreContext);
  if (!value) throw new Error("useShopStore must run inside ShopStoreProvider");
  return value;
}

/** Builds a link inside the shop, e.g. `shopHref(base, "/products/d3")`. */
export function shopHref(basePath: string, path = ""): string {
  return `${basePath}${path}`;
}
