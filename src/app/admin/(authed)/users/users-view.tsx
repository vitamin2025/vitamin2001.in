"use client";

import { Badge } from "@/components/ui/badge";
import {
  AdminPageHeader,
  DangerButton,
  DataTable,
  SearchFilterBar,
} from "@/components/admin";
import {
  adminRoutes,
  useListQuery,
  useUserCommands,
  useUsers,
  userListQuery,
  type UserRow,
} from "@/lib/admin";

export function UsersView() {
  const [query, patch] = useListQuery(userListQuery);
  const users = useUsers(query);
  const { setSuspended } = useUserCommands();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Search, suspend, and inspect platform accounts."
        actionHref={adminRoutes.userNew()}
        actionLabel="Create user"
      />
      <SearchFilterBar
        value={query.q}
        onSearch={(q) => patch({ q })}
        filters={[
          {
            key: "banned",
            label: "Status",
            value: query.banned === undefined ? "" : String(query.banned),
            options: [
              ["", "All"],
              ["false", "Active"],
              ["true", "Suspended"],
            ],
            onChange: (value) =>
              patch({
                banned: value === "" ? undefined : value === "true",
              }),
          },
        ]}
      />
      <DataTable<UserRow>
        result={users}
        rowHref={(user) => adminRoutes.user(user.id)}
        onPage={(page) => patch({ page })}
        empty="No users match these filters."
        columns={[
          { header: "Name", cell: (user) => user.name },
          { header: "Email", cell: (user) => user.email },
          {
            header: "Status",
            cell: (user) =>
              user.suspension.state === "suspended" ? (
                <Badge variant="destructive">Suspended</Badge>
              ) : (
                <Badge variant="success">Active</Badge>
              ),
          },
          {
            header: "Orgs",
            cell: (user) => user.membershipCount,
            align: "right",
          },
          {
            header: "Sessions",
            cell: (user) => user.activeSessionCount,
            align: "right",
          },
          {
            header: "",
            cell: (user) =>
              user.suspension.state === "active" ? (
                <DangerButton
                  verdict={user.can.suspend}
                  label="Suspend"
                  confirm={{
                    title: `Suspend ${user.email}?`,
                    body: "Revokes every active session immediately.",
                    reasonField: "Reason (optional)",
                  }}
                  onConfirm={(permit, extra) => {
                    void setSuspended.run({
                      permit,
                      userId: user.id,
                      suspended: true,
                      reason: extra.reason,
                    });
                  }}
                />
              ) : (
                <DangerButton
                  verdict={user.can.unsuspend}
                  label="Restore"
                  variant="outline"
                  confirm={{ title: `Restore ${user.email}?` }}
                  onConfirm={(permit) => {
                    void setSuspended.run({
                      permit,
                      userId: user.id,
                      suspended: false,
                    });
                  }}
                />
              ),
          },
        ]}
      />
    </div>
  );
}
