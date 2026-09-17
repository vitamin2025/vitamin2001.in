import type { UserId } from "./ids";

export const PLATFORM_ADMIN_ROOT = ["platform-admin"] as const;

export const keys = {
  session: () => [...PLATFORM_ADMIN_ROOT, "session"] as const,
  overview: {
    all: (actorId: UserId) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "overview"] as const,
    stats: (actorId: UserId) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "overview", "stats"] as const,
    activity: (actorId: UserId) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "overview", "activity"] as const,
  },
  users: {
    all: (actorId: UserId) => [...PLATFORM_ADMIN_ROOT, actorId, "users"] as const,
    list: (actorId: UserId, query: unknown) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "users", "list", query] as const,
    detail: (actorId: UserId, userId: UserId) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "users", "detail", userId] as const,
    memberships: (actorId: UserId, userId: UserId) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "users", userId, "memberships"] as const,
  },
  orgs: {
    all: (actorId: UserId) => [...PLATFORM_ADMIN_ROOT, actorId, "orgs"] as const,
    list: (actorId: UserId, query: unknown) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "orgs", "list", query] as const,
    detail: (actorId: UserId, orgId: string) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "orgs", "detail", orgId] as const,
    members: (actorId: UserId, orgId: string) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "orgs", orgId, "members"] as const,
  },
  sessions: {
    all: (actorId: UserId) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "sessions"] as const,
    list: (actorId: UserId, query: unknown) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "sessions", "list", query] as const,
    byUser: (actorId: UserId, userId: UserId) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "sessions", "user", userId] as const,
  },
  audit: {
    all: (actorId: UserId) => [...PLATFORM_ADMIN_ROOT, actorId, "audit"] as const,
    list: (actorId: UserId, query: unknown) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "audit", "list", query] as const,
    entity: (actorId: UserId, type: string, id: string) =>
      [...PLATFORM_ADMIN_ROOT, actorId, "audit", "entity", type, id] as const,
  },
};
