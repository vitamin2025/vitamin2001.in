import Link from "next/link";
import { adminRoutes, useEntityTrail, type EntityRef } from "@/lib/admin";
import { RelativeTime } from "./relative-time";
import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function AuditTrail({ entity }: { entity: EntityRef }) {
  const trail = useEntityTrail(entity);

  if (trail.status === "loading") {
    return <Skeleton className="h-24 w-full" />;
  }
  if (trail.status === "failed" && trail.error) {
    return <ErrorState error={trail.error} onRetry={trail.reload} />;
  }
  if (trail.items.length === 0) {
    return <EmptyState>No audit events for this record.</EmptyState>;
  }

  return (
    <ol className="space-y-3">
      {trail.items.map((entry) => (
        <li key={entry.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={adminRoutes.entityTrail(entry.entity)}
              className="font-medium text-slate-900 hover:underline"
            >
              {entry.action}
            </Link>
            <RelativeTime value={entry.at} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {entry.actor ? entry.actor.email : "Unknown actor"}
          </p>
        </li>
      ))}
    </ol>
  );
}
