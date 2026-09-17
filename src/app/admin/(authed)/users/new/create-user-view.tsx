"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AdminPageHeader, Field } from "@/components/admin";
import {
  adminRoutes,
  asOrgId,
  useOrgs,
  useUserCommands,
  type OrgRole,
} from "@/lib/admin";

function OrgPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const orgs = useOrgs({ page: 1, limit: 100, q: "" });
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">No organization</option>
      {orgs.items.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name} ({org.slug})
        </option>
      ))}
    </Select>
  );
}

export function CreateUserView() {
  const router = useRouter();
  const { create } = useUserCommands();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgId, setOrgId] = useState("");
  const [role, setRole] = useState<OrgRole>("member");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <AdminPageHeader
        title="Create user"
        description="Creates a credential account. Optional organization assignment is applied immediately."
      />
      <form
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void create
            .run({
              name,
              email,
              password,
              assignment: orgId
                ? { orgId: asOrgId(orgId), role }
                : undefined,
            })
            .then((id) => router.push(adminRoutes.user(id)));
        }}
      >
        <Field label="Name" error={create.fieldErrors?.name?.[0]}>
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>
        <Field label="Email" error={create.fieldErrors?.email?.[0]}>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
        <Field label="Password" error={create.fieldErrors?.password?.[0]}>
          <Input
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>
        <Field label="Organization">
          <OrgPicker value={orgId} onChange={setOrgId} />
        </Field>
        {orgId ? (
          <Field label="Role">
            <Select
              value={role}
              onChange={(event) => setRole(event.target.value as OrgRole)}
            >
              <option value="member">member</option>
              <option value="admin">admin</option>
              <option value="owner">owner</option>
            </Select>
          </Field>
        ) : null}
        {create.fieldErrors?._form?.[0] ? (
          <p className="text-sm text-red-600">{create.fieldErrors._form[0]}</p>
        ) : null}
        <Button type="submit" disabled={create.state.status === "running"}>
          Create user
        </Button>
      </form>
    </div>
  );
}
