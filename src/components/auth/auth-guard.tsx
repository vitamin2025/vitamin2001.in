"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "@/lib/auth";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  clientName: string;
}

export function AuthGuard({ children, clientName }: AuthGuardProps) {
  const router = useRouter();
  const authenticated = useIsAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.push(`/client/${clientName}/admin/login`);
    }
  }, [authenticated, clientName, router]);

  if (!authenticated) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <LoadingSpinner size={32} text="Checking administrative authorization..." />
      </div>
    );
  }

  return <>{children}</>;
}
