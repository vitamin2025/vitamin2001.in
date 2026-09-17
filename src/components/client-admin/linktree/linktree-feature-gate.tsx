"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clientAdminRoutes, orgHasFeature, useClientDashboard } from "@/lib/client-admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export function LinktreeFeatureGate({ children }: { children: React.ReactNode }) {
  const dashboard = useClientDashboard();
  const router = useRouter();
  const slug = dashboard.organization.slug;
  const enabled = orgHasFeature(dashboard.organization.features, "linktree");

  useEffect(() => {
    if (!enabled) {
      router.replace(clientAdminRoutes.dashboard(slug));
    }
  }, [enabled, router, slug]);

  if (!enabled) {
    return <LoadingSpinner text="Redirecting..." />;
  }

  return <>{children}</>;
}
