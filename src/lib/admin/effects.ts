import type { QueryClient } from "@tanstack/react-query";
import type { OrgId, UserId } from "./ids";
import { keys, PLATFORM_ADMIN_ROOT } from "./keys";

export type AdminEffect =
  | { on: "user.created"; userId: UserId; orgId: OrgId | null }
  | { on: "user.updated"; userId: UserId }
  | { on: "user.suspensionChanged"; userId: UserId }
  | { on: "user.passwordReset"; userId: UserId }
  | { on: "membership.changed"; userId: UserId; orgId: OrgId | null }
  | { on: "org.created"; orgId: OrgId }
  | { on: "org.updated"; orgId: OrgId }
  | { on: "org.activeChanged"; orgId: OrgId }
  | { on: "session.revoked"; userId: UserId | null }
  | { on: "session.changed" }
  | { on: "signedOut" };

export async function applyEffect(
  queryClient: QueryClient,
  actorId: UserId | null,
  effect: AdminEffect,
): Promise<void> {
  if (effect.on === "signedOut" || !actorId) {
    await queryClient.removeQueries({ queryKey: PLATFORM_ADMIN_ROOT });
    return;
  }

  const invalidateAuditAndOverview = [
    queryClient.invalidateQueries({ queryKey: keys.audit.all(actorId) }),
    queryClient.invalidateQueries({ queryKey: keys.overview.all(actorId) }),
  ];

  switch (effect.on) {
    case "user.created":
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.users.all(actorId) }),
        queryClient.invalidateQueries({ queryKey: keys.orgs.all(actorId) }),
        ...invalidateAuditAndOverview,
      ]);
      return;
    case "user.updated":
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.users.all(actorId) }),
        ...invalidateAuditAndOverview,
      ]);
      return;
    case "user.suspensionChanged":
    case "user.passwordReset":
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.users.all(actorId) }),
        queryClient.invalidateQueries({ queryKey: keys.sessions.all(actorId) }),
        ...invalidateAuditAndOverview,
      ]);
      return;
    case "membership.changed":
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.users.all(actorId) }),
        queryClient.invalidateQueries({ queryKey: keys.orgs.all(actorId) }),
        ...invalidateAuditAndOverview,
      ]);
      return;
    case "org.created":
    case "org.updated":
    case "org.activeChanged":
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.orgs.all(actorId) }),
        ...invalidateAuditAndOverview,
      ]);
      return;
    case "session.changed":
      await queryClient.invalidateQueries({ queryKey: keys.session() });
      return;
    case "session.revoked":
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.sessions.all(actorId) }),
        queryClient.invalidateQueries({ queryKey: keys.users.all(actorId) }),
        ...invalidateAuditAndOverview,
      ]);
      return;
  }
}
