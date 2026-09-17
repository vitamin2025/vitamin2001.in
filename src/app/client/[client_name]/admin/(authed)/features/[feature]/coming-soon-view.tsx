"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  clientAdminRoutes,
  humanizeFeatureKey,
  implementedFeatureHref,
  orgHasFeature,
  useClientDashboard,
} from "@/lib/client-admin";

export function ComingSoonView({ feature }: { feature: string }) {
  const dashboard = useClientDashboard();
  const router = useRouter();
  const slug = dashboard.organization.slug;
  const knownHref = implementedFeatureHref(slug, feature);
  const enabled = orgHasFeature(dashboard.organization.features, feature);

  useEffect(() => {
    if (knownHref) {
      router.replace(knownHref);
      return;
    }
    if (!enabled) {
      router.replace(clientAdminRoutes.dashboard(slug));
    }
  }, [enabled, knownHref, router, slug]);

  if (knownHref || !enabled) {
    return <LoadingSpinner text="Redirecting..." />;
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={humanizeFeatureKey(feature)}
        description="This feature is enabled for your organization and will be available here soon."
      />
      <p className="text-sm text-slate-500">
        There is no workspace for <span className="font-medium">{feature}</span>{" "}
        yet.
      </p>
    </div>
  );
}
