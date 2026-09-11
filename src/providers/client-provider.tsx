"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { ClientConfig } from "@/types/client";

interface ClientContextValue {
  client: ClientConfig | null;
  clientName: string;
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({
  client,
  clientName,
  children,
}: {
  client: ClientConfig | null;
  clientName: string;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      client,
      clientName,
    }),
    [client, clientName]
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
