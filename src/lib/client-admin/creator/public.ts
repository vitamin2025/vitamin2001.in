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
  CreatorComment,
  CheckoutResponse,
} from "./types";

export async function creatorPublicRequest<T>(spec: {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  slug: string;
  path: string;
  query?: Record<string, any>;
  body?: any;
}): Promise<T> {
  const response = await adminHttp.request({
    method: spec.method,
    url: `/v1/creators/${encodeURIComponent(spec.slug)}${spec.path}`,
    params: spec.query,
    data: spec.body,
  });
  return response.data as T;
}

export function usePublicCreatorProfile(slug: string) {
  return useQuery({
    queryKey: creatorKeys.publicProfile(slug),
    queryFn: () =>
      creatorPublicRequest<CreatorProfile>({
        method: "GET",
        slug,
        path: "/profile",
      }),
    enabled: Boolean(slug),
  });
}

export function usePublicCreatorTiers(slug: string) {
  return useQuery({
    queryKey: creatorKeys.publicTiers(slug),
    queryFn: () =>
      creatorPublicRequest<CreatorTier[]>({
        method: "GET",
        slug,
        path: "/tiers",
      }),
    enabled: Boolean(slug),
  });
}

export function useFanMe(slug: string) {
  return useQuery({
    queryKey: creatorKeys.fanMe(slug),
    queryFn: () =>
      creatorPublicRequest<Patron>({
        method: "GET",
        slug,
        path: "/me",
      }),
    enabled: Boolean(slug),
    retry: false,
  });
}

export function useFanFollow(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      creatorPublicRequest<Patron>({
        method: "POST",
        slug,
        path: "/me/follow",
        body: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.fanMe(slug) });
      qc.invalidateQueries({ queryKey: creatorKeys.fanFeed(slug) });
    },
  });
}

export function useFanUnfollow(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      creatorPublicRequest<{ success: boolean }>({
        method: "POST",
        slug,
        path: "/me/unfollow",
        body: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.fanMe(slug) });
      qc.invalidateQueries({ queryKey: creatorKeys.fanFeed(slug) });
    },
  });
}

export function useFanFeed(slug: string, filters?: Record<string, any>) {
  return useQuery({
    queryKey: creatorKeys.fanFeed(slug, filters),
    queryFn: () =>
      creatorPublicRequest<FeedResponse>({
        method: "GET",
        slug,
        path: "/feed",
        query: filters,
      }),
    enabled: Boolean(slug),
  });
}

export function useFanPost(slug: string, postId: string) {
  return useQuery({
    queryKey: creatorKeys.post(slug, postId),
    queryFn: () =>
      creatorPublicRequest<CreatorPost>({
        method: "GET",
        slug,
        path: `/feed/${postId}`,
      }),
    enabled: Boolean(slug && postId),
  });
}

export function useLikePost(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      creatorPublicRequest<{ liked: boolean; likeCount: number }>({
        method: "POST",
        slug,
        path: `/feed/${postId}/like`,
        body: {},
      }),
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: creatorKeys.fanFeed(slug) });
      qc.invalidateQueries({ queryKey: creatorKeys.post(slug, postId) });
    },
  });
}

export function useFanCancel(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      creatorPublicRequest<{ status: string; cancelAtPeriodEnd: boolean }>({
        method: "POST",
        slug,
        path: "/me/cancel",
        body: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.fanMe(slug) });
    },
  });
}

export function useFanCheckout(slug: string) {
  return useMutation({
    mutationFn: (tierId: string) =>
      creatorPublicRequest<CheckoutResponse>({
        method: "POST",
        slug,
        path: "/checkout",
        body: { tierId },
      }),
  });
}

export function usePaymentStatus(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...creatorKeys.fanMe(slug), "checkout-status"],
    queryFn: () =>
      creatorPublicRequest<{
        status: string;
        subscriptionId: string;
        tierRank: number;
        tierName?: string;
        currentPeriodEnd?: string | null;
        cancelAtPeriodEnd?: boolean;
      }>({
        method: "GET",
        slug,
        path: "/checkout/status",
      }),
    enabled: Boolean(slug && enabled),
  });
}

export function usePostComments(slug: string, postId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: creatorKeys.comments(slug, postId),
    queryFn: () =>
      creatorPublicRequest<{ comments: CreatorComment[] }>({
        method: "GET",
        slug,
        path: `/posts/${postId}/comments`,
      }),
    enabled: Boolean(slug && postId && enabled),
  });
}

export function useCreateComment(slug: string, postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      creatorPublicRequest<CreatorComment>({
        method: "POST",
        slug,
        path: `/posts/${postId}/comments`,
        body: { body },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.comments(slug, postId) });
      qc.invalidateQueries({ queryKey: creatorKeys.post(slug, postId) });
      qc.invalidateQueries({ queryKey: creatorKeys.fanFeed(slug) });
    },
  });
}

export function useFanMessages(slug: string) {
  return useQuery({
    queryKey: creatorKeys.messages(slug),
    queryFn: () =>
      creatorPublicRequest<{ threadId: string; messages: { id: string; body: string; senderId: string }[] }>({
        method: "GET",
        slug,
        path: "/messages",
      }),
    enabled: Boolean(slug),
  });
}

export function useSendFanMessage(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      creatorPublicRequest<{ id: string }>({
        method: "POST",
        slug,
        path: "/messages",
        body: { body },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creatorKeys.messages(slug) });
    },
  });
}

export function useUnlikePost(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      creatorPublicRequest<{ liked: boolean; likeCount: number }>({
        method: "DELETE",
        slug,
        path: `/feed/${postId}/like`,
      }),
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: creatorKeys.fanFeed(slug) });
      qc.invalidateQueries({ queryKey: creatorKeys.post(slug, postId) });
    },
  });
}
