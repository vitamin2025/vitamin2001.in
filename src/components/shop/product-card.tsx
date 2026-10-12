"use client";

import Link from "next/link";
import { ImageOff } from "lucide-react";
import { formatPriceRange } from "@/lib/shop/format";
import { useShopStore } from "@/lib/shop/store-context";
import type { ProductSummary } from "@/lib/shop/types";

export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
        <ImageOff className="h-8 w-8" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}

export function ProductCard({ product }: { product: ProductSummary }) {
  const { basePath } = useShopStore();
  return (
    <Link
      href={`${basePath}/products/${product.slug}`}
      className="group flex flex-col gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--shop-accent-ring)"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/70">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
        />
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
            Out of stock
          </span>
        )}
      </div>
      <div className="space-y-1 px-1">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:text-(--shop-accent-strong)">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-slate-900">{formatPriceRange(product.price)}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: readonly ProductSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}
