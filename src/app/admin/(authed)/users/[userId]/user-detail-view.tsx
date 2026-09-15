"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  AdminPageHeader,
  AuditTrail,
  DangerButton,
  ErrorState,
  Field,
  RelativeTime,
} from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import {
  asOrgId,
  asUserId,
  useMembershipCommands,
  useOrgs,
  useSessionCommands,
  useUser,
  useUserCommands,
  useUserMemberships,
  useUserSessions,
  userCapabilities,
  useActor,
  type OrgRole,
} from "@/lib/admin";

export function UserDetailView({ userId }: { userId: string }) {
  const id = asUserId(userId);
  const actor = useActor();
  const user = useUser(id);
  const memberships = useUserMemberships(id);
  const sessions = useUserSessions(id);
  const { updateProfile, setSuspended, resetPassword } = useUserCommands();
  const { add, setRole, remove } = useMembershipCommands(id);
  const { revoke, revokeAllForUser } = useSessionCommands();
  const orgs = useOrgs({ page: 1, limit: 100, q: "" });

  const [orgId, setOrgId] = useState("");
  const [role, setMemberRole] = useState<OrgRole>("member");

  if (user.status === "failed" && user.error) {
    return <ErrorState error={user.error} onRetry={user.reload} />;
  }
  if (!user.item) {
    return <Skeleton className="h-64 w-full" />;
  }

  const u = user.item;

  const revokeAll = userCapabilities(actor, {
    id: u.id,
    suspension: u.suspension,
    activeSessionCount: sessions.items.length,
  }).revokeSessions;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={u.name}
        description={u.email}
      />

      <div className="flex flex-wrap items-center gap-2">
        {u.suspension.state === "suspended" ? (
          <Badge variant="destructive">Suspended</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
        {u.emailVerified ? (
          <Badge variant="secondary">Email verified</Badge>
        ) : (
          <Badge variant="outline">Email unverified</Badge>
        )}
      </div>

      <form
        key={u.id}
        className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!u.can.editProfile.allowed) return;
          const form = new FormData(event.currentTarget);
          void updateProfile.run({
            permit: u.can.editProfile.permit,
            userId: u.id,
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
          });
        }}
      >
        <Field label="Name" error={updateProfile.fieldErrors?.name?.[0]}>
          <Input name="name" defaultValue={u.name} />
        </Field>
        <Field label="Email" error={updateProfile.fieldErrors?.email?.[0]}>
          <Input type="email" name="email" defaultValue={u.email} />
        </Field>
        <Button type="submit" disabled={!u.can.editProfile.allowed}>
          Save profile
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {u.suspension.state === "active" ? (
          <DangerButton
            verdict={u.can.suspend}
            label="Suspend"
            confirm={{
              title: `Suspend ${u.email}?`,
              body: "Revokes every active session immediately.",
              reasonField: "Reason (optional)",
            }}
            onConfirm={(permit, extra) => {
              void setSuspended.run({
                permit,
                userId: u.id,
                suspended: true,
                reason: extra.reason,
              });
            }}
          />
        ) : (
          <DangerButton
            verdict={u.can.unsuspend}
            label="Restore"
            variant="outline"
            confirm={{ title: `Restore ${u.email}?` }}
            onConfirm={(permit) => {
              void setSuspended.run({
                permit,
                userId: u.id,
                suspended: false,
              });
            }}
          />
        )}
        <DangerButton
          verdict={u.can.resetPassword}
          label="Reset password"
          confirm={{
            title: `Reset password for ${u.email}?`,
            body: "Signs the user out of every device.",
            passwordField: "New password (min 8 characters)",
          }}
          onConfirm={(permit, extra) => {
            if (!extra.password || extra.password.length < 8) return;
            void resetPassword.run({
              permit,
              userId: u.id,
              newPassword: extra.password,
            });
          }}
        />
        <DangerButton
          verdict={revokeAll}
          label={`Revoke all sessions (${sessions.items.length})`}
          confirm={{ title: "Revoke every session for this user?" }}
          onConfirm={(permit) => {
            void revokeAllForUser.run({ permit, userId: u.id });
          }}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Memberships</h2>
        <div className="space-y-2">
          {memberships.items.map((membership) => (
            <div
              key={membership.memberId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <div>
                <p className="font-medium">{membership.org.name}</p>
                <p className="text-xs text-slate-500">{membership.org.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={membership.role}
                  disabled={!membership.can.changeRole.allowed}
                  onChange={(event) => {
                    if (!membership.can.changeRole.allowed) return;
                    void setRole.run({
                      permit: membership.can.changeRole.permit,
                      memberId: membership.memberId,
                      role: event.target.value as OrgRole,
                    });
                  }}
                >
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                  <option value="owner">owner</option>
                </Select>
                <DangerButton
                  verdict={membership.can.remove}
                  label="Remove"
                  confirm={{ title: `Remove from ${membership.org.name}?` }}
                  onConfirm={(permit) => {
                    void remove.run({ permit, memberId: membership.memberId });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {u.can.editMemberships.allowed ? (
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const verdict = u.can.editMemberships;
              if (!orgId || !verdict.allowed) return;
              void add.run({
                permit: verdict.permit,
                orgId: asOrgId(orgId),
                role,
              });
              setOrgId("");
            }}
          >
            <Select value={orgId} onChange={(event) => setOrgId(event.target.value)}>
              <option value="">Add to organization</option>
              {orgs.items.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
            <Select
              value={role}
              onChange={(event) => setMemberRole(event.target.value as OrgRole)}
            >
              <option value="member">member</option>
              <option value="admin">admin</option>
              <option value="owner">owner</option>
            </Select>
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sessions</h2>
        {sessions.items.length === 0 ? (
          <p className="text-sm text-slate-500">No active sessions.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.items.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm"
              >
                <div>
                  <p>
                    {session.client}
                    {session.isCurrent ? " · this device" : ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.ipAddress ?? "Unknown IP"} · expires{" "}
                    <RelativeTime value={session.expiresAt} />
                  </p>
                </div>
                <DangerButton
                  verdict={session.can.revoke}
                  label="Revoke"
                  confirm={{ title: "Revoke this session?" }}
                  onConfirm={(permit) => {
                    void revoke.run({ permit, sessionId: session.id });
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Accounts</h2>
        <ul className="text-sm text-slate-600">
          {u.credentials.map((account) => (
            <li key={account.id}>{account.provider}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Audit</h2>
        <AuditTrail entity={{ type: "user", id: u.id }} />
      </section>
    </div>
  );
}
