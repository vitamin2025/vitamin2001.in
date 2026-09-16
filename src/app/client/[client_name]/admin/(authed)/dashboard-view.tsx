"use client";

import { AdminPageHeader, RelativeTime, StatCard } from "@/components/admin";
import { useClientDashboard } from "@/lib/client-admin";

export function DashboardView() {
  const dashboard = useClientDashboard();
  const roleEntries = Object.entries(dashboard.stats.roles);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={dashboard.organization.name}
        description="Organization members, invitations, and recent activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={dashboard.stats.totalMembers} />
        <StatCard
          label="Pending invitations"
          value={dashboard.stats.pendingInvitations}
        />
        {roleEntries.map(([role, count]) => (
          <StatCard key={role} label={`${role}s`} value={count} />
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        {dashboard.recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity.</p>
        ) : (
          <ul className="space-y-2">
            {dashboard.recentActivity.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{entry.action}</p>
                  <RelativeTime value={entry.createdAt} />
                </div>
                <p className="text-xs text-slate-500">
                  {entry.actorName ?? "Unknown actor"} · {entry.entityType}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
