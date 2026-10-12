"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { facetsParam, productQueryString, selectedFacetIds, SORT_LABELS } from "@/lib/shop/query";
import { useShopStore } from "@/lib/shop/store-context";
import { PRODUCT_SORTS, type ProductList, type ProductQuery, type ProductSort } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

interface FiltersProps {
  /** The page the filters apply to, e.g. `/shop/products` or `/shop/collections/vitamins`. */
  readonly pagePath: string;
  readonly query: ProductQuery;
  readonly facets: ProductList["facets"];
  /** Collections in the results, offered as links. Hidden on a collection's own page. */
  readonly collections?: ProductList["collections"];
}

function useApply(pagePath: string, query: ProductQuery) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const apply = (change: Partial<ProductQuery>) => {
    const next = { ...query, ...change, page: 1, perPage: undefined };
    startTransition(() => router.push(`${pagePath}${productQueryString(next)}`, { scroll: false }));
  };
  return { apply, pending };
}

function FilterPanel({ pagePath, query, facets, collections }: FiltersProps) {
  const { basePath } = useShopStore();
  const { apply, pending } = useApply(pagePath, query);
  const selected = selectedFacetIds(query.facets);
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    apply({ facets: facetsParam(next, facets) });
  };
  const hasFilters = Boolean(query.facets || query.inStock);

  return (
    <div className={cn("space-y-7 transition-opacity", pending && "opacity-60")}>
      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium text-slate-800">
        In stock only
        <input
          type="checkbox"
          checked={Boolean(query.inStock)}
          onChange={(event) => apply({ inStock: event.target.checked || undefined })}
          className="h-4 w-4 accent-(--shop-accent)"
        />
      </label>

      {collections && collections.length > 0 && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</h3>
          <ul className="space-y-1">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <Link
                  href={`${basePath}/collections/${collection.slug}`}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {collection.name}
                  <span className="text-xs text-slate-400">{collection.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {facets.map((group) => (
        <section key={group.code}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{group.name}</h3>
          <ul className="space-y-1">
            {group.values.map((value) => {
              const checked = selected.has(value.id);
              return (
                <li key={value.id}>
                  <button
                    type="button"
                    onClick={() => toggle(value.id)}
                    aria-pressed={checked}
                    className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        checked ? "border-(--shop-accent) bg-(--shop-accent) text-white" : "border-slate-300 bg-white",
                      )}
                    >
                      {checked && <Check className="h-3 w-3" />}
                    </span>
                    <span className="flex-1">{value.name}</span>
                    <span className="text-xs text-slate-400">{value.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {hasFilters && (
        <button
          type="button"
          onClick={() => apply({ facets: undefined, inStock: undefined })}
          className="text-sm font-medium text-(--shop-accent) hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/** Desktop sidebar. */
export function CatalogSidebar(props: FiltersProps) {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-24">
        <FilterPanel {...props} />
      </div>
    </aside>
  );
}

/** Result count, sort and (on small screens) the filters drawer. */
export function CatalogToolbar(props: FiltersProps & { total: number }) {
  const { apply, pending } = useApply(props.pagePath, props.query);
  const [open, setOpen] = useState(false);
  const sort = props.query.sort ?? (props.query.q ? "relevance" : "name_asc");
  const sorts = PRODUCT_SORTS.filter((option) => option !== "relevance" || props.query.q);

  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <p className={cn("text-sm text-slate-500", pending && "opacity-60")}>
        {props.total} product{props.total === 1 ? "" : "s"}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 px-3.5 text-sm font-medium text-slate-700 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <label className="sr-only" htmlFor="shop-sort">
          Sort by
        </label>
        <select
          id="shop-sort"
          value={sort}
          onChange={(event) => apply({ sort: event.target.value as ProductSort })}
          className="h-9 rounded-full border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-(--shop-accent-ring)"
        >
          {sorts.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <span className="font-semibold">Filters</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel {...props} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
