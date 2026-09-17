"use client";

import Link from "next/link";
import {
  AdminPageHeader,
  AuditDetails,
  DataTable,
  RelativeTime,
  SearchFilterBar,
} from "@/components/admin";
import {
  AUDIT_ACTIONS,
  adminRoutes,
  auditQuery,
  useAuditLog,
  useListQuery,
  type AuditEntry,
} from "@/lib/admin";

export function AuditView() {
  const [query, patch] = useListQuery(auditQuery);
  const audit = useAuditLog(query);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit log"
        description="Every super-admin mutation is recorded here."
      />
      <SearchFilterBar
        value={query.action ?? ""}
        onSearch={(action) => patch({ action: action || undefined })}
        filters={[
          {
            key: "entityType",
            label: "Entity",
            value: query.entityType ?? "",
            options: [
              ["", "All types"],
              ["user", "user"],
              ["organization", "organization"],
              ["member", "member"],
              ["session", "session"],
            ],
            onChange: (entityType) =>
              patch({ entityType: entityType || undefined }),
          },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        {AUDIT_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
            onClick={() => patch({ action })}
          >
            {action}
          </button>
        ))}
      </div>
      <DataTable<AuditEntry>
        result={audit}
        onPage={(page) => patch({ page })}
        empty="No audit events match these filters."
        columns={[
          { header: "Action", cell: (entry) => entry.action },
          {
            header: "Entity",
            cell: (entry) => (
              <Link
                href={adminRoutes.entityTrail(entry.entity)}
                className="hover:underline"
              >
                {entry.entity.type}:{entry.entity.id.slice(0, 8)}
              </Link>
            ),
          },
          {
            header: "Actor",
            cell: (entry) => entry.actor?.email ?? "—",
          },
          {
            header: "When",
            cell: (entry) => <RelativeTime value={entry.at} />,
          },
          {
            header: "Details",
            cell: (entry) => <AuditDetails details={entry.details} />,
          },
        ]}
      />
    </div>
  );
}
