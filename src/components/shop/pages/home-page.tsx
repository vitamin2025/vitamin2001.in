import Link from "next/link";
import { ArrowRight, FileText, PackageCheck, ShieldCheck } from "lucide-react";
import type { StoreSlug } from "@/lib/shop/api";
import { getShopAvailability, listCollections, listProducts } from "@/lib/shop/catalog";
import { shopBasePath } from "@/lib/shop/server";
import { accentLinkClass } from "../accent-button";
import { ProductGrid } from "../product-card";
import { EmptyState } from "../shop-states";
import { shopTheme } from "../themes";

const FEATURED_COLLECTION = "featured";

/** The shop's landing page: banner, categories and a first look at the products. */
export async function ShopHomePage({ seller }: { seller: StoreSlug }) {
  const availability = await getShopAvailability(seller);
  if (availability.status !== "open") return null;
  const profile = availability.seller;
  const basePath = await shopBasePath(seller);
  const collections = await listCollections(seller).catch(() => []);
  const hasFeatured = collections.some((collection) => collection.slug === FEATURED_COLLECTION);
  const products = await listProducts(seller, {
    collection: hasFeatured ? FEATURED_COLLECTION : undefined,
    perPage: 8,
  });
  const categories = collections.filter((collection) => collection.slug !== FEATURED_COLLECTION);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {profile.banner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--shop-accent),transparent_55%),radial-gradient(circle_at_80%_60%,var(--shop-accent-strong),transparent_50%)] opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" aria-hidden />
        <div className="relative mx-auto flex min-h-[340px] max-w-7xl flex-col justify-end gap-5 px-4 py-14 sm:px-6 lg:min-h-[420px] lg:px-8">
          {profile.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.logo} alt="" className="h-16 w-16 rounded-2xl bg-white object-contain p-1.5 shadow-lg" />
          )}
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
            {profile.description && (
              <p className="text-base leading-relaxed text-white/85 sm:text-lg">{profile.description}</p>
            )}
          </div>
          <div>
            <Link href={`${basePath}/products`} className={accentLinkClass("lg")}>
              Shop now <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-5 text-sm text-slate-600 sm:grid-cols-3 sm:px-6 lg:px-8">
          <li className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-(--shop-accent)" /> Secure checkout with PayU
          </li>
          <li className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-(--shop-accent)" /> Invoice emailed with every order
          </li>
          <li className="flex items-center gap-2.5">
            <PackageCheck className="h-5 w-5 text-(--shop-accent)" /> Shipping updates by email
          </li>
        </ul>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Shop by category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((collection) => (
              <Link
                key={collection.slug}
                href={`${basePath}/collections/${collection.slug}`}
                className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-(--shop-accent-soft) p-4 ring-1 ring-slate-200/70"
              >
                {collection.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={collection.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
                {collection.image && <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" aria-hidden />}
                <span
                  className={
                    collection.image
                      ? "relative text-base font-semibold text-white"
                      : "relative text-base font-semibold text-(--shop-accent-strong)"
                  }
                >
                  {collection.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{hasFeatured ? "Featured" : "Products"}</h2>
          <Link href={`${basePath}/products`} className="inline-flex items-center gap-1 text-sm font-medium text-(--shop-accent) hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {products.items.length ? (
          <ProductGrid products={products.items} />
        ) : (
          <EmptyState title="No products yet">{profile.name} is setting up the shop. Check back soon.</EmptyState>
        )}
      </section>
    </div>
  );
}

/** The store's home page: its own design when it has one (see `../themes`), else the shared one. */
export async function ThemedShopHome({ seller }: { seller: StoreSlug }) {
  const availability = await getShopAvailability(seller);
  const Home = (availability.status === "open" && shopTheme(availability.seller.slug).Home) || ShopHomePage;
  return <Home seller={seller} />;
}
