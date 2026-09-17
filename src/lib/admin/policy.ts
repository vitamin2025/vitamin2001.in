import type { OrgId, SessionId, UserId } from "./ids";

export const SYSTEM_ORG_SLUG =
  process.env.NEXT_PUBLIC_SYSTEM_ORG_SLUG ?? "system";

export type AdminAction =
  | "user.update"
  | "user.suspend"
  | "user.unsuspend"
  | "user.resetPassword"
  | "membership.add"
  | "membership.update"
  | "membership.remove"
  | "org.update"
  | "org.changeSlug"
  | "org.deactivate"
  | "org.reactivate"
  | "session.revoke"
  | "session.revokeAllForUser";

declare const permitBrand: unique symbol;
export type Permit<A extends AdminAction> = { readonly [permitBrand]: A };

export type Verdict<A extends AdminAction> =
  | { readonly allowed: true; readonly permit: Permit<A>; readonly warning?: string }
  | { readonly allowed: false; readonly reason: string; readonly permit?: undefined };

export type Actor = {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly imageUrl: string | null;
  readonly sessionId: SessionId;
  readonly sessionExpiresAt: Date;
  readonly activeOrgId: OrgId | null;
};

export type Suspension =
  | { readonly state: "active" }
  | {
      readonly state: "suspended";
      readonly reason: string | null;
      readonly expiresAt: Date | null;
    };

export type OrgRole = "owner" | "admin" | "member";

export type UserCapabilities = {
  readonly editProfile: Verdict<"user.update">;
  readonly suspend: Verdict<"user.suspend">;
  readonly unsuspend: Verdict<"user.unsuspend">;
  readonly resetPassword: Verdict<"user.resetPassword">;
  readonly revokeSessions: Verdict<"session.revokeAllForUser">;
  readonly editMemberships: Verdict<"membership.add">;
};

export type MembershipCapabilities = {
  readonly changeRole: Verdict<"membership.update">;
  readonly remove: Verdict<"membership.remove">;
};

export type OrgCapabilities = {
  readonly rename: Verdict<"org.update">;
  readonly changeSlug: Verdict<"org.changeSlug">;
  readonly deactivate: Verdict<"org.deactivate">;
  readonly reactivate: Verdict<"org.reactivate">;
};

export type SessionCapabilities = {
  readonly revoke: Verdict<"session.revoke">;
};

function allow<A extends AdminAction>(warning?: string): Verdict<A> {
  return { allowed: true, permit: {} as Permit<A>, warning };
}

function deny<A extends AdminAction>(reason: string): Verdict<A> {
  return { allowed: false, reason };
}

export function userCapabilities(
  actor: Actor,
  target: { id: UserId; suspension: Suspension; activeSessionCount: number },
): UserCapabilities {
  const isSelf = target.id === actor.id;
  return {
    editProfile: allow(),
    suspend: isSelf
      ? deny("You cannot suspend your own account.")
      : target.suspension.state === "suspended"
        ? deny("Already suspended.")
        : allow("Revokes every active session for this user immediately."),
    unsuspend:
      target.suspension.state === "active" ? deny("Not suspended.") : allow(),
    resetPassword: allow(
      isSelf
        ? "This signs you out of every device, including this one."
        : undefined,
    ),
    revokeSessions:
      target.activeSessionCount === 0
        ? deny("No active sessions.")
        : allow(isSelf ? "This signs you out of this device." : undefined),
    editMemberships: allow(),
  };
}

export function membershipCapabilities(
  actor: Actor,
  membership: { userId: UserId; role: OrgRole; orgSlug: string },
): MembershipCapabilities {
  const selfLockout =
    membership.userId === actor.id &&
    membership.orgSlug === SYSTEM_ORG_SLUG &&
    membership.role === "owner";
  return {
    changeRole: selfLockout
      ? deny("Changing your own System owner role would revoke your super-admin access.")
      : allow(),
    remove: selfLockout
      ? deny("Removing your own System membership would revoke your super-admin access.")
      : allow(),
  };
}

export function orgCapabilities(org: {
  slug: string;
  active: boolean;
}): OrgCapabilities {
  const isSystem = org.slug === SYSTEM_ORG_SLUG;
  return {
    rename: allow(),
    changeSlug: isSystem
      ? deny("The System organization slug is fixed.")
      : allow(),
    deactivate: isSystem
      ? deny("The System organization cannot be deactivated.")
      : !org.active
        ? deny("Already inactive.")
        : allow("Members keep their accounts but the client is marked inactive."),
    reactivate: org.active ? deny("Already active.") : allow(),
  };
}

export function sessionCapabilities(
  actor: Actor,
  session: { id: SessionId },
): SessionCapabilities {
  return {
    revoke: allow(
      session.id === actor.sessionId
        ? "This is your current session — you will be signed out."
        : undefined,
    ),
  };
}

export function parseOrgRole(value: string): OrgRole {
  if (value === "owner" || value === "admin" || value === "member") return value;
  return "member";
}
