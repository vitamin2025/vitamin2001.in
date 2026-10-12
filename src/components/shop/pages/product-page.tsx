import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isShopApiError, type StoreSlug } from "@/lib/shop/api";
import { getProduct, getShopAvailability, listProducts } from "@/lib/shop/catalog";
import { descriptionText, sanitizeDescription } from "@/lib/shop/sanitize";
import { shopBasePath } from "@/lib/shop/server";
import type { ProductDetail } from "@/lib/shop/types";
import { Breadcrumbs } from "../catalog-view";
import { ProductGrid } from "../product-card";
import { ProductPurchase } from "../product-purchase";

async function loadProduct(seller: StoreSlug, slug: string): Promise<ProductDetail> {
  try {
    return await getProduct(seller, slug);
  } catch (error) {
    if (isShopApiError(error) && error.isNotFound) notFound();
    throw error;
  }
}

export async function productMetadata(seller: StoreSlug, slug: string): Promise<Metadata> {
  const [product, availability] = await Promise.all([
    loadProduct(seller, slug),
    getShopAvailability(seller),
  ]);
  const store = availability.status === "open" ? availability.seller.name : "Shop";
  const description = descriptionText(product.description) || undefined;
  return {
    title: { absolute: `${product.name} | ${store}` },
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

/** Facets as product attributes, e.g. "Form: Capsule". */
function attributes(product: ProductDetail): { name: string; values: string[] }[] {
  const byFacet = new Map<string, { name: string; values: string[] }>();
  for (const value of product.facets) {
    const entry = byFacet.get(value.facet.code) ?? { name: value.facet.name, values: [] };
    entry.values.push(value.name);
    byFacet.set(value.facet.code, entry);
  }
  return [...byFacet.values()];
}

export async function ProductPage({ seller, slug }: { seller: StoreSlug; slug: string }) {
  const basePath = await shopBasePath(seller);
  const product = await loadProduct(seller, slug);
  const description = sanitizeDescription(product.description);
  const facts = attributes(product);
  const collection = product.collections[0];
  const related = collection
    ? (await listProducts(seller, { collection: collection.slug, perPage: 5 }).catch(() => null))?.items
        .filter((item) => item.slug !== product.slug)
        .slice(0, 4) ?? []
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.length ? product.images : product.image ? [product.image] : undefined,
    description: descriptionText(product.description, 500) || undefined,
    sku: product.variants[0]?.sku,
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      sku: variant.sku,
      price: (variant.priceMinor / 100).toFixed(2),
      priceCurrency: variant.currency,
      availability: variant.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Breadcrumbs
        items={[
          { href: basePath, label: "Shop" },
          ...(collection
            ? [{ href: `${basePath}/collections/${collection.slug}`, label: collection.name }]
            : [{ href: `${basePath}/products`, label: "All products" }]),
          { href: `${basePath}/products/${product.slug}`, label: product.name },
        ]}
      />

      <ProductPurchase
        product={product}
        details={
          <div className="space-y-8">
            {description && (
              <section>
                <h2 className="mb-3 text-base font-semibold text-slate-900">Description</h2>
                <div className="shop-prose text-sm" dangerouslySetInnerHTML={{ __html: description }} />
              </section>
            )}
            {facts.length > 0 && (
              <section>
                <h2 className="mb-3 text-base font-semibold text-slate-900">Details</h2>
                <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200 text-sm">
                  {facts.map((fact) => (
                    <div key={fact.name} className="flex gap-4 px-4 py-2.5">
                      <dt className="w-32 shrink-0 text-slate-500">{fact.name}</dt>
                      <dd className="text-slate-800">{fact.values.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>
        }
      />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
