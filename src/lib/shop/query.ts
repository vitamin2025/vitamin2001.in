import { PRODUCT_SORTS, type FacetGroup, type ProductQuery, type ProductSort } from "./types";

type RawParams = Readonly<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export const PRODUCTS_PER_PAGE = 24;

/**
 * Reads a catalog page's query string into an API query, dropping anything the API would refuse
 * (it rejects unknown or invalid parameters).
 */
export function parseProductQuery(params: RawParams): ProductQuery {
  const q = first(params.q)?.trim().slice(0, 100) || undefined;
  const collection = first(params.collection)?.trim();
  const facets = first(params.facets)?.trim();
  const sort = first(params.sort) as ProductSort | undefined;
  const page = Number.parseInt(first(params.page) ?? "1", 10);
  return {
    q,
    collection: collection && /^[a-z0-9-]{1,200}$/i.test(collection) ? collection : undefined,
    facets: facets && /^\d+([|,]\d+)*$/.test(facets) ? facets : undefined,
    inStock: first(params.inStock) === "true" ? true : undefined,
    sort: sort && PRODUCT_SORTS.includes(sort) ? sort : undefined,
    page: Number.isFinite(page) && page >= 1 && page <= 500 ? page : 1,
    perPage: PRODUCTS_PER_PAGE,
  };
}

/** The page's own query string for a query (without `perPage`, which is fixed). */
export function productQueryString(query: ProductQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.collection) params.set("collection", query.collection);
  if (query.facets) params.set("facets", query.facets);
  if (query.inStock) params.set("inStock", "true");
  if (query.sort) params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  const text = params.toString();
  return text ? `?${text}` : "";
}

/** Selected facet value ids from the API format (comma is AND, pipe is OR). */
export function selectedFacetIds(facets: string | undefined): Set<string> {
  return new Set((facets ?? "").split(/[|,]/).filter(Boolean));
}

/**
 * Values within one facet widen the results (OR); different facets narrow them (AND). Values the
 * current answer doesn't list are kept in their own group.
 */
export function facetsParam(selected: ReadonlySet<string>, groups: readonly FacetGroup[]): string | undefined {
  const byGroup = new Map<string, string[]>();
  const known = new Set<string>();
  for (const group of groups) {
    for (const value of group.values) {
      known.add(value.id);
      if (selected.has(value.id)) byGroup.set(group.code, [...(byGroup.get(group.code) ?? []), value.id]);
    }
  }
  const parts = [...byGroup.values()].map((ids) => ids.join("|"));
  for (const id of selected) if (!known.has(id)) parts.push(id);
  return parts.length ? parts.join(",") : undefined;
}

export const SORT_LABELS: Record<ProductSort, string> = {
  relevance: "Best match",
  name_asc: "Name: A to Z",
  name_desc: "Name: Z to A",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
};
