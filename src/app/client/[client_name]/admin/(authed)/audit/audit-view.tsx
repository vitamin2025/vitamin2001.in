"use client";

import { Suspense } from "react";
import {
  AdminPageHeader,
  AuditDetails,
  DataTable,
  RelativeTime,
  SearchFilterBar,
} from "@/components/admin";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useListQuery } from "@/lib/admin";
import {
  clientAuditQuery,
  useClientAuditLog,
} from "@/lib/client-admin";
import type { AuditEntry } from "@/lib/admin/audit";

function AuditViewInner() {
  const [query, patch] = useListQuery(clientAuditQuery);
  const audit = useClientAuditLog(query);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit log"
        description="Actions taken in this organization."
      />
      <SearchFilterBar
        value={query.action ?? ""}
        onSearch={(action) => patch({ action: action || undefined })}
      />
      <DataTable<AuditEntry>
        result={audit}
        onPage={(page) => patch({ page })}
        empty="No audit events match these filters."
        columns={[
          { header: "Action", cell: (entry) => entry.action },
          {
            header: "Entity",
            cell: (entry) => `${entry.entity.type}:${entry.entity.id.slice(0, 8)}`,
          },
          {
            header: "Actor",
            cell: (entry) => entry.actor?.email ?? entry.actor?.name ?? "—",
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

export function AuditView() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading audit log..." />}>
      <AuditViewInner />
    </Suspense>
  );
}
