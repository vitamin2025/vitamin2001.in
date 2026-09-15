"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ActorProvider,
  adminRoutes,
  useAdminAccess,
  useAuthCommands,
} from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ErrorState } from "./error-state";

export function AdminGate({ children }: { children: ReactNode }) {
  const access = useAdminAccess();
  const router = useRouter();
  const { signOut } = useAuthCommands();

  useEffect(() => {
    if (access.status === "anonymous") {
      router.replace(adminRoutes.login());
    }
  }, [access, router]);

  if (access.status === "checking" || access.status === "anonymous") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size={32} text="Checking super-admin access..." />
      </div>
    );
  }

  if (access.status === "unavailable") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center p-6">
        <ErrorState error={access.error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (access.status === "denied") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold text-slate-900">Access denied</h1>
        <p className="text-sm text-slate-600">
          Signed in as {access.actor.email}, but this account is not a System
          organization owner.
        </p>
        <p className="text-sm text-slate-500">{access.reason}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void signOut.run().then(() => {
              router.replace(adminRoutes.login());
            });
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <ActorProvider key={access.actor.id} actor={access.actor}>
      {children}
    </ActorProvider>
  );
}
