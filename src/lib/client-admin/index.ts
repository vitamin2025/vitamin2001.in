export { clientAdminRoutes, clientUserRoutes } from "./routes";
export {
  DEFAULT_CLIENT_FEATURES,
  humanizeFeatureKey,
  isImplementedFeature,
  isOptionalClientFeature,
  implementedFeatureHref,
  orgHasFeature,
  clientAdminNavItems,
  parseFeatureList,
} from "./features";
export type {
  OptionalClientFeature,
  FeatureIcon,
  ClientAdminNavItem,
} from "./features";

export {
  ClientAdminProvider,
  useClientAdmin,
  useClientDashboard,
  useClientAdminAccess,
  useClientSession,
  useClientAdminAuthCommands,
} from "./identity";
export type {
  ClientAdminAccess,
  ClientSessionAccess,
} from "./identity";

export type {
  ClientDashboard,
  ClientDashboardStats,
  ClientOrgSummary,
  ClientActivity,
} from "./dashboard";

export { useClientMembers, useClientMemberCommands } from "./members";
export type {
  ClientMember,
  ClientInvitation,
  ClientMembersResult,
} from "./members";

export { useClientSettings, useClientSettingsCommands } from "./settings";
export type { ClientOrgSettings } from "./settings";

export { useClientBilling, useClientInvoices } from "./billing";
export type { ClientBilling, ClientInvoices, ClientInvoice } from "./billing";

export { clientAuditQuery, useClientAuditLog } from "./audit";
export type { ClientAuditQuery } from "./audit";
