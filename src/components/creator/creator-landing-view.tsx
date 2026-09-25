"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Layers,
  LogIn,
  Loader2,
  User,
  Search,
} from "lucide-react";
import { useClientSession } from "@/lib/client-admin";
import {
  usePublicCreatorProfile,
  usePublicCreatorTiers,
  useFanFeed,
  useFanMe,
  useLikePost,
  useUnlikePost,
  type CreatorPost,
} from "@/lib/client-admin/creator";
import { Input } from "@/components/ui/input";
import { PostCard } from "./post-card";
import { PostTeaserCard } from "./post-teaser-card";

interface CreatorLandingViewProps {
  slug: string;
}

export function CreatorLandingView({ slug }: CreatorLandingViewProps) {
  const session = useClientSession();
  const { data: patron } = useFanMe(slug);
  const { data: profile, isLoading: profileLoading } = usePublicCreatorProfile(slug);
  const { data: tiers = [], isLoading: tiersLoading } = usePublicCreatorTiers(slug);

  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: feedData, isLoading: feedLoading } = useFanFeed(slug, {
    limit: 20,
    category: category || undefined,
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

  const isLoggedIn = session.status === "granted" || Boolean(patron);
  const creatorName = profile?.name || slug;

  const posts: CreatorPost[] = feedData?.posts ?? feedData?.items ?? [];
  const filteredPosts = searchQuery
    ? posts.filter(
        (p: CreatorPost) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : posts;

  const categories = ["All", "Articles", "Updates", "Videos", "Podcasts"];

  const hasPaidMembership =
    patron?.status === "active" && Number(patron.tierRank) > 0;
  const currentTier = hasPaidMembership
    ? tiers.find((tier) => tier.id === patron?.tierId) ||
      tiers.find((tier) => Number(tier.rank) === Number(patron?.tierRank))
    : null;
  const canUpgrade =
    hasPaidMembership &&
    tiers.some((tier) => Number(tier.rank) > Number(patron?.tierRank));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-slate-800 overflow-hidden">
        {profile?.bannerUrl ? (
          <img
            src={profile.bannerUrl}
            alt={creatorName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs" />

        <div className="absolute bottom-6 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/20">
              {creatorName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-md bg-white/20 backdrop-blur-md px-2 py-0.5 text-xs font-semibold text-white mb-1">
                <Sparkles className="h-3 w-3" /> Official Creator Community
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {creatorName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {patron?.tierRank ? (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-amber-400/90 backdrop-blur-md px-3 py-2 text-xs font-bold text-slate-900 shadow-md">
                    <Sparkles className="h-3.5 w-3.5" /> Tier {patron.tierRank} Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-white/90 backdrop-blur-md px-3 py-2 text-xs font-semibold text-slate-800 shadow-md">
                    Community Member
                  </span>
                )}
                <Link
                  href={`/client/${encodeURIComponent(slug)}/user/account`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-md hover:bg-white transition-colors"
                >
                  <User className="h-3.5 w-3.5" /> My Account
                </Link>
                <Link
                  href={`/client/${encodeURIComponent(slug)}/user/feed`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
                >
                  Full Feed <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href={`/client/${encodeURIComponent(slug)}/user/signup`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors"
                >
                  Follow for Free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/client/${encodeURIComponent(slug)}/user/login`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-md hover:bg-white transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" /> Member Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Bio summary */}
        {profile?.bio && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              About the Creator
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {isLoggedIn ? "Your Community Feed" : "Recent Posts & Updates"}
              </h2>
              <Link
                href={`/client/${encodeURIComponent(slug)}/user/feed`}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                View full feed →
              </Link>
            </div>

            {/* Filter and Search Controls */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search community posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9 bg-slate-50 border-slate-200"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
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
            </div>

            {feedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post) => {
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
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
                <p className="text-sm">
                  {category || searchQuery
                    ? "No posts match your filters. Try clearing your search."
                    : "No public posts yet. Check back soon!"}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: Membership Tiers Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {hasPaidMembership ? "Your membership" : "Membership Tiers"}
                </h2>
              </div>
            </div>

            {tiersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : hasPaidMembership ? (
              <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-2xs space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                  Current plan
                </p>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {currentTier?.name || patron?.tierName || `Tier ${patron?.tierRank}`}
                  </h3>
                  {currentTier && (
                    <span className="text-xs font-bold text-slate-900">
                      ₹{(currentTier.priceMinor / 100).toFixed(0)}/mo
                    </span>
                  )}
                </div>
                {currentTier?.description && (
                  <p className="text-xs text-slate-500 line-clamp-3">{currentTier.description}</p>
                )}
                {canUpgrade && (
                  <Link
                    href={`/client/${encodeURIComponent(slug)}/public/membership`}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    Upgrade <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{tier.name}</h3>
                      <span className="text-xs font-bold text-slate-900">
                        {tier.rank === 0 || tier.priceMinor === 0
                          ? "Free"
                          : `₹${(tier.priceMinor / 100).toFixed(0)}/mo`}
                      </span>
                    </div>
                    {tier.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">
                        {tier.description}
                      </p>
                    )}
                    <Link
                      href={`/client/${encodeURIComponent(slug)}/user/signup?tierId=${tier.id}`}
                      className="w-full py-2 bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      Join Tier
                    </Link>
                  </div>
                ))}

                <Link
                  href={`/client/${encodeURIComponent(slug)}/public/membership`}
                  className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-500 py-2"
                >
                  Compare all tier benefits →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
