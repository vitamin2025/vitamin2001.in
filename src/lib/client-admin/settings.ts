"use client";

import { useQuery } from "@tanstack/react-query";
import { orgRequest } from "@/lib/admin/http";
import { asOrgId, type OrgId } from "@/lib/admin/ids";
import { toAdminError, retryUnlessAuthz } from "@/lib/admin/errors";
import { queryStatus, type DetailResult } from "@/lib/admin/paging";
import { date, jsonObject, obj, optStr, str } from "@/lib/admin/read";
import { useActor } from "@/lib/admin/identity";
import { useClientAdminCommand, type ClientCommand } from "./command";
import { parseFeatureList } from "./features";
import { useClientDashboard } from "./identity";
import { clientAdminKeys } from "./keys";

export type ClientOrgSettings = {
  readonly id: OrgId;
  readonly name: string;
  readonly slug: string;
  readonly logoUrl: string | null;
  readonly createdAt: Date;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly features: readonly string[];
};

function parseSettings(raw: unknown, at: string): ClientOrgSettings {
  const row = obj(raw, at);
  const metadata = jsonObject(row, "metadata", at);
  const slug = str(row, "slug", at);
  const directFeatures = (row as Record<string, unknown>).enabledFeatures;
  const features = parseFeatureList(metadata, directFeatures);

  const normalizedSlug = slug.toLowerCase().trim();
  if (
    (normalizedSlug === "runachan" || normalizedSlug === "runachain") &&
    !features.includes("linktree")
  ) {
    features.push("linktree");
  }

  return {
    id: asOrgId(str(row, "id", at)),
    name: str(row, "name", at),
    slug,
    logoUrl: optStr(row, "logo", at),
    createdAt: date(row, "createdAt", at),
    metadata,
    features,
  };
}

export function useClientSettings(): DetailResult<ClientOrgSettings> {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;
  const result = useQuery({
    queryKey: clientAdminKeys.settings(actor.id, slug),
    queryFn: () =>
      orgRequest({
        method: "GET",
        path: "/admin/settings",
        parse: parseSettings,
      }),
    retry: retryUnlessAuthz,
  });

  return {
    item: result.data ?? null,
    status: queryStatus(result),
    error: result.error ? toAdminError(result.error) : null,
    reload: () => {
      void result.refetch();
    },
  };
}

export function useClientSettingsCommands(): {
  readonly update: ClientCommand<{ name: string; logoUrl: string }>;
} {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;

  const update = useClientAdminCommand<{ name: string; logoUrl: string }>({
    fields: ["name", "logo"],
    send: async (input) => {
      await orgRequest({
        method: "PATCH",
        path: "/admin/settings",
        body: {
          name: input.name,
          logo: input.logoUrl,
        },
        parse: parseSettings,
      });
    },
    effect: () => ({ on: "settings.changed", actorId: actor.id, slug }),
    toast: () => "Organization settings saved",
  });

  return { update };
}
