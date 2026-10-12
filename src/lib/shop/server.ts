import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CLIENT_SUBDOMAIN_HEADER } from "@/lib/client-subdomain";
import type { StoreSlug } from "./api";

/**
 * Where the shop lives in this request's URLs. On a client's subdomain the proxy hides
 * `/client/<slug>`, so links are `/shop/...`; reached without the subdomain they keep the prefix.
 */
export async function shopBasePath(seller: StoreSlug): Promise<string> {
  // Read the request even for the house shop, so shop pages render per request (with the catalog
  // in Next's data cache) and the build never calls the API.
  const subdomain = (await headers()).get(CLIENT_SUBDOMAIN_HEADER);
  if (!seller) return "/shop";
  return subdomain === seller ? "/shop" : `/client/${seller}/shop`;
}

/** Same rule as the shop's seller slug. */
const SELLER_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/** The seller for a `/client/[client_name]/shop` route: the client's slug. 404 when it can't be one. */
export async function clientSeller(params: Promise<{ client_name: string }>): Promise<string> {
  const slug = (await params).client_name.toLowerCase();
  if (!SELLER_SLUG.test(slug)) notFound();
  return slug;
}

export type SearchParams = Record<string, string | string[] | undefined>;

export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
