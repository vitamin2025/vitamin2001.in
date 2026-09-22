import React from "react";
import { notFound } from "next/navigation";
import { getClientConfig } from "@/config/clients";
import { ClientLandingView } from "@/lib/client-loader";
import { ClientHeader } from "@/components/layout/client-header";
import { CreatorLandingView } from "@/components/creator/creator-landing-view";
import type { ClientPageProps } from "@/types/client";

export default async function ClientHomePage({ params }: ClientPageProps) {
  const { client_name } = await params;
  const client = getClientConfig(client_name);

  if (!client) {
    notFound();
  }

  const hasCreatorFeature = client.features?.includes("creator") ?? false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ClientHeader />
      <main className="flex-1">
        {hasCreatorFeature ? (
          <CreatorLandingView slug={client_name} />
        ) : (
          <ClientLandingView client={client} />
        )}
      </main>
    </div>
  );
}
