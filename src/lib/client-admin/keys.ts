import type { UserId } from "@/lib/admin/ids";

export const CLIENT_ADMIN_ROOT = ["client-admin"] as const;

export const clientAdminKeys = {
  context: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "context"] as const,
  members: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "members"] as const,
  settings: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "settings"] as const,
  billing: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "billing"] as const,
  invoices: (actorId: UserId, slug: string) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "invoices"] as const,
  audit: (actorId: UserId, slug: string, query: unknown) =>
    [...CLIENT_ADMIN_ROOT, actorId, slug, "audit", query] as const,
};
