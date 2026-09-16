"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AdminPageHeader,
  ErrorState,
  Field,
} from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClientSettings,
  useClientSettingsCommands,
} from "@/lib/client-admin";

export function SettingsView() {
  const settings = useClientSettings();
  const { update } = useClientSettingsCommands();
  const item = settings.item;

  if (settings.status === "failed" && settings.error) {
    return <ErrorState error={settings.error} onRetry={settings.reload} />;
  }

  if (!item) {
    return <Skeleton className="h-64 w-full" />;
  }

  const formError =
    update.fieldErrors?._form?.[0] ??
    (update.state.status === "failed" ? update.state.error.message : null);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Settings"
        description="Update this organization's display name and logo."
      />
      <form
        key={item.id}
        className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void update.run({
            name: String(form.get("name") ?? ""),
            logoUrl: String(form.get("logo") ?? ""),
          });
        }}
      >
        <Field label="Name" error={update.fieldErrors?.name?.[0]}>
          <Input name="name" defaultValue={item.name} required />
        </Field>
        <Field label="Logo URL" error={update.fieldErrors?.logo?.[0]}>
          <Input
            name="logo"
            defaultValue={item.logoUrl ?? ""}
            placeholder="https://example.com/logo.png"
          />
        </Field>
        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        <Button type="submit" disabled={update.state.status === "running"}>
          {update.state.status === "running" ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
