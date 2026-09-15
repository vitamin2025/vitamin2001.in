"use client";

import { AdminPageHeader, AuditTrail } from "@/components/admin";

export function EntityTrailView({
  entityType,
  entityId,
}: {
  entityType: string;
  entityId: string;
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Entity history"
        description={`${entityType} · ${entityId}`}
      />
      <AuditTrail entity={{ type: entityType, id: entityId }} />
    </div>
  );
}
