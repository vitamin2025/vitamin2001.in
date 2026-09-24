import type { ComponentType } from "react";
import type { PublicLinktreeData } from "@/lib/client-admin/linktree/public";
import { RunachanLinkPage } from "./runachan-link";

export type CustomLinkPage = ComponentType<{ data: PublicLinktreeData | null }>;

export const CUSTOM_LINK_PAGES: Record<string, CustomLinkPage> = {
  runachan: RunachanLinkPage,
};

export function getCustomLinkPage(slug: string | undefined | null): CustomLinkPage | undefined {
  if (!slug) return undefined;
  return CUSTOM_LINK_PAGES[slug.toLowerCase().trim()];
}
