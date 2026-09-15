import { date, num, obj } from "./read";

export type PlatformStats = {
  readonly users: {
    readonly total: number;
    readonly active: number;
    readonly suspended: number;
    readonly newLast7Days: number;
    readonly newLast30Days: number;
  };
  readonly clientOrgs: number;
  readonly activeSessions: number;
  readonly pendingInvitations: number;
  readonly asOf: Date;
};

export function parsePlatformStats(raw: unknown, at: string): PlatformStats {
  const envelope = obj(raw, at);
  const users = obj(envelope.users, `${at}.users`);
  const organizations = obj(envelope.organizations, `${at}.organizations`);
  const sessions = obj(envelope.sessions, `${at}.sessions`);
  const invitations = obj(envelope.invitations, `${at}.invitations`);
  return {
    users: {
      total: num(users, "total", `${at}.users`),
      active: num(users, "active", `${at}.users`),
      suspended: num(users, "suspended", `${at}.users`),
      newLast7Days: num(users, "newLast7Days", `${at}.users`),
      newLast30Days: num(users, "newLast30Days", `${at}.users`),
    },
    clientOrgs: num(organizations, "totalClients", `${at}.organizations`),
    activeSessions: num(sessions, "active", `${at}.sessions`),
    pendingInvitations: num(invitations, "pending", `${at}.invitations`),
    asOf: date(envelope, "timestamp", at),
  };
}
