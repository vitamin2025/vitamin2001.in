"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AdminError } from "./errors";

export type LoadStatus = "loading" | "ready" | "refreshing" | "failed";

export type PageInfo = {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
};

export type CollectionResult<T> = {
  readonly items: readonly T[];
  readonly status: LoadStatus;
  readonly error: AdminError | null;
  readonly reload: () => void;
};

export type ListResult<T> = CollectionResult<T> & {
  readonly page: PageInfo;
};

export type DetailResult<T> = {
  readonly item: T | null;
  readonly status: LoadStatus;
  readonly error: AdminError | null;
  readonly reload: () => void;
};

export type QueryCodec<T> = {
  parse: (params: URLSearchParams) => T;
  serialize: (query: T) => URLSearchParams;
};

export function parsePageNumber(value: string | null, fallback = 1): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return parsed;
}

export function parsePageSize(value: string | null, fallback = 20): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, 100);
}

export function useListQuery<T extends { page: number }>(
  codec: QueryCodec<T>,
): [T, (patch: Partial<T>) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo(
    () => codec.parse(searchParams),
    [codec, searchParams],
  );

  const patch = useCallback(
    (partial: Partial<T>) => {
      const next = {
        ...query,
        ...partial,
        page:
          "page" in partial && partial.page != null ? partial.page : 1,
      } as T;
      const params = codec.serialize(next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [codec, pathname, query, router],
  );

  return [query, patch];
}

export function queryStatus(input: {
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
}): LoadStatus {
  if (input.isPending) return "loading";
  if (input.isError) return "failed";
  if (input.isFetching) return "refreshing";
  return "ready";
}
