import React from "react";
import { notFound } from "next/navigation";
import { getClientConfig } from "@/config/clients";
import { ClientAdminDashboardView } from "@/lib/client-loader";
import { AuthGuard } from "@/components/auth/auth-guard";
import type { ClientPageProps } from "@/types/client";

export default async function AdminDashboardPage({
  params,
}: ClientPageProps) {
  const { client_name } = await params;
  const client = getClientConfig(client_name);

  if (!client) {
    notFound();
  }

  return (
    <AuthGuard clientName={client_name}>
      <ClientAdminDashboardView client={client} />
    </AuthGuard>
  );
}
