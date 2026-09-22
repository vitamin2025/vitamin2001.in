"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  clientAdminRoutes,
  orgHasFeature,
  useClientDashboard,
} from "@/lib/client-admin";

export function CreatorFeatureGate({ children }: { children: ReactNode }) {
  const dashboard = useClientDashboard();
  const router = useRouter();
  const slug = dashboard.organization.slug;
  const enabled = orgHasFeature(dashboard.organization.features, "creator");

  useEffect(() => {
    if (!enabled) {
      router.replace(clientAdminRoutes.dashboard(slug));
    }
  }, [enabled, router, slug]);

  if (!enabled) {
    return <LoadingSpinner text="Redirecting..." />;
  }

  return children;
}
