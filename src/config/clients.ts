import { ClientConfig } from "@/types/client";

export const CLIENT_REGISTRY: Record<string, ClientConfig> = {
  runachan: {
    name: "Runachan",
    subdomain: "runachan",
    tagline: "Tailored digital experiences and operations",
    features: ["analytics", "client-portal", "custom-theming", "reports"],
    adminEnabled: true,
  },
};

export function getClientConfig(subdomain: string): ClientConfig | undefined {
  const normalized = subdomain.toLowerCase().trim();
  return CLIENT_REGISTRY[normalized];
}

export function titleCaseSlug(slug: string): string {
  const titled = slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return titled || slug;
}

export function getClientConfigOrFallback(subdomain: string): ClientConfig {
  const normalized = subdomain.toLowerCase().trim();
  return (
    getClientConfig(normalized) ?? {
      name: titleCaseSlug(normalized),
      subdomain: normalized,
      features: [],
      adminEnabled: true,
    }
  );
}

export function getAllClients(): ClientConfig[] {
  return Object.values(CLIENT_REGISTRY);
}

export function isValidClient(subdomain: string): boolean {
  return Boolean(getClientConfig(subdomain));
}
