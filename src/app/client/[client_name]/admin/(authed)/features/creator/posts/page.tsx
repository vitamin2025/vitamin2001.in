"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Calendar,
  Heart,
  MessageSquare,
  Sparkles,
  Pencil,
  Trash2,
  Send,
  Loader2,
} from "lucide-react";
import {
  useCreatorPosts,
  usePublishCreatorPost,
  useDeleteCreatorPost,
} from "@/lib/client-admin/creator";

export default function CreatorPostsPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading } = useCreatorPosts(slug, {
    status: statusFilter || undefined,
  });

  const publishMutation = usePublishCreatorPost(slug);
  const deleteMutation = useDeleteCreatorPost(slug);

  const posts = data?.posts || [];
  const basePath = `/client/${encodeURIComponent(slug)}/admin/features/creator/posts`;

  const handlePublish = async (postId: string) => {
    if (confirm("Are you sure you want to publish this post immediately?")) {
      await publishMutation.mutateAsync(postId);
    }
  };

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      await deleteMutation.mutateAsync(postId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Post Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Draft, schedule, and publish tiered content with multimedia attachments for your supporters.
          </p>
        </div>

        <Link
          href={`${basePath}/new`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" /> Create Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { label: "All Posts", val: "" },
          { label: "Published", val: "published" },
          { label: "Scheduled", val: "scheduled" },
          { label: "Drafts", val: "draft" },
        ].map((tab) => (
          <button
            key={tab.val}
            type="button"
            onClick={() => setStatusFilter(tab.val)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === tab.val
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-2xs gap-4 hover:border-slate-300 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : post.status === "scheduled"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {post.status}
                  </span>

                  {post.minTierRank > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                      <Sparkles className="h-2.5 w-2.5" /> Tier {post.minTierRank}+
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                      Public
                    </span>
                  )}

                  {post.category && (
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {post.excerpt || (post.body ? post.body.replace(/<[^>]*>/g, "").slice(0, 100) : "No text preview")}
                </p>

                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.publishedAt
                      ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                      : post.scheduledPublishAt
                        ? `Scheduled for ${new Date(post.scheduledPublishAt).toLocaleString()}`
                        : "Unpublished"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {post.likeCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {post.commentCount || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {post.status !== "published" && (
                  <button
                    type="button"
                    onClick={() => handlePublish(post.id)}
                    disabled={publishMutation.isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" /> Publish
                  </button>
                )}

                <Link
                  href={`${basePath}/${post.id}/edit`}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit post"
                >
                  <Pencil className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  disabled={deleteMutation.isPending}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center bg-white">
          <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No posts found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {statusFilter
              ? `No posts matching '${statusFilter}' status.`
              : "Share your first creative piece with your fans and supporters."}
          </p>
          <Link
            href={`${basePath}/new`}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" /> Create First Post
          </Link>
        </div>
      )}
    </div>
  );
}
