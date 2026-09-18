import { createElement } from "react";
import type { Metadata } from "next";
import { getClientConfigOrFallback } from "@/config/clients";
import { fetchPublicPage } from "@/lib/client-admin/linktree/public";
import { DefaultLinkPage } from "./default-link";
import { getCustomLinkPage } from "./clients/registry";

interface PublicLinktreeProps {
  params: Promise<{ client_name: string }>;
}

export async function generateMetadata({
  params,
}: PublicLinktreeProps): Promise<Metadata> {
  const { client_name } = await params;
  const page = await fetchPublicPage(client_name);
  const client = getClientConfigOrFallback(client_name);

  const title = page?.ogTitle || page?.title || `${client.name} — Official Links`;
  const description =
    page?.ogDescription ||
    page?.bio ||
    client.tagline ||
    `Official links and social profiles for ${client.name}.`;
  const images = page?.ogImage ? [page.ogImage] : page?.avatarUrl ? [page.avatarUrl] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: page?.ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export default async function PublicLinktreePage({ params }: PublicLinktreeProps) {
  const { client_name } = await params;
  const page = await fetchPublicPage(client_name);
  const client = getClientConfigOrFallback(client_name);

  const customTheme = page?.custom?.theme;
  const CustomPage =
    customTheme && page?.slug ? getCustomLinkPage(page.slug) : undefined;

  if (page && CustomPage) {
    return createElement(CustomPage, { data: page });
  }

  return <DefaultLinkPage data={page} client={client} clientName={client_name} />;
}
