"use client";

import { use } from "react";
import Link from "next/link";
import {
  Layers,
  FileText,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  useCreatorTiers,
  useCreatorPosts,
  useCreatorPatrons,
} from "@/lib/client-admin/creator";

export default function CreatorDashboardPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  const { data: tiers = [] } = useCreatorTiers(slug);
  const { data: postsData } = useCreatorPosts(slug, { limit: 5 });
  const { data: patronsData } = useCreatorPatrons(slug, { limit: 5 });

  const totalPatrons = patronsData?.total ?? 0;
  const totalPosts = postsData?.total ?? 0;
  const activeTiersCount = tiers.filter((t) => t.isActive).length;

  const basePath = `/client/${encodeURIComponent(slug)}/admin/features/creator`;

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Patrons</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{totalPatrons}</p>
          <p className="mt-1 text-xs text-slate-400">Total community supporters</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Membership Tiers</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{activeTiersCount}</p>
          <p className="mt-1 text-xs text-slate-400">Active levels configured</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Posts</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{totalPosts}</p>
          <p className="mt-1 text-xs text-slate-400">Published & drafts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estimated MRR</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">Phase 2</p>
          <p className="mt-1 text-xs text-slate-400">Payments gateway ready</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-indigo-200 mb-1">
            <Sparkles className="h-3 w-3" /> Quick Launch
          </span>
          <h2 className="text-lg font-bold">Publish your next creator update</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Share high-resolution illustrations, process videos, audio podcasts, or written stories.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`${basePath}/posts/new`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" /> New Post
          </Link>
          <Link
            href={`${basePath}/tiers`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700/60 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Manage Tiers
          </Link>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Posts</h3>
            <Link
              href={`${basePath}/posts`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {postsData?.posts && postsData.posts.length > 0 ? (
            <div className="space-y-3">
              {postsData.posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-xs font-bold text-slate-900 truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : post.status === "scheduled"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Level {post.minTierRank}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`${basePath}/posts/${post.id}/edit`}
                    className="text-xs text-indigo-600 hover:underline shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No posts created yet.
            </div>
          )}
        </div>

        {/* Recent Patrons */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Patrons</h3>
            <Link
              href={`${basePath}/patrons`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              View roster <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {patronsData?.patrons && patronsData.patrons.length > 0 ? (
            <div className="space-y-3">
              {patronsData.patrons.slice(0, 5).map((patron) => (
                <div
                  key={patron.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {patron.user?.name || patron.userId}
                    </p>
                    <p className="text-[11px] text-slate-400">{patron.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                      {patron.tier?.name || (patron.tierRank === 0 ? "Follower" : `Level ${patron.tierRank}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No patrons yet. Share your membership page!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
