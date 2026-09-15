"use client";

import Link from "next/link";
import {
  AdminPageHeader,
  DangerButton,
  DataTable,
  RelativeTime,
  SearchFilterBar,
} from "@/components/admin";
import {
  asUserId,
  adminRoutes,
  sessionListQuery,
  useListQuery,
  useSessionCommands,
  useSessions,
  type SessionRow,
} from "@/lib/admin";

export function SessionsView() {
  const [query, patch] = useListQuery(sessionListQuery);
  const sessions = useSessions(query);
  const { revoke } = useSessionCommands();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sessions"
        description="Active sessions across the platform. Revoking your own session signs you out."
      />
      <SearchFilterBar
        value={query.userId ?? ""}
        onSearch={(value) =>
          patch({ userId: value ? asUserId(value) : undefined })
        }
      />
      <DataTable<SessionRow>
        result={sessions}
        onPage={(page) => patch({ page })}
        empty="No active sessions."
        columns={[
          {
            header: "User",
            cell: (session) => (
              <Link href={adminRoutes.user(session.user.id)} className="hover:underline">
                {session.user.email}
                {session.isCurrent ? " (you)" : ""}
              </Link>
            ),
          },
          { header: "Client", cell: (session) => session.client },
          { header: "IP", cell: (session) => session.ipAddress ?? "—" },
          {
            header: "Expires",
            cell: (session) => <RelativeTime value={session.expiresAt} />,
          },
          {
            header: "",
            cell: (session) => (
              <DangerButton
                verdict={session.can.revoke}
                label="Revoke"
                confirm={{ title: "Revoke this session?" }}
                onConfirm={(permit) => {
                  void revoke.run({ permit, sessionId: session.id });
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
