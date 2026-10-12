import type { ComponentType } from "react";
import type { StoreSlug } from "@/lib/shop/api";
import type { ShopShellProps } from "../shop-shell";

/**
 * A client's own storefront design. Every slot is optional: whatever a theme leaves out uses the
 * shared design, which is already branded with the store's logo, banner and accent colour.
 *
 * Smaller changes need no theme: the shop sits inside `.shop-store-<slug>` (and `.client-<slug>`
 * on client sites), so a client's CSS in `src/styles/clients/<slug>/` can restyle it.
 */
export interface ShopTheme {
  /** Replaces the shared header, menu and footer. A client component. */
  readonly Shell?: ComponentType<ShopShellProps>;
  /** Replaces the shop's home page (`/shop`). */
  readonly Home?: ComponentType<{ seller: StoreSlug }>;
}

/**
 * Custom storefronts by seller slug (the house shop is `vitamin-2001`). Add a folder next to this
 * file for the client, e.g. `./runachan/`, and register its theme here.
 */
const THEMES: Readonly<Record<string, ShopTheme>> = {};

const SHARED: ShopTheme = {};

export function shopTheme(storeSlug: string): ShopTheme {
  return THEMES[storeSlug] ?? SHARED;
}
