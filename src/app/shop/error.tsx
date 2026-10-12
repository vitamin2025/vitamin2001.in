"use client";

import { ShopError } from "@/components/shop/shop-boundaries";

export default function ShopErrorBoundary(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ShopError {...props} />;
}
