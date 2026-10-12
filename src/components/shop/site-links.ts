/** A page on vitamin2001.in itself (policies), from any subdomain. */
export function mainSiteUrl(path: string): string {
  const production = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "vitamin2001.in";
  if (process.env.NODE_ENV === "production") return `https://${production}${path}`;
  return `http://${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "localhost:3000"}${path}`;
}

export const POLICY_LINKS = [
  { label: "Shipping & returns", path: "/shipping-return" },
  { label: "Refunds", path: "/refund" },
  { label: "Terms", path: "/terms" },
  { label: "Privacy", path: "/privacy-policy" },
] as const;
