import { Suspense } from "react";
import { getClientConfigOrFallback } from "@/config/clients";
import { AccountAuthView } from "@/components/client-admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import type { ClientPageProps } from "@/types/client";

export default async function LoginPage({
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
      <AccountAuthView slug={client_name} displayName={client.name} redirectTarget={redirectTarget} />
    </Suspense>
  );
}
