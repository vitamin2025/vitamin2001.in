import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, PackageSearch } from "lucide-react";
import type { StoreSlug } from "@/lib/shop/api";
import { listProducts } from "@/lib/shop/catalog";
import { PRODUCTS_PER_PAGE } from "@/lib/shop/query";
import type { ProductQuery } from "@/lib/shop/types";
import { CatalogSidebar, CatalogToolbar } from "./catalog-filters";
import { Pagination } from "./pagination";
import { ProductGrid } from "./product-card";
import { EmptyState } from "./shop-states";

export interface Crumb {
  readonly href: string;
  readonly label: string;
}

export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          {index === items.length - 1 ? (
            <span className="text-slate-700">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/** A product listing with filters, sort and pages: the catalog, search results and collections. */
export async function CatalogView({
  seller,
  pagePath,
  query,
  title,
  intro,
  crumbs,
  showCollections = true,
}: {
  seller: StoreSlug;
  pagePath: string;
  query: ProductQuery;
  title: string;
  intro?: ReactNode;
  crumbs: readonly Crumb[];
  showCollections?: boolean;
}) {
  const list = await listProducts(seller, query);
  const filtered = Boolean(query.q || query.facets || query.inStock);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={crumbs} />
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {intro}
      </header>
      <div className="flex gap-10">
        <CatalogSidebar
          pagePath={pagePath}
          query={query}
          facets={list.facets}
          collections={showCollections ? list.collections : undefined}
        />
        <div className="min-w-0 flex-1">
          <CatalogToolbar
            pagePath={pagePath}
            query={query}
            facets={list.facets}
            collections={showCollections ? list.collections : undefined}
            total={list.total}
          />
          {list.items.length ? (
            <ProductGrid products={list.items} />
          ) : (
            <EmptyState icon={<PackageSearch className="h-7 w-7" />} title="No products found">
              {filtered ? "Try another search or fewer filters." : "New products are on their way."}
            </EmptyState>
          )}
          <Pagination pagePath={pagePath} query={query} total={list.total} perPage={PRODUCTS_PER_PAGE} />
        </div>
      </div>
    </div>
  );
}
