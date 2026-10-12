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
  /** The rest of the client's site (its home page), e.g. `/` or `/client/<slug>`. */
  readonly siteRoot: string;
  /** Where the client's sign-in pages live: `<userRoot>/login`, `<userRoot>/account`. */
  readonly userRoot: string;
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

/** The sign-in page, coming back to `returnTo` (a path on this site) afterwards. */
export function loginHref(userRoot: string, returnTo: string): string {
  return `${userRoot}/login?redirect=${encodeURIComponent(returnTo)}`;
}
