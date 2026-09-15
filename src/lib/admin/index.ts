export { asUserId, asOrgId, asMemberId, asSessionId } from "./ids";
export type { UserId, OrgId, MemberId, SessionId } from "./ids";

export { describe, toAdminError, isAdminError } from "./errors";
export type { AdminError, FieldErrors } from "./errors";

export {
  SYSTEM_ORG_SLUG,
  userCapabilities,
  membershipCapabilities,
  orgCapabilities,
  sessionCapabilities,
} from "./policy";
export type {
  Actor,
  AdminAction,
  Permit,
  Verdict,
  OrgRole,
  Suspension,
  UserCapabilities,
  MembershipCapabilities,
  OrgCapabilities,
  SessionCapabilities,
} from "./policy";

export { adminRoutes } from "./routes";
export { useListQuery, queryStatus } from "./paging";
export type {
  LoadStatus,
  PageInfo,
  CollectionResult,
  ListResult,
  DetailResult,
  QueryCodec,
} from "./paging";

export { ActorProvider, useActor, useAdminAccess, useAuthCommands } from "./identity";
export type { AdminAccess } from "./identity";

export {
  userListQuery,
  useUsers,
  useUser,
  useUserMemberships,
  useUserCommands,
  useMembershipCommands,
} from "./users";
export type {
  UserRow,
  UserDetail,
  UserListQuery,
  Membership,
  CreateUserInput,
  LinkedAccount,
} from "./users";

export {
  orgListQuery,
  useOrgs,
  useOrg,
  useOrgMembers,
  useOrgCommands,
} from "./organizations";
export type {
  OrgRow,
  OrgDetail,
  OrgMember,
  OrgListQuery,
  Invitation,
} from "./organizations";

export {
  sessionListQuery,
  useSessions,
  useUserSessions,
  useSessionCommands,
} from "./sessions";
export type { SessionRow, SessionListQuery } from "./sessions";

export {
  AUDIT_ACTIONS,
  auditQuery,
  useAuditLog,
  useEntityTrail,
  parseAuditEntry,
} from "./audit";
export type { AuditEntry, AuditQuery, EntityRef } from "./audit";

export { useOverview } from "./overview";
export type { PlatformStats } from "./stats";
