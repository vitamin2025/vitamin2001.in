import type { UserId } from "@/lib/admin/ids";
import { CLIENT_ADMIN_ROOT } from "@/lib/client-admin/keys";

export const linktreeKeys = {
  root: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "linktree"] as const,
  page: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "linktree", "page"] as const,
  analytics: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "linktree", "analytics"] as const,
  linkAnalytics: (actorId: UserId, slug: string, linkId: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "linktree", "link-analytics", linkId] as const,
};
