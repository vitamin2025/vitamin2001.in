"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageHeader, Field } from "@/components/admin";
import { adminRoutes, useOrgCommands } from "@/lib/admin";

export function CreateOrgView() {
  const router = useRouter();
  const { create } = useOrgCommands();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <AdminPageHeader
        title="Create organization"
        description="Slug must be lowercase letters, numbers, and hyphens."
      />
      <form
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void create
            .run({
              name,
              slug,
              logoUrl: logoUrl || undefined,
            })
            .then((id) => router.push(adminRoutes.org(id)));
        }}
      >
        <Field label="Name" error={create.fieldErrors?.name?.[0]}>
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>
        <Field label="Slug" error={create.fieldErrors?.slug?.[0]}>
          <Input
            value={slug}
            pattern="[a-z0-9-]+"
            onChange={(event) => setSlug(event.target.value)}
            required
          />
        </Field>
        <Field label="Logo URL" error={create.fieldErrors?.logo?.[0]}>
          <Input
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
          />
        </Field>
        {create.fieldErrors?._form?.[0] ? (
          <p className="text-sm text-red-600">{create.fieldErrors._form[0]}</p>
        ) : null}
        <Button type="submit" disabled={create.state.status === "running"}>
          Create organization
        </Button>
      </form>
    </div>
  );
}
