"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { ClientConfig } from "@/types/client";
import { usePublicCreatorProfile } from "@/lib/client-admin/creator";

interface ClientContextValue {
  client: ClientConfig | null;
  clientName: string;
  hasCreatorFeature: boolean;
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({
  client: initialClient,
  clientName,
  children,
}: {
  client: ClientConfig | null;
  clientName: string;
  children: React.ReactNode;
}) {
  const { data: profile, isSuccess } = usePublicCreatorProfile(clientName);
  const hasDynamicCreator = isSuccess && Boolean(profile);

  const client = useMemo(() => {
    if (!initialClient) return null;
    const features = [...initialClient.features];
    if (hasDynamicCreator && !features.includes("creator")) {
      features.push("creator");
    }
    return {
      ...initialClient,
      name: profile?.name || initialClient.name,
      features,
    };
  }, [initialClient, hasDynamicCreator, profile]);

  const hasCreatorFeature =
    (client?.features?.includes("creator") ?? false) || hasDynamicCreator;

  const value = useMemo(
    () => ({
      client,
      clientName,
      hasCreatorFeature,
    }),
    [client, clientName, hasCreatorFeature]
  );

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}

export function useClient(): ClientContextValue {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}

export function useOptionalClient(): ClientContextValue | null {
  return useContext(ClientContext);
}
