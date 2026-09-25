import type { Metadata } from "next";
import { getClientConfigOrFallback } from "@/config/clients";

type PublicCreatorProfile = {
  name?: string | null;
  bio?: string | null;
  bannerUrl?: string | null;
};

async function fetchPublicCreatorProfile(slug: string): Promise<PublicCreatorProfile | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const normalizedBase = apiBase.replace(/\/+$/, "").replace(/\/v1$/i, "");
  const url = `${normalizedBase}/v1/creators/${encodeURIComponent(slug)}/profile`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as PublicCreatorProfile;
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
}

export async function resolveClientMetadata(clientName: string): Promise<Metadata> {
  const client = getClientConfigOrFallback(clientName);
  const profile = await fetchPublicCreatorProfile(clientName);

  const titleDefault = (profile?.name || client.name || clientName).trim();
  const description =
    profile?.bio?.trim() ||
    client.tagline?.trim() ||
    `${titleDefault} community`;
  const images = profile?.bannerUrl ? [profile.bannerUrl] : [];

  return {
    title: {
      default: titleDefault,
      template: `%s | ${titleDefault}`,
    },
    description,
    applicationName: titleDefault,
    openGraph: {
      title: titleDefault,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: titleDefault,
      description,
      images,
    },
  };
}
