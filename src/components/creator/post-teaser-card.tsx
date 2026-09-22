"use client";

import Link from "next/link";
import { Lock, Sparkles, Heart, MessageSquare, Calendar } from "lucide-react";
import type { CreatorPost } from "@/lib/client-admin/creator";

interface PostTeaserCardProps {
  post: CreatorPost;
  slug: string;
}

export function PostTeaserCard({ post, slug }: PostTeaserCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const tierName = post.requiredTier?.name || `Tier ${post.requiredTierRank || post.minTierRank}`;
  const priceDisplay = post.requiredTier?.priceMinor
    ? `₹${(post.requiredTier.priceMinor / 100).toFixed(0)}/mo`
    : null;

  return (
    <article className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow">
      {/* Locked overlay ribbon */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/60 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
          <Lock className="h-3.5 w-3.5 text-amber-600" />
          <span>Locked Post • Requires {tierName}</span>
        </div>
        {priceDisplay && (
          <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full">
            {priceDisplay}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          {post.category && (
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {post.category}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Lock Callout Box */}
        <div className="mt-5 p-5 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-xl border border-slate-200 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-3 shadow-inner">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Unlock this exclusive post
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            Join the <span className="font-semibold text-slate-700">{tierName}</span> membership tier to access full post content, high-resolution media, and community discussions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/client/${encodeURIComponent(slug)}/public/membership`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-500 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" /> Join {tierName} to Unlock
            </Link>
            <Link
              href={`/client/${encodeURIComponent(slug)}/user/login`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Already a member? Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50/30">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5" /> {post.likeCount || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> {post.commentCount || 0}
          </span>
        </div>
        <span className="text-[11px] font-medium text-amber-700">Supporters only</span>
      </div>
    </article>
  );
}
