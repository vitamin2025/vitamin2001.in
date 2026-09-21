"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminPageHeader,
  DangerButton,
  EmptyState,
  ErrorState,
  Field,
  RelativeTime,
} from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrgRole } from "@/lib/admin";
import {
  useClientDashboard,
  useClientMemberCommands,
  useClientMembers,
  type ClientMember,
} from "@/lib/client-admin";

export function MembersView() {
  const members = useClientMembers();
  const { invite, updateRole, remove } = useClientMemberCommands();
  const actorRole = useClientDashboard().actorRole;
  const canAssignOwner = actorRole === "owner";
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");

  const inviteError =
    invite.fieldErrors?.email?.[0] ??
    invite.fieldErrors?._form?.[0] ??
    (invite.state.status === "failed" ? invite.state.error.message : null);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Members"
        description="Invite people, change roles, and remove members of this organization."
      />

      <form
        className="grid max-w-3xl gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-[1fr_8rem_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          void invite.run({ email, role }).then(
            () => {
              setEmail("");
              setRole("member");
            },
            () => undefined,
          );
        }}
      >
        <Field label="Email" error={invite.fieldErrors?.email?.[0]}>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="colleague@example.com"
            required
          />
        </Field>
        <Field label="Role">
          <Select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "admin" | "member")
            }
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
        <div className="flex items-end">
          <Button type="submit" disabled={invite.state.status === "running"}>
            {invite.state.status === "running" ? "Inviting..." : "Invite"}
          </Button>
        </div>
        {inviteError && !invite.fieldErrors?.email?.[0] ? (
          <p className="text-sm text-red-600 sm:col-span-3">{inviteError}</p>
        ) : null}
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">People</h2>
        {members.status === "loading" ? (
          <Skeleton className="h-40 w-full" />
        ) : members.status === "failed" && members.error ? (
          <ErrorState error={members.error} onRetry={members.reload} />
        ) : members.items.length === 0 ? (
          <EmptyState>No members yet.</EmptyState>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.items.map((member) => (
                  <MemberRow
                    key={member.memberId}
                    member={member}
                    canAssignOwner={canAssignOwner}
                    onRoleChange={(nextRole) => {
                      if (nextRole === member.role) return;
                      void updateRole.run({
                        memberId: member.memberId,
                        role: nextRole,
                      });
                    }}
                    onRemove={() => {
                      void remove.run({ memberId: member.memberId });
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {updateRole.state.status === "failed" ? (
          <p className="text-sm text-red-600">{updateRole.state.error.message}</p>
        ) : null}
        {remove.state.status === "failed" ? (
          <p className="text-sm text-red-600">{remove.state.error.message}</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pending invitations</h2>
        {members.invitations.length === 0 ? (
          <p className="text-sm text-slate-500">No pending invitations.</p>
        ) : (
          <ul className="space-y-2">
            {members.invitations.map((invitation) => (
              <li
                key={invitation.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{invitation.email}</p>
                  <p className="text-xs text-slate-500">
                    {invitation.inviterName
                      ? `Invited by ${invitation.inviterName}`
                      : "Invitation pending"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{invitation.role}</Badge>
                  <span className="text-xs text-slate-500">
                    Expires <RelativeTime value={invitation.expiresAt} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MemberRow({
  member,
  canAssignOwner,
  onRoleChange,
  onRemove,
}: {
  member: ClientMember;
  canAssignOwner: boolean;
  onRoleChange: (role: OrgRole) => void;
  onRemove: () => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{member.name}</TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>
        <Select
          value={member.role}
          disabled={!member.can.changeRole.allowed}
          title={
            member.can.changeRole.allowed
              ? undefined
              : member.can.changeRole.reason
          }
          onChange={(event) =>
            onRoleChange(event.target.value as OrgRole)
          }
        >
          {canAssignOwner || member.role === "owner" ? (
            <option value="owner">Owner</option>
          ) : null}
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </Select>
      </TableCell>
      <TableCell>
        <RelativeTime value={member.joinedAt} />
      </TableCell>
      <TableCell className="text-right">
        <DangerButton
          verdict={member.can.remove}
          label="Remove"
          confirm={{
            title: `Remove ${member.email}?`,
            body: "They will lose access to this organization.",
          }}
          onConfirm={() => {
            onRemove();
          }}
        />
      </TableCell>
    </TableRow>
  );
}
