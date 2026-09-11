import React from "react";
import type { ClientConfig } from "@/types/client";
import { DefaultLandingHero } from "@/components/defaults/landing-hero";
import { DefaultAdminDashboardContent } from "@/components/defaults/admin-dashboard-content";
import { RunachanLandingHero } from "@/components/clients/runachan/landing-hero";
import { RunachanAdminDashboardContent } from "@/components/clients/runachan/admin-dashboard-content";

/**
 * Static component renderer for client landing hero.
 * Routes to client-specific hero or falls back to default.
 */
export function ClientLandingView({ client }: { client: ClientConfig }) {
  if (client.subdomain.toLowerCase() === "runachan") {
    return <RunachanLandingHero client={client} />;
  }
  return <DefaultLandingHero client={client} />;
}

/**
 * Static component renderer for client admin dashboard.
 * Routes to client-specific dashboard or falls back to default.
 */
export function ClientAdminDashboardView({ client }: { client: ClientConfig }) {
  if (client.subdomain.toLowerCase() === "runachan") {
    return <RunachanAdminDashboardContent client={client} />;
  }
  return <DefaultAdminDashboardContent client={client} />;
}
