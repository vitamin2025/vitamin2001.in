"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ActorProvider,
  fetchActor,
  useAuthCommands,
  type Actor,
} from "@/lib/admin/identity";
import { keys as adminSessionKeys } from "@/lib/admin/keys";
import { asOrgId, type OrgId } from "@/lib/admin/ids";
import { toAdminError, retryUnlessAuthz, type AdminError } from "@/lib/admin/errors";
import { authRequest, orgRequest, assertSameSiteInDev } from "@/lib/admin/http";
import type { Command } from "@/lib/admin/command";
import { SYSTEM_ORG_SLUG } from "@/lib/admin/policy";
import { list, obj, str } from "@/lib/admin/read";
import { parseClientDashboard, type ClientDashboard } from "./dashboard";
import { CLIENT_ADMIN_ROOT, clientAdminKeys } from "./keys";

export type ClientAdminAccess =
  | { readonly status: "checking" }
  | { readonly status: "anonymous" }
  | {
      readonly status: "denied";
      readonly actor: Actor;
      readonly reason: string;
    }
  | {
      readonly status: "granted";
      readonly actor: Actor;
      readonly dashboard: ClientDashboard;
    }
  | { readonly status: "unavailable"; readonly error: AdminError };

export type ClientSessionAccess =
  | { readonly status: "checking" }
  | { readonly status: "anonymous" }
  | { readonly status: "granted"; readonly actor: Actor }
  | { readonly status: "unavailable"; readonly error: AdminError };

type ClientAdminContextValue = {
  readonly actor: Actor;
  readonly dashboard: ClientDashboard;
};

const ClientAdminContext = createContext<ClientAdminContextValue | null>(null);

export function ClientAdminProvider({
  actor,
  dashboard,
  children,
}: {
  actor: Actor;
  dashboard: ClientDashboard;
  children: ReactNode;
}) {
  return (
    <ActorProvider actor={actor}>
      <ClientAdminContext.Provider value={{ actor, dashboard }}>
        {children}
      </ClientAdminContext.Provider>
    </ActorProvider>
  );
}

export function useClientAdmin(): ClientAdminContextValue {
  const value = useContext(ClientAdminContext);
  if (!value) {
    throw new Error("useClientAdmin must run inside ClientAdminGate");
  }
  return value;
}

export function useClientDashboard(): ClientDashboard {
  return useClientAdmin().dashboard;
}

type AuthOrg = {
  readonly id: OrgId;
  readonly slug: string;
  readonly name: string;
};

function parseAuthOrg(raw: unknown, at: string): AuthOrg {
  const row = obj(raw, at);
  const nested = row.organization;
  const source =
    nested && typeof nested === "object" && !Array.isArray(nested)
      ? obj(nested, `${at}.organization`)
      : row;
  return {
    id: asOrgId(str(source, "id", at)),
    slug: str(source, "slug", at),
    name: str(source, "name", at),
  };
}

function parseAuthOrgList(raw: unknown, at: string): AuthOrg[] {
  if (Array.isArray(raw)) {
    return list(raw, at, parseAuthOrg);
  }
  const envelope = obj(raw, at);
  if (Array.isArray(envelope.organizations)) {
    return list(envelope.organizations, `${at}.organizations`, parseAuthOrg);
  }
  if (Array.isArray(envelope.data)) {
    return list(envelope.data, `${at}.data`, parseAuthOrg);
  }
  throw toAdminError({
    kind: "malformed",
    message: `Expected organization list at ${at}`,
    at,
  });
}

function forbidden(message: string): AdminError {
  return { kind: "forbidden", message };
}

async function fetchClientAdminContext(
  slug: string,
  activeOrgId: OrgId | null,
): Promise<ClientDashboard> {
  const normalized = slug.toLowerCase().trim();
  if (normalized === SYSTEM_ORG_SLUG) {
    throw forbidden("The System organization is not a client portal.");
  }

  const orgs = await authRequest({
    method: "GET",
    path: "/organization/list",
    parse: parseAuthOrgList,
  });

  const match = orgs.find((org) => org.slug.toLowerCase() === normalized);
  if (!match) {
    throw forbidden("This account is not a member of this organization.");
  }

  if (activeOrgId !== match.id) {
    await authRequest({
      method: "POST",
      path: "/organization/set-active",
      body: { organizationId: match.id, organizationSlug: match.slug },
      parse: () => undefined,
    });
  }

  return orgRequest({
    method: "GET",
    path: "/admin/dashboard",
    parse: parseClientDashboard,
  });
}

export function useClientAdminAccess(slug: string): ClientAdminAccess {
  assertSameSiteInDev();
  const normalized = slug.toLowerCase().trim();

  const sessionQuery = useQuery({
    queryKey: adminSessionKeys.session(),
    queryFn: fetchActor,
    retry: retryUnlessAuthz,
  });

  const actor = sessionQuery.data ?? null;

  const contextQuery = useQuery({
    queryKey: actor
      ? clientAdminKeys.context(actor.id, normalized)
      : ["client-admin", "context-idle", normalized],
    queryFn: () => fetchClientAdminContext(normalized, actor?.activeOrgId ?? null),
    enabled: Boolean(actor),
    retry: retryUnlessAuthz,
  });

  return useMemo(() => {
    if (sessionQuery.isPending) return { status: "checking" };
    if (sessionQuery.isError) {
      const error = toAdminError(sessionQuery.error);
      if (error.kind === "unauthenticated") return { status: "anonymous" };
      return { status: "unavailable", error };
    }
    if (!actor) return { status: "anonymous" };
    if (contextQuery.isPending) return { status: "checking" };
    if (contextQuery.isError) {
      const error = toAdminError(contextQuery.error);
      if (error.kind === "unauthenticated") return { status: "anonymous" };
      if (error.kind === "forbidden" || error.kind === "notFound") {
        return { status: "denied", actor, reason: error.message };
      }
      return { status: "unavailable", error };
    }
    if (!contextQuery.data) return { status: "checking" };
    return { status: "granted", actor, dashboard: contextQuery.data };
  }, [actor, contextQuery, sessionQuery]);
}

export function useClientSession(): ClientSessionAccess {
  assertSameSiteInDev();

  const sessionQuery = useQuery({
    queryKey: adminSessionKeys.session(),
    queryFn: fetchActor,
    retry: retryUnlessAuthz,
  });

  return useMemo(() => {
    if (sessionQuery.isPending) return { status: "checking" };
    if (sessionQuery.isError) {
      const error = toAdminError(sessionQuery.error);
      if (error.kind === "unauthenticated") return { status: "anonymous" };
      return { status: "unavailable", error };
    }
    const actor = sessionQuery.data ?? null;
    if (!actor) return { status: "anonymous" };
    return { status: "granted", actor };
  }, [sessionQuery]);
}

export function useClientAdminAuthCommands(): {
  readonly signIn: Command<{ email: string; password: string }, void>;
  readonly signUp: Command<{ name: string; email: string; password: string }, void>;
  readonly signOut: Command<void, void>;
} {
  const queryClient = useQueryClient();
  const { signIn, signUp, signOut } = useAuthCommands();

  return {
    signIn,
    signUp,
    signOut: {
      run: async () => {
        await signOut.run();
        await queryClient.removeQueries({ queryKey: CLIENT_ADMIN_ROOT });
      },
      state: signOut.state,
      fieldErrors: signOut.fieldErrors,
      reset: signOut.reset,
    },
  };
}

export { ActorProvider };
export type { Actor };
