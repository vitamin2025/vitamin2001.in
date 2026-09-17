"use client";

import Link from "next/link";
import { AdminPageHeader, ErrorState, RelativeTime, StatCard } from "@/components/admin";
import { adminRoutes, useOverview } from "@/lib/admin";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewView() {
  const overview = useOverview();

  if (overview.status === "failed" && overview.error) {
    return <ErrorState error={overview.error} onRetry={overview.reload} />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Overview"
        description="Platform-wide users, organizations, sessions, and recent admin actions."
      />

      {overview.stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Users" value={overview.stats.users.total} />
          <StatCard label="Active users" value={overview.stats.users.active} />
          <StatCard label="Suspended" value={overview.stats.users.suspended} />
          <StatCard label="Client orgs" value={overview.stats.clientOrgs} />
          <StatCard label="Active sessions" value={overview.stats.activeSessions} />
          <StatCard label="Pending invites" value={overview.stats.pendingInvitations} />
          <StatCard label="New users (7d)" value={overview.stats.users.newLast7Days} />
          <StatCard label="New users (30d)" value={overview.stats.users.newLast30Days} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <ul className="space-y-2">
          {overview.activity.map((entry) => (
            <li
              key={entry.id}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={adminRoutes.entityTrail(entry.entity)}
                  className="font-medium hover:underline"
                >
                  {entry.action}
                </Link>
                <RelativeTime value={entry.at} />
              </div>
              <p className="text-xs text-slate-500">
                {entry.actor?.email ?? "Unknown actor"} · {entry.entity.type}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
