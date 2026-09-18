"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AdminPageHeader,
  ErrorState,
  Field,
} from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaUploadField } from "@/components/storage/media-upload-field";
import {
  useClientSettings,
  useClientSettingsCommands,
} from "@/lib/client-admin";

function ClientSettingsForm({
  item,
}: {
  item: NonNullable<ReturnType<typeof useClientSettings>["item"]>;
}) {
  const { update } = useClientSettingsCommands();
  const [logoUrl, setLogoUrl] = useState(item.logoUrl ?? "");

  const formError =
    update.fieldErrors?._form?.[0] ??
    (update.state.status === "failed" ? update.state.error.message : null);

  return (
    <form
      className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void update.run({
          name: String(form.get("name") ?? ""),
          logoUrl: logoUrl || "",
        });
      }}
    >
      <Field label="Name" error={update.fieldErrors?.name?.[0]}>
        <Input name="name" defaultValue={item.name} required />
      </Field>
      <MediaUploadField
        label="Organization Logo"
        value={logoUrl}
        onChange={setLogoUrl}
        category="avatars"
        clientId={item.slug}
        error={update.fieldErrors?.logo?.[0]}
      />
      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
      <Button type="submit" disabled={update.state.status === "running"}>
        {update.state.status === "running" ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}

export function SettingsView() {
  const settings = useClientSettings();
  const item = settings.item;

  if (settings.status === "failed" && settings.error) {
    return <ErrorState error={settings.error} onRetry={settings.reload} />;
  }

  if (!item) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Settings"
        description="Update this organization's display name and logo."
      />
      <ClientSettingsForm key={item.id} item={item} />
    </div>
  );
}
