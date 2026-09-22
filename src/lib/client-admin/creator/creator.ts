"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminHttp } from "@/lib/admin/http";
import { creatorKeys } from "./keys";
import type {
  CreatorProfile,
  CreatorTier,
  CreatorPost,
  Patron,
  FeedResponse,
} from "./types";

// Helper request wrapper
export async function creatorAdminRequest<T>(spec: {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  query?: Record<string, any>;
  body?: any;
}): Promise<T> {
  const response = await adminHttp.request({
    method: spec.method,
    url: `/v1/creator${spec.path}`,
    params: spec.query,
    data: spec.body,
  });
  return response.data as T;
}

// -----------------------------------------------------------------------------
// PROFILE HOOKS
// -----------------------------------------------------------------------------

export function useCreatorProfile(slug: string) {
  return useQuery({
    queryKey: creatorKeys.profile(slug),
    queryFn: () => creatorAdminRequest<CreatorProfile>({ method: "GET", path: "/profile" }),
  });
}

export function useUpdateCreatorProfile(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreatorProfile>) =>
      creatorAdminRequest<CreatorProfile>({
        method: "PATCH",
        path: "/profile",
        body: dto,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.profile(slug) });
    },
  });
}

// -----------------------------------------------------------------------------
// TIERS HOOKS
// -----------------------------------------------------------------------------

export function useCreatorTiers(slug: string) {
  return useQuery({
    queryKey: creatorKeys.tiers(slug),
    queryFn: () => creatorAdminRequest<CreatorTier[]>({ method: "GET", path: "/tiers" }),
  });
}

export function useCreateCreatorTier(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreatorTier>) =>
      creatorAdminRequest<CreatorTier>({
        method: "POST",
        path: "/tiers",
        body: dto,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.tiers(slug) });
    },
  });
}

export function useUpdateCreatorTier(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tierId, dto }: { tierId: string; dto: Partial<CreatorTier> }) =>
      creatorAdminRequest<CreatorTier>({
        method: "PATCH",
        path: `/tiers/${tierId}`,
        body: dto,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.tiers(slug) });
    },
  });
}

export function useDeactivateCreatorTier(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tierId: string) =>
      creatorAdminRequest<{ success: boolean; tier: CreatorTier }>({
        method: "POST",
        path: `/tiers/${tierId}/deactivate`,
        body: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.tiers(slug) });
    },
  });
}

export function useReorderCreatorTiers(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tierIds: string[]) =>
      creatorAdminRequest<CreatorTier[]>({
        method: "PATCH",
        path: "/tiers/reorder",
        body: { tierIds },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.tiers(slug) });
    },
  });
}

// -----------------------------------------------------------------------------
// POSTS HOOKS
// -----------------------------------------------------------------------------

export function useCreatorPosts(slug: string, filters?: Record<string, any>) {
  return useQuery({
    queryKey: creatorKeys.posts(slug, filters),
    queryFn: () =>
      creatorAdminRequest<{ posts: CreatorPost[]; total: number; page: number; limit: number }>({
        method: "GET",
        path: "/posts",
        query: filters,
      }),
  });
}

export function useCreatorPost(slug: string, postId: string) {
  return useQuery({
    queryKey: creatorKeys.post(slug, postId),
    queryFn: () => creatorAdminRequest<CreatorPost>({ method: "GET", path: `/posts/${postId}` }),
    enabled: Boolean(postId),
  });
}

export function useCreateCreatorPost(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) =>
      creatorAdminRequest<CreatorPost>({
        method: "POST",
        path: "/posts",
        body: dto,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.posts(slug) });
    },
  });
}

export function useUpdateCreatorPost(slug: string, postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) =>
      creatorAdminRequest<CreatorPost>({
        method: "PATCH",
        path: `/posts/${postId}`,
        body: dto,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.posts(slug) });
      qc.invalidateQueries({ queryKey: creatorKeys.post(slug, postId) });
    },
  });
}

export function usePublishCreatorPost(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      creatorAdminRequest<CreatorPost>({
        method: "POST",
        path: `/posts/${postId}/publish`,
        body: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.posts(slug) });
    },
  });
}

export function useDeleteCreatorPost(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      creatorAdminRequest<{ success: boolean }>({
        method: "DELETE",
        path: `/posts/${postId}`,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.posts(slug) });
    },
  });
}

// -----------------------------------------------------------------------------
// PATRONS HOOKS
// -----------------------------------------------------------------------------

export function useCreatorPatrons(slug: string, filters?: Record<string, any>) {
  return useQuery({
    queryKey: creatorKeys.patrons(slug, filters),
    queryFn: () =>
      creatorAdminRequest<{ patrons: Patron[]; total: number; page: number; limit: number }>({
        method: "GET",
        path: "/patrons",
        query: filters,
      }),
  });
}

export function useGrantPatronTier(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patronId, tierId }: { patronId: string; tierId: string }) =>
      creatorAdminRequest<Patron>({
        method: "POST",
        path: `/patrons/${patronId}/grant-tier`,
        body: { tierId },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.patrons(slug) });
    },
  });
}

export function useCreatorEarnings(slug: string) {
  return useQuery({
    queryKey: creatorKeys.earnings(slug),
    queryFn: () =>
      creatorAdminRequest<{
        grossRevenueMinor: number;
        capturedCount: number;
        mrrMinor: number;
        currency: string;
      }>({ method: "GET", path: "/earnings/summary" }),
  });
}

export function useCreatorInbox(slug: string) {
  return useQuery({
    queryKey: creatorKeys.inbox(slug),
    queryFn: () =>
      creatorAdminRequest<{
        threads: { threadId: string; lastBody: string; unread: number }[];
      }>({ method: "GET", path: "/inbox" }),
  });
}

export function useReplyToThread(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, body }: { threadId: string; body: string }) =>
      creatorAdminRequest<{ id: string }>({
        method: "POST",
        path: `/inbox/${encodeURIComponent(threadId)}/reply`,
        body: { body },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.inbox(slug) });
    },
  });
}

export function useRevokePatronTier(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patronId: string) =>
      creatorAdminRequest<Patron>({
        method: "POST",
        path: `/patrons/${patronId}/revoke`,
        body: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.patrons(slug) });
    },
  });
}
