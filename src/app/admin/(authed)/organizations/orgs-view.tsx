"use client";

import { Badge } from "@/components/ui/badge";
import { AdminPageHeader, DataTable, SearchFilterBar } from "@/components/admin";
import {
  adminRoutes,
  orgListQuery,
  useListQuery,
  useOrgs,
  type OrgRow,
} from "@/lib/admin";

export function OrgsView() {
  const [query, patch] = useListQuery(orgListQuery);
  const orgs = useOrgs(query);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Organizations"
        description="Client organizations. Deactivated orgs still appear in this list."
        actionHref={adminRoutes.orgNew()}
        actionLabel="Create organization"
      />
      <SearchFilterBar value={query.q} onSearch={(q) => patch({ q })} />
      <DataTable<OrgRow>
        result={orgs}
        rowHref={(org) => adminRoutes.org(org.id)}
        onPage={(page) => patch({ page })}
        empty="No organizations match these filters."
        columns={[
          { header: "Name", cell: (org) => org.name },
          { header: "Slug", cell: (org) => org.slug },
          {
            header: "Status",
            cell: (org) =>
              org.isSystem ? (
                <Badge>System</Badge>
              ) : org.active ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              ),
          },
          { header: "Members", cell: (org) => org.memberCount, align: "right" },
        ]}
      />
    </div>
  );
}
