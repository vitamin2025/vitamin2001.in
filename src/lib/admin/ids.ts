import { malformed } from "./errors";

declare const brand: unique symbol;
type Branded<B extends string> = string & { readonly [brand]: B };

export type UserId = Branded<"UserId">;
export type OrgId = Branded<"OrgId">;
export type MemberId = Branded<"MemberId">;
export type SessionId = Branded<"SessionId">;

export function asUserId(value: string): UserId {
  return nonEmpty(value, "UserId") as UserId;
}

export function asOrgId(value: string): OrgId {
  return nonEmpty(value, "OrgId") as OrgId;
}

export function asMemberId(value: string): MemberId {
  return nonEmpty(value, "MemberId") as MemberId;
}

export function asSessionId(value: string): SessionId {
  return nonEmpty(value, "SessionId") as SessionId;
}

function nonEmpty(value: string, kind: string): string {
  if (!value || value.trim() === "") {
    throw malformed(`${kind} is required`, kind);
  }
  return value;
}
