import { notFound, unstable_rethrow } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { titleCaseSlug } from "@/config/clients";
import type { StoreSlug } from "@/lib/shop/api";
import { getShopAvailability, listCollections, type ShopAvailability } from "@/lib/shop/catalog";
import { shopBasePath } from "@/lib/shop/server";
import { ShopStoreProvider } from "@/lib/shop/store-context";
import { ShopShell } from "./shop-shell";
import { shopTheme } from "./themes";
import { StoreClosed } from "./shop-states";
import { ShopUnavailable } from "./shop-unavailable";

/**
 * Wraps every shop page: checks the store has an open shop, then provides the store to the pages
 * and draws the shop's header and footer.
 */
export async function ShopLayout({ seller, children }: { seller: StoreSlug; children: ReactNode }) {
  const basePath = await shopBasePath(seller);
  let availability: ShopAvailability;
  try {
    availability = await getShopAvailability(seller);
  } catch (error) {
    unstable_rethrow(error);
    return <ShopUnavailable />;
  }
  if (availability.status === "none") notFound();
  if (availability.status === "closed") return <StoreClosed name={titleCaseSlug(seller ?? "")} />;

  const profile = availability.seller;
  const collections = await listCollections(seller).catch(() => []);
  const siteRoot = basePath.replace(/\/shop$/, "") || "/";
  // vitamin2001.in has no shopper sign-in of its own; the house shop's client pages provide it.
  const userRoot = seller ? `${siteRoot === "/" ? "" : siteRoot}/user` : `/client/${profile.slug}/user`;

  const Shell = shopTheme(profile.slug).Shell ?? ShopShell;
  const accent = profile.accentColor && /^#[0-9a-f]{6}$/i.test(profile.accentColor) ? profile.accentColor : null;

  return (
    <ShopStoreProvider value={{ seller, profile, basePath, siteRoot, userRoot }}>
      <div
        className={`shop-theme shop-store-${profile.slug}`}
        style={accent ? ({ "--shop-accent": accent } as CSSProperties) : undefined}
      >
        <Shell collections={collections.map(({ slug, name }) => ({ slug, name }))}>{children}</Shell>
      </div>
    </ShopStoreProvider>
  );
}
