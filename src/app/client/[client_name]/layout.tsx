import React from "react";
import { notFound } from "next/navigation";
import { getClientConfig } from "@/config/clients";
import { ClientProvider } from "@/providers/client-provider";
import type { ClientLayoutProps } from "@/types/client";

export default async function ClientLayout({
  children,
  params,
}: ClientLayoutProps) {
  const { client_name } = await params;
  const client = getClientConfig(client_name);

  if (!client) {
    notFound();
  }

  // Scoping class e.g. "client-runachan" applies file-specific CSS defined in theme.css
  const clientScopingClass = `client-${client_name.toLowerCase()}`;

  return (
    <ClientProvider client={client} clientName={client_name}>
      <div className={`${clientScopingClass} min-h-screen flex flex-col`}>
        {children}
      </div>
    </ClientProvider>
  );
}
