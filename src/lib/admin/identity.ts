"use client";

import { createContext, createElement, useContext, useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCommand, type Command } from "./command";
import { toAdminError, type AdminError } from "./errors";
import { adminRequest, assertSameSiteInDev, authRequest } from "./http";
import { asOrgId, asSessionId, asUserId, type OrgId, type UserId } from "./ids";
import { keys } from "./keys";
import { obj, optStr, str, date } from "./read";
import { retryUnlessAuthz } from "./errors";
import type { Actor } from "./policy";
import { parsePlatformStats, type PlatformStats } from "./stats";

export type AdminAccess =
  | { readonly status: "checking" }
  | { readonly status: "anonymous" }
  | {
      readonly status: "denied";
      readonly actor: Actor;
      readonly reason: string;
    }
  | { readonly status: "granted"; readonly actor: Actor }
  | { readonly status: "unavailable"; readonly error: AdminError };

const ActorContext = createContext<Actor | null>(null);

export function ActorProvider({
  actor,
  children,
}: {
  actor: Actor;
  children: ReactNode;
}) {
  return createElement(ActorContext.Provider, { value: actor }, children);
}

export function useActor(): Actor {
  const actor = useContext(ActorContext);
  if (!actor) {
    throw new Error("useActor must run inside AdminGate");
  }
  return actor;
}

function parseActor(raw: unknown, at: string): Actor | null {
  if (raw == null) return null;
  const envelope = obj(raw, at);
  if (envelope.user == null || envelope.session == null) return null;
  const user = obj(envelope.user, `${at}.user`);
  const session = obj(envelope.session, `${at}.session`);
  return {
    id: asUserId(str(user, "id", `${at}.user`)),
    name: str(user, "name", `${at}.user`),
    email: str(user, "email", `${at}.user`),
    imageUrl: optStr(user, "image", `${at}.user`),
    sessionId: asSessionId(str(session, "id", `${at}.session`)),
    sessionExpiresAt: date(session, "expiresAt", `${at}.session`),
    activeOrgId: optStr(session, "activeOrganizationId", `${at}.session`)
      ? asOrgId(optStr(session, "activeOrganizationId", `${at}.session`) as string)
      : null,
  };
}

async function fetchActor(): Promise<Actor | null> {
  try {
    return await authRequest({
      method: "GET",
      path: "/get-session",
      parse: parseActor,
    });
  } catch (error) {
    const adminError = toAdminError(error);
    if (adminError.kind === "unauthenticated") return null;
    throw adminError;
  }
}

async function fetchStatsProbe(): Promise<PlatformStats> {
  return adminRequest({
    method: "GET",
    path: "/dashboard/stats",
    parse: parsePlatformStats,
  });
}

export function useAdminAccess(): AdminAccess {
  assertSameSiteInDev();

  const sessionQuery = useQuery({
    queryKey: keys.session(),
    queryFn: fetchActor,
    retry: retryUnlessAuthz,
  });

  const actor = sessionQuery.data ?? null;

  const probeQuery = useQuery({
    queryKey: actor ? keys.overview.stats(actor.id) : ["platform-admin", "probe-idle"],
    queryFn: fetchStatsProbe,
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
    if (probeQuery.isPending) return { status: "checking" };
    if (probeQuery.isError) {
      const error = toAdminError(probeQuery.error);
      if (error.kind === "unauthenticated") return { status: "anonymous" };
      if (error.kind === "forbidden") {
        return { status: "denied", actor, reason: error.message };
      }
      return { status: "unavailable", error };
    }
    return { status: "granted", actor };
  }, [actor, probeQuery.isError, probeQuery.isPending, probeQuery.error, sessionQuery]);
}

export function useAuthCommands(): {
  readonly signIn: Command<{ email: string; password: string }, void>;
  readonly signOut: Command<void, void>;
} {
  const queryClient = useQueryClient();
  const signIn = useCommand<{ email: string; password: string }, void>({
    actorId: null,
    fields: ["email", "password"],
    send: async (input) => {
      await authRequest({
        method: "POST",
        path: "/sign-in/email",
        body: { email: input.email, password: input.password },
        parse: () => undefined,
      });
      await queryClient.invalidateQueries({ queryKey: keys.session() });
    },
    effect: () => ({ on: "session.changed" }),
  });

  const signOut = useCommand<void, void>({
    actorId: null,
    send: async () => {
      try {
        await authRequest({
          method: "POST",
          path: "/sign-out",
          parse: () => undefined,
        });
      } catch {
        // cookie may already be gone
      }
    },
    effect: () => ({ on: "signedOut" }),
  });

  return { signIn, signOut };
}

export type { Actor, OrgId, UserId };
