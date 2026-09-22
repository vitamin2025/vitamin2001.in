import { Suspense } from "react";
import { getClientConfigOrFallback } from "@/config/clients";
import { FanLoginView } from "@/components/client-admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import type { ClientPageProps } from "@/types/client";

export default async function FanLoginPage({
  params,
  searchParams,
}: ClientPageProps) {
  const { client_name } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const redirectTarget =
    typeof resolvedSearchParams?.redirect === "string"
      ? resolvedSearchParams.redirect
      : undefined;

  const client = getClientConfigOrFallback(client_name);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner text={`Loading ${client.name}...`} />
        </div>
      }
    >
      <FanLoginView
        slug={client_name}
        displayName={client.name}
        tagline={client.tagline}
        redirectTarget={redirectTarget}
      />
    </Suspense>
  );
}
