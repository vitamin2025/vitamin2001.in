"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, PackageSearch, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isShopApiError } from "@/lib/shop/api";
import { useShopStore } from "@/lib/shop/store-context";
import { accentLinkClass } from "./accent-button";
import { EmptyState } from "./shop-states";

/** A product, category or page this store doesn't have. Renders inside the shop's header and footer. */
export function ShopNotFound() {
  const { basePath } = useShopStore();
  return (
    <EmptyState
      icon={<PackageSearch className="h-7 w-7" />}
      title="We couldn't find that"
      action={
        <Link href={`${basePath}/products`} className={accentLinkClass()}>
          Browse all products
        </Link>
      }
    >
      The product or page may have moved, or is no longer sold here.
    </EmptyState>
  );
}

/** A shop page failed to load, usually because the shop is starting up. */
export function ShopError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const waking = isShopApiError(error) && error.status === 503;
  return (
    <EmptyState
      icon={<AlertTriangle className="h-7 w-7" />}
      title={waking ? "The shop is waking up" : "Something went wrong"}
      action={
        <Button onClick={() => retry()} className="gap-2">
          <RotateCw className="h-4 w-4" /> Try again
        </Button>
      }
    >
      We couldn&apos;t load this page just now. Please try again in a moment.
    </EmptyState>
  );
}
