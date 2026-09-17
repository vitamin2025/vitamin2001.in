"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorState } from "@/components/admin/error-state";
import {
  ClientAdminProvider,
  clientAdminRoutes,
  useClientAdminAccess,
  useClientAdminAuthCommands,
} from "@/lib/client-admin";

export function ClientAdminGate({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const access = useClientAdminAccess(slug);
  const router = useRouter();
  const { signOut } = useClientAdminAuthCommands();

  useEffect(() => {
    if (access.status === "anonymous") {
      router.replace(clientAdminRoutes.login(slug));
    }
  }, [access, router, slug]);

  if (access.status === "checking" || access.status === "anonymous") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size={32} text="Checking organization admin access..." />
      </div>
    );
  }

  if (access.status === "unavailable") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center p-6">
        <ErrorState
          error={access.error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (access.status === "denied") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold text-slate-900">Access denied</h1>
        <p className="text-sm text-slate-600">
          Signed in as {access.actor.email}, but this account is not an owner of
          this organization.
        </p>
        <p className="text-sm text-slate-500">{access.reason}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void signOut.run().then(() => {
              router.replace(clientAdminRoutes.login(slug));
            });
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <ClientAdminProvider
      key={`${access.actor.id}:${access.dashboard.organization.id}`}
      actor={access.actor}
      dashboard={access.dashboard}
    >
      {children}
    </ClientAdminProvider>
  );
}
