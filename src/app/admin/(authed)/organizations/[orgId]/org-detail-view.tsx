"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  adminRoutes,
  asOrgId,
  useOrg,
  useOrgCommands,
  useOrgMembers,
} from "@/lib/admin";

export function OrgDetailView({ orgId }: { orgId: string }) {
  const id = asOrgId(orgId);
  const org = useOrg(id);
  const members = useOrgMembers(id, org.item?.slug ?? "");
  const { update, setActive } = useOrgCommands();

  if (org.status === "failed" && org.error) {
    return <ErrorState error={org.error} onRetry={org.reload} />;
  }
  if (!org.item) {
    return <Skeleton className="h-64 w-full" />;
  }

  const o = org.item;

  return (
    <div className="space-y-8">
      <AdminPageHeader title={o.name} description={o.slug} />
      <div className="flex gap-2">
        {o.isSystem ? <Badge>System</Badge> : null}
        {o.active ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </div>

      <form
        key={o.id}
        className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!o.can.rename.allowed) return;
          const form = new FormData(event.currentTarget);
          void update.run({
            permit: o.can.rename.permit,
            orgId: o.id,
            name: String(form.get("name") ?? ""),
            slug: o.can.changeSlug.allowed
              ? String(form.get("slug") ?? "")
              : undefined,
            logoUrl: String(form.get("logo") ?? "") || undefined,
          });
        }}
      >
        <Field label="Name">
          <Input name="name" defaultValue={o.name} />
        </Field>
        <Field label="Slug">
          <Input
            name="slug"
            defaultValue={o.slug}
            disabled={!o.can.changeSlug.allowed}
            title={!o.can.changeSlug.allowed ? o.can.changeSlug.reason : undefined}
          />
        </Field>
        <Field label="Logo URL">
          <Input name="logo" defaultValue={o.logoUrl ?? ""} />
        </Field>
        <Button type="submit">Save</Button>
      </form>

      {o.active ? (
        <DangerButton
          verdict={o.can.deactivate}
          label="Deactivate"
          confirm={{
            title: `Deactivate ${o.name}?`,
            body: "This is a soft delete. The organization remains in the list.",
            typeToConfirm: o.slug,
          }}
          onConfirm={(permit) => {
            void setActive.run({
              permit,
              orgId: o.id,
              active: false,
              extraMetadata: { ...o.extraMetadata },
            });
          }}
        />
      ) : (
        <DangerButton
          verdict={o.can.reactivate}
          label="Reactivate"
          variant="outline"
          confirm={{ title: `Reactivate ${o.name}?` }}
          onConfirm={(permit) => {
            void setActive.run({
              permit,
              orgId: o.id,
              active: true,
              extraMetadata: { ...o.extraMetadata },
            });
          }}
        />
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Members</h2>
        <ul className="space-y-2">
          {members.items.map((member) => (
            <li
              key={member.memberId}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm"
            >
              <Link href={adminRoutes.user(member.user.id)} className="hover:underline">
                {member.user.name} ({member.user.email})
              </Link>
              <span className="text-slate-500">{member.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Invitations</h2>
        {o.invitations.length === 0 ? (
          <p className="text-sm text-slate-500">No invitations.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {o.invitations.map((invite) => (
              <li key={invite.id} className="rounded-lg border border-slate-200 bg-white p-3">
                {invite.email} · {invite.role} · {invite.status}
                {invite.expired ? " · expired" : ""}
                <span className="ml-2 text-xs text-slate-500">
                  <RelativeTime value={invite.expiresAt} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Audit</h2>
        <AuditTrail entity={{ type: "organization", id: o.id }} />
      </section>
    </div>
  );
}
