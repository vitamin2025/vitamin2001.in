import { asOrgId, type OrgId } from "@/lib/admin/ids";
import { date, jsonObject, list, num, obj, optStr, str } from "@/lib/admin/read";
import { parseFeatureList } from "./features";

export type ClientOrgSummary = {
  readonly id: OrgId;
  readonly name: string;
  readonly slug: string;
  readonly logoUrl: string | null;
  readonly createdAt: Date;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly features: readonly string[];
};

export type ClientDashboardStats = {
  readonly totalMembers: number;
  readonly pendingInvitations: number;
  readonly roles: Readonly<Record<string, number>>;
};

export type ClientActivity = {
  readonly id: string;
  readonly action: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly createdAt: Date;
  readonly actorName: string | null;
};

export type ClientDashboard = {
  readonly organization: ClientOrgSummary;
  readonly stats: ClientDashboardStats;
  readonly recentActivity: readonly ClientActivity[];
};

function parseRoles(
  raw: unknown,
  at: string,
): Record<string, number> {
  const record = obj(raw, at);
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(record)) {
    const parsed = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(parsed)) out[key] = parsed;
  }
  return out;
}

function parseActivity(raw: unknown, at: string): ClientActivity {
  const row = obj(raw, at);
  return {
    id: str(row, "id", at),
    action: str(row, "action", at),
    entityType: str(row, "entityType", at),
    entityId: str(row, "entityId", at),
    createdAt: date(row, "createdAt", at),
    actorName: optStr(row, "actorName", at),
  };
}

export function parseClientDashboard(raw: unknown, at: string): ClientDashboard {
  const envelope = obj(raw, at);
  const organization = obj(envelope.organization, `${at}.organization`);
  const stats = obj(envelope.stats, `${at}.stats`);
  const metadata = jsonObject(organization, "metadata", `${at}.organization`);
  const slug = str(organization, "slug", `${at}.organization`);

  // Direct enabledFeatures on organization, or inside metadata
  const directFeatures = (organization as Record<string, unknown>).enabledFeatures;
  const features = parseFeatureList(metadata, directFeatures);

  return {
    organization: {
      id: asOrgId(str(organization, "id", `${at}.organization`)),
      name: str(organization, "name", `${at}.organization`),
      slug,
      logoUrl: optStr(organization, "logo", `${at}.organization`),
      createdAt: date(organization, "createdAt", `${at}.organization`),
      metadata,
      features,
    },
    stats: {
      totalMembers: num(stats, "totalMembers", `${at}.stats`),
      pendingInvitations: num(stats, "pendingInvitations", `${at}.stats`),
      roles: parseRoles(stats.roles, `${at}.stats.roles`),
    },
    recentActivity: list(
      envelope.recentActivity,
      `${at}.recentActivity`,
      parseActivity,
    ),
  };
}
