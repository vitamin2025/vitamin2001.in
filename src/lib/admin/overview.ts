"use client";

import { useQuery } from "@tanstack/react-query";
import { toAdminError } from "./errors";
import { adminRequest } from "./http";
import { useActor } from "./identity";
import { keys } from "./keys";
import { queryStatus, type LoadStatus } from "./paging";
import { retryUnlessAuthz } from "./errors";
import { parseAuditEntry, type AuditEntry } from "./audit";
import { list } from "./read";
import { parsePlatformStats, type PlatformStats } from "./stats";

export type { PlatformStats };

export function useOverview(): {
  readonly stats: PlatformStats | null;
  readonly activity: readonly AuditEntry[];
  readonly status: LoadStatus;
  readonly error: ReturnType<typeof toAdminError> | null;
  readonly reload: () => void;
} {
  const actor = useActor();

  const statsQuery = useQuery({
    queryKey: keys.overview.stats(actor.id),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: "/dashboard/stats",
        parse: parsePlatformStats,
      }),
    retry: retryUnlessAuthz,
  });

  const activityQuery = useQuery({
    queryKey: keys.overview.activity(actor.id),
    queryFn: () =>
      adminRequest({
        method: "GET",
        path: "/dashboard/recent-activity",
        query: { limit: 25 },
        parse: (raw, at) => list(raw, at, parseAuditEntry),
      }),
    retry: retryUnlessAuthz,
  });

  const error = statsQuery.error
    ? toAdminError(statsQuery.error)
    : activityQuery.error
      ? toAdminError(activityQuery.error)
      : null;

  const status = queryStatus({
    isPending: statsQuery.isPending || activityQuery.isPending,
    isError: statsQuery.isError || activityQuery.isError,
    isFetching: statsQuery.isFetching || activityQuery.isFetching,
  });

  return {
    stats: statsQuery.data ?? null,
    activity: activityQuery.data ?? [],
    status,
    error,
    reload: () => {
      void statsQuery.refetch();
      void activityQuery.refetch();
    },
  };
}
