"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  useFanFeed,
  useLikePost,
  useUnlikePost,
  usePublicCreatorProfile,
  useFanMe,
  type CreatorPost,
} from "@/lib/client-admin/creator";
import { PostCard } from "@/components/creator/post-card";
import { PostTeaserCard } from "@/components/creator/post-teaser-card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Search,
  Filter,
  User,
  Shield,
  Layers,
  Heart,
  Calendar,
} from "lucide-react";

export const renderPostCard = (locked: boolean) => (locked ? "TeaserCard" : "FullCard");

export default function FanFeedPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  const [category, setCategory] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: profile } = usePublicCreatorProfile(slug);
  const { data: patron } = useFanMe(slug);
  const {
    data: feedData,
    isLoading,
    refetch,
  } = useFanFeed(slug, {
    category: category || undefined,
    tag: tag || undefined,
  });

  const likePost = useLikePost(slug);
  const unlikePost = useUnlikePost(slug);

  const handleLikeToggle = async (postId: string, currentLiked: boolean) => {
    if (currentLiked) {
      await unlikePost.mutateAsync(postId);
    } else {
      await likePost.mutateAsync(postId);
    }
  };

  const posts: CreatorPost[] = feedData?.posts ?? feedData?.items ?? [];
  const filteredPosts = searchQuery
    ? posts.filter(
        (p: CreatorPost) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  // Extract available categories
  const categories = ["All", "Articles", "Updates", "Videos", "Podcasts"];

  const creatorName = profile?.name || slug;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner / Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-xs">
              {creatorName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <Link
                href={`/client/${encodeURIComponent(slug)}`}
                className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors"
              >
                {creatorName}
              </Link>
              <p className="text-[11px] text-slate-400 font-mono leading-none">
                Community Feed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {patron?.tierRank ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                <Sparkles className="h-3 w-3" />
                <span>Tier {patron.tierRank} Member</span>
              </span>
            ) : (
              <Link href={`/client/${encodeURIComponent(slug)}/public/membership`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Upgrade</span>
                </Button>
              </Link>
            )}

            <Link href={`/client/${encodeURIComponent(slug)}/user/account`}>
              <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-slate-600">
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">My Account</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Feed Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search posts in community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-slate-50 border-slate-200"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              {categories.map((cat) => {
                const isSelected =
                  cat === "All" ? !category : category.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat === "All" ? "" : cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {tag && (
              <div className="flex items-center gap-1">
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                  #{tag}
                </span>
                <button
                  type="button"
                  onClick={() => setTag("")}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feed Posts */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner text="Loading feed posts..." />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No posts found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {category || tag || searchQuery
                ? "No posts match your active filters. Try resetting the search or category."
                : "The creator hasn't published any posts yet. Check back soon!"}
            </p>
            {(category || tag || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategory("");
                  setTag("");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post: CreatorPost) => {
              const isLocked = Boolean(post.locked || post.isLocked);
              return isLocked ? (
                <PostTeaserCard key={post.id} post={post} slug={slug} />
              ) : (
                <PostCard
                  key={post.id}
                  post={post}
                  slug={slug}
                  onLikeToggle={handleLikeToggle}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
