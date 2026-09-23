"use client";

import React, { use } from "react";
import { useClient } from "@/providers/client-provider";
import { getClientConfigOrFallback } from "@/config/clients";
import { ClientLandingView } from "@/lib/client-loader";
import { ClientHeader } from "@/components/layout/client-header";
import { CreatorLandingView } from "@/components/creator/creator-landing-view";
import { usePublicCreatorProfile } from "@/lib/client-admin/creator";
import { Loader2 } from "lucide-react";

export default function ClientHomePage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name } = use(params);
  const { client, hasCreatorFeature: providerHasCreator } = useClient();
  const fallbackClient = client ?? getClientConfigOrFallback(client_name);

  const { data: profile, isSuccess, isLoading } = usePublicCreatorProfile(client_name);
  const staticHasCreator = fallbackClient.features?.includes("creator") ?? false;
  const hasCreatorFeature =
    providerHasCreator || staticHasCreator || (isSuccess && Boolean(profile));

  if (isLoading && !staticHasCreator && !providerHasCreator) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <ClientHeader />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-400 font-medium">Loading organization...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ClientHeader />
      <main className="flex-1">
        {hasCreatorFeature ? (
          <CreatorLandingView slug={client_name} />
        ) : (
          <ClientLandingView client={fallbackClient} />
        )}
      </main>
    </div>
  );
}
