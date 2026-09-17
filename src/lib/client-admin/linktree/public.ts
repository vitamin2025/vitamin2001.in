import type { LinktreeTheme } from "./types";

export type PublicLinktreeLink = {
  id: string;
  title: string;
  href: string;
  thumbnailUrl?: string | null;
  position: number;
};

export type PublicLinktreeSocial = {
  id: string;
  platform: string;
  url: string;
  position: number;
};

export type PublicLinktreeData = {
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  slug: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  theme?: LinktreeTheme | null;
  custom?: Record<string, unknown> | null;
  links: PublicLinktreeLink[];
  socialLinks: PublicLinktreeSocial[];
};

type PublicApiPayload = {
  title?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  slug?: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  seo?: {
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
  };
  theme?: LinktreeTheme | null;
  custom?: Record<string, unknown> | null;
  links?: Array<{
    id: string;
    title: string;
    url?: string;
    originalUrl?: string;
    shortUrl?: string | null;
    thumbnailUrl?: string | null;
    position?: number;
    isEnabled?: boolean;
  }>;
  socialLinks?: Array<{
    id: string;
    platform: string;
    url: string;
    position?: number;
    isEnabled?: boolean;
  }>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function normalizePublicPage(raw: unknown, fallbackSlug: string): PublicLinktreeData | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as PublicApiPayload;
  if (!payload.title && !payload.slug) return null;

  const links = (payload.links ?? [])
    .map((link, index) => ({
      id: link.id,
      title: link.title,
      href: link.url || link.shortUrl || link.originalUrl || "",
      thumbnailUrl: link.thumbnailUrl ?? null,
      position: link.position ?? index,
    }))
    .filter((link) => Boolean(link.href))
    .sort((a, b) => a.position - b.position);

  const socialLinks = (payload.socialLinks ?? [])
    .map((social, index) => ({
      id: social.id,
      platform: social.platform,
      url: social.url,
      position: social.position ?? index,
    }))
    .filter((social) => Boolean(social.url))
    .sort((a, b) => a.position - b.position);

  return {
    title: payload.title || fallbackSlug,
    bio: payload.bio ?? null,
    avatarUrl: payload.avatarUrl ?? null,
    slug: (payload.slug || fallbackSlug).toLowerCase(),
    ogTitle: payload.ogTitle ?? payload.seo?.ogTitle ?? null,
    ogDescription: payload.ogDescription ?? payload.seo?.ogDescription ?? null,
    ogImage: payload.ogImage ?? payload.seo?.ogImage ?? null,
    theme: asRecord(payload.theme) as LinktreeTheme | null,
    custom: asRecord(payload.custom),
    links,
    socialLinks,
  };
}

export async function fetchPublicPage(slug: string): Promise<PublicLinktreeData | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const normalizedBase = apiBase.replace(/\/+$/, "").replace(/\/v1$/i, "");
  const url = `${normalizedBase}/v1/p/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return normalizePublicPage(await res.json(), slug);
  } catch {
    return null;
  }
}
