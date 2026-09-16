import { clientAdminRoutes } from "./routes";

export const DEFAULT_CLIENT_FEATURES = [
  "dashboard",
  "team",
  "settings",
] as const;

export type OptionalClientFeature = "settings" | "billing" | "audit";
export type FeatureIcon =
  | "dashboard"
  | "users"
  | "settings"
  | "billing"
  | "audit"
  | "spark";

export type ClientAdminNavItem = {
  readonly key: string;
  readonly label: string;
  readonly href: string;
  readonly icon: FeatureIcon;
  readonly kind: "page" | "comingSoon";
};

export function humanizeFeatureKey(key: string): string {
  const titled = key
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return titled || key;
}

export function parseFeatureList(meta: Record<string, unknown>): string[] {
  if (!Object.prototype.hasOwnProperty.call(meta, "features")) {
    return [...DEFAULT_CLIENT_FEATURES];
  }
  const raw = meta.features;
  if (!Array.isArray(raw)) return [...DEFAULT_CLIENT_FEATURES];
  return raw.filter(
    (item): item is string => typeof item === "string" && item.trim() !== "",
  );
}

export function isOptionalClientFeature(
  key: string,
): key is OptionalClientFeature {
  return key === "settings" || key === "billing" || key === "audit";
}

export function isImplementedFeature(key: string): boolean {
  return (
    key === "dashboard" ||
    key === "team" ||
    isOptionalClientFeature(key)
  );
}

export function implementedFeatureHref(slug: string, key: string): string | null {
  if (key === "dashboard") return clientAdminRoutes.dashboard(slug);
  if (key === "team") return clientAdminRoutes.members(slug);
  if (key === "settings") return clientAdminRoutes.settings(slug);
  if (key === "billing") return clientAdminRoutes.billing(slug);
  if (key === "audit") return clientAdminRoutes.audit(slug);
  return null;
}

export function orgHasFeature(
  features: readonly string[],
  key: string,
): boolean {
  return features.includes(key);
}

export function clientAdminNavItems(
  slug: string,
  features: readonly string[],
): readonly ClientAdminNavItem[] {
  const items: ClientAdminNavItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: clientAdminRoutes.dashboard(slug),
      icon: "dashboard",
      kind: "page",
    },
    {
      key: "team",
      label: "Members",
      href: clientAdminRoutes.members(slug),
      icon: "users",
      kind: "page",
    },
  ];
  const seen = new Set(["dashboard", "team"]);
  for (const key of features) {
    if (seen.has(key)) continue;
    seen.add(key);
    if (key === "settings") {
      items.push({
        key,
        label: "Settings",
        href: clientAdminRoutes.settings(slug),
        icon: "settings",
        kind: "page",
      });
      continue;
    }
    if (key === "billing") {
      items.push({
        key,
        label: "Billing",
        href: clientAdminRoutes.billing(slug),
        icon: "billing",
        kind: "page",
      });
      continue;
    }
    if (key === "audit") {
      items.push({
        key,
        label: "Audit",
        href: clientAdminRoutes.audit(slug),
        icon: "audit",
        kind: "page",
      });
      continue;
    }
    items.push({
      key,
      label: humanizeFeatureKey(key),
      href: clientAdminRoutes.feature(slug, key),
      icon: "spark",
      kind: "comingSoon",
    });
  }
  return items;
}
