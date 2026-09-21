"use client";

import { useQuery } from "@tanstack/react-query";
import { adminHttp } from "@/lib/admin/http";
import { isAdminError, normalizeError, toAdminError, retryUnlessAuthz } from "@/lib/admin/errors";
import { queryStatus, type DetailResult } from "@/lib/admin/paging";
import { useActor } from "@/lib/admin/identity";
import { useClientAdminCommand, type ClientCommand } from "@/lib/client-admin/command";
import { useClientDashboard } from "@/lib/client-admin/identity";
import { clientAdminKeys } from "@/lib/client-admin/keys";
import type {
  CreateLinkInput,
  CreatePageInput,
  CreateSocialLinkInput,
  LinkAnalyticsDetail,
  LinktreeLink,
  LinktreePage,
  LinktreeSocialLink,
  PageAnalyticsOverview,
  QrCodeResult,
  ReorderLinksInput,
  ReorderSocialLinksInput,
  UpdateLinkInput,
  UpdatePageInput,
  UpdateSocialLinkInput,
} from "./types";

function stripUndefined(
  query?: Readonly<Record<string, string | number | boolean | undefined>>,
): Record<string, string | number | boolean> | undefined {
  if (!query) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

export async function linktreeRequest<T>(spec: {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: Record<string, unknown>;
  parse?: (raw: unknown, at: string) => T;
}): Promise<T> {
  try {
    const response = await adminHttp.request({
      method: spec.method,
      url: `/v1/linktree${spec.path}`,
      params: stripUndefined(spec.query),
      data: spec.body,
    });
    if (spec.parse) {
      return spec.parse(response.data, `/v1/linktree${spec.path}`);
    }
    return response.data as T;
  } catch (error) {
    if (isAdminError(error)) throw error;
    throw normalizeError(error);
  }
}

export function useLinktreePage(): DetailResult<LinktreePage> {
  const actor = useActor();
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;

  const result = useQuery({
    queryKey: clientAdminKeys.linktreePage(actor.id, slug),
    queryFn: () =>
      linktreeRequest<LinktreePage>({
        method: "GET",
        path: "/page",
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

export function useLinktreePageCommands(): {
  readonly createPage: ClientCommand<CreatePageInput, LinktreePage>;
  readonly updatePage: ClientCommand<UpdatePageInput, LinktreePage>;
  readonly publish: ClientCommand<void, void>;
  readonly unpublish: ClientCommand<void, void>;
} {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;

  const createPage = useClientAdminCommand<CreatePageInput, LinktreePage>({
    fields: ["slug", "title", "bio", "avatarUrl"],
    send: async (input) => {
      return linktreeRequest<LinktreePage>({
        method: "POST",
        path: "/page",
        body: input as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Linktree page created successfully",
  });

  const updatePage = useClientAdminCommand<UpdatePageInput, LinktreePage>({
    fields: ["title", "bio", "avatarUrl", "ogTitle", "ogDescription", "ogImage", "theme"],
    send: async (input) => {
      return linktreeRequest<LinktreePage>({
        method: "PATCH",
        path: "/page",
        body: input as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Page settings updated",
  });

  const publish = useClientAdminCommand<void, void>({
    send: async () => {
      await linktreeRequest({
        method: "POST",
        path: "/page/publish",
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Your Linktree page is now published and live!",
  });

  const unpublish = useClientAdminCommand<void, void>({
    send: async () => {
      await linktreeRequest({
        method: "POST",
        path: "/page/unpublish",
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Linktree page has been unpublished",
  });

  return { createPage, updatePage, publish, unpublish };
}

export function useLinktreeLinkCommands(): {
  readonly addLink: ClientCommand<CreateLinkInput, LinktreeLink>;
  readonly updateLink: ClientCommand<{ linkId: string; data: UpdateLinkInput }, LinktreeLink>;
  readonly deleteLink: ClientCommand<{ linkId: string }, void>;
  readonly toggleLink: ClientCommand<{ linkId: string; isEnabled: boolean }, void>;
  readonly reorderLinks: ClientCommand<ReorderLinksInput, void>;
} {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;

  const addLink = useClientAdminCommand<CreateLinkInput, LinktreeLink>({
    fields: ["title", "originalUrl", "thumbnailUrl", "scheduledStart", "scheduledEnd"],
    send: async (input) => {
      return linktreeRequest<LinktreeLink>({
        method: "POST",
        path: "/links",
        body: input as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: (input) => `Added "${input.title}"`,
  });

  const updateLink = useClientAdminCommand<{ linkId: string; data: UpdateLinkInput }, LinktreeLink>({
    fields: ["title", "originalUrl", "thumbnailUrl", "scheduledStart", "scheduledEnd"],
    send: async ({ linkId, data }) => {
      return linktreeRequest<LinktreeLink>({
        method: "PATCH",
        path: `/links/${encodeURIComponent(linkId)}`,
        body: data as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Link updated",
  });

  const deleteLink = useClientAdminCommand<{ linkId: string }, void>({
    send: async ({ linkId }) => {
      await linktreeRequest({
        method: "DELETE",
        path: `/links/${encodeURIComponent(linkId)}`,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Link deleted",
  });

  const toggleLink = useClientAdminCommand<{ linkId: string; isEnabled: boolean }, void>({
    send: async ({ linkId, isEnabled }) => {
      await linktreeRequest({
        method: "PATCH",
        path: `/links/${encodeURIComponent(linkId)}/toggle`,
        body: { isEnabled },
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Link status updated",
  });

  const reorderLinks = useClientAdminCommand<ReorderLinksInput, void>({
    send: async (input) => {
      await linktreeRequest({
        method: "PUT",
        path: "/links/reorder",
        body: input as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Links reordered",
  });

  return { addLink, updateLink, deleteLink, toggleLink, reorderLinks };
}

export function useLinktreeSocialLinkCommands(): {
  readonly addSocialLink: ClientCommand<CreateSocialLinkInput, LinktreeSocialLink>;
  readonly updateSocialLink: ClientCommand<{ socialLinkId: string; data: UpdateSocialLinkInput }, LinktreeSocialLink>;
  readonly deleteSocialLink: ClientCommand<{ socialLinkId: string }, void>;
  readonly reorderSocialLinks: ClientCommand<ReorderSocialLinksInput, void>;
} {
  const actor = useActor();
  const slug = useClientDashboard().organization.slug;

  const addSocialLink = useClientAdminCommand<CreateSocialLinkInput, LinktreeSocialLink>({
    fields: ["platform", "url"],
    send: async (input) => {
      return linktreeRequest<LinktreeSocialLink>({
        method: "POST",
        path: "/social-links",
        body: input as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Social link added",
  });

  const updateSocialLink = useClientAdminCommand<{ socialLinkId: string; data: UpdateSocialLinkInput }, LinktreeSocialLink>({
    fields: ["platform", "url"],
    send: async ({ socialLinkId, data }) => {
      return linktreeRequest<LinktreeSocialLink>({
        method: "PATCH",
        path: `/social-links/${encodeURIComponent(socialLinkId)}`,
        body: data as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Social link updated",
  });

  const deleteSocialLink = useClientAdminCommand<{ socialLinkId: string }, void>({
    send: async ({ socialLinkId }) => {
      await linktreeRequest({
        method: "DELETE",
        path: `/social-links/${encodeURIComponent(socialLinkId)}`,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Social link deleted",
  });

  const reorderSocialLinks = useClientAdminCommand<ReorderSocialLinksInput, void>({
    send: async (input) => {
      await linktreeRequest({
        method: "PUT",
        path: "/social-links/reorder",
        body: input as unknown as Record<string, unknown>,
      });
    },
    effect: () => ({ on: "linktree.changed", actorId: actor.id, slug }),
    toast: () => "Social links reordered",
  });

  return { addSocialLink, updateSocialLink, deleteSocialLink, reorderSocialLinks };
}

export function useLinktreeAnalytics(): DetailResult<PageAnalyticsOverview> {
  const actor = useActor();
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;

  const result = useQuery({
    queryKey: clientAdminKeys.linktreeAnalytics(actor.id, slug),
    queryFn: () =>
      linktreeRequest<PageAnalyticsOverview>({
        method: "GET",
        path: "/analytics/overview",
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

export function useLinktreeLinkAnalytics(linkId: string | null): DetailResult<LinkAnalyticsDetail> {
  const actor = useActor();
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;

  const result = useQuery({
    queryKey: linkId ? clientAdminKeys.linktreeLinkAnalytics(actor.id, slug, linkId) : ["idle"],
    queryFn: async () => {
      if (!linkId) return null;
      const [overview, countries, timeSeries, topReferrers, clicks] = await Promise.all([
        linktreeRequest<{ totalClicks?: number; clicks?: number }>({
          method: "GET",
          path: `/analytics/links/${encodeURIComponent(linkId)}`,
          query: { period: "total" },
        }).catch(() => ({ totalClicks: 0, clicks: 0 })),
        linktreeRequest<Array<{ country: string; clicks: number }>>({
          method: "GET",
          path: `/analytics/links/${encodeURIComponent(linkId)}/countries`,
        }).catch(() => []),
        linktreeRequest<Array<{ date?: string; interval?: string; clicks: number }>>({
          method: "GET",
          path: `/analytics/links/${encodeURIComponent(linkId)}/timeseries`,
        }).catch(() => []),
        linktreeRequest<Array<{ referrer?: string; value?: string; clicks: number }>>({
          method: "GET",
          path: `/analytics/links/${encodeURIComponent(linkId)}/top`,
          query: { column: "referrer" },
        }).catch(() => []),
        linktreeRequest<
          Array<{ clickedAt?: string; createdAt?: string; country?: string; browser?: string; os?: string }>
        >({
          method: "GET",
          path: `/analytics/links/${encodeURIComponent(linkId)}/clicks`,
        }).catch(() => []),
      ]);

      return {
        linkId,
        totalClicks: overview.totalClicks ?? overview.clicks ?? 0,
        countries,
        timeSeries: timeSeries.map((point) => ({
          date: point.date || point.interval || "",
          clicks: point.clicks,
        })),
        topReferrers: topReferrers.map((item) => ({
          referrer: item.referrer || item.value || "",
          clicks: item.clicks,
        })),
        recentClicks: clicks.map((click) => ({
          clickedAt: click.clickedAt || click.createdAt || "",
          country: click.country,
          browser: click.browser,
          os: click.os,
        })),
      };
    },
    enabled: Boolean(linkId),
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

export async function fetchLinkQrCode(linkId: string): Promise<QrCodeResult> {
  return linktreeRequest<QrCodeResult>({
    method: "GET",
    path: `/links/${encodeURIComponent(linkId)}/qr`,
  });
}
