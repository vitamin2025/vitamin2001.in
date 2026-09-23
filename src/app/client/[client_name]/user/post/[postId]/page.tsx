"use client";

import React, { use } from "react";
import Link from "next/link";
import { useState } from "react";
import {
  useCreateComment,
  useFanPost,
  useLikePost,
  usePostComments,
  useUnlikePost,
  usePublicCreatorProfile,
} from "@/lib/client-admin/creator";
import { PostCard } from "@/components/creator/post-card";
import { PostTeaserCard } from "@/components/creator/post-teaser-card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Sparkles, AlertCircle } from "lucide-react";

export default function FanPostDetailPage({
  params,
}: {
  params: Promise<{ client_name: string; postId: string }>;
}) {
  const { client_name: slug, postId } = use(params);

  const { data: post, isLoading, isError } = useFanPost(slug, postId);
  const { data: profile } = usePublicCreatorProfile(slug);
  const likePost = useLikePost(slug);
  const unlikePost = useUnlikePost(slug);
  const unlocked = Boolean(post && !post.locked && !post.isLocked);
  const comments = usePostComments(slug, postId, unlocked);
  const createComment = useCreateComment(slug, postId);
  const [commentBody, setCommentBody] = useState("");

  const handleLikeToggle = async (id: string, currentLiked: boolean) => {
    if (currentLiked) {
      await unlikePost.mutateAsync(id);
    } else {
      await likePost.mutateAsync(id);
    }
  };

  const creatorName = profile?.name || slug;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link
            href={`/client/${encodeURIComponent(slug)}/user/feed`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Community Feed</span>
          </Link>

          <Link
            href={`/client/${encodeURIComponent(slug)}/public/membership`}
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Membership Tiers</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner text="Loading post content..." />
          </div>
        ) : isError || !post ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Post Not Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              This post may have been removed, archived, or is not available.
            </p>
            <Link href={`/client/${encodeURIComponent(slug)}/user/feed`}>
              <Button variant="outline" size="sm" className="mt-4 text-xs">
                Return to Feed
              </Button>
            </Link>
          </div>
        ) : (post.locked || post.isLocked) ? (
          <div className="space-y-4">
            <PostTeaserCard post={post} slug={slug} />
          </div>
        ) : (
          <div className="space-y-6">
            <PostCard
              post={post}
              slug={slug}
              onLikeToggle={handleLikeToggle}
              showFullContent={true}
            />

            {/* Discussion / Comments Section */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Discussion ({comments.data?.comments?.length ?? post.commentCount ?? 0})
                </h3>
              </div>

              {comments.isLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Loading discussion...
                </div>
              ) : !comments.data?.comments || comments.data.comments.length === 0 ? (
                <p className="mt-4 text-xs text-slate-400 italic">
                  No comments yet. Be the first to start the discussion!
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {comments.data.comments.map((comment) => (
                    <li key={comment.id} className="rounded-xl bg-slate-50 p-3 text-xs text-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-800">
                          {comment.userName || "Community Member"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              <form
                className="mt-6 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const body = commentBody.trim();
                  if (!body || createComment.isPending) return;
                  createComment.mutate(body, { onSuccess: () => setCommentBody("") });
                }}
              >
                <input
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  placeholder="Share your thoughts on this post..."
                />
                <Button type="submit" size="sm" disabled={!commentBody.trim() || createComment.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs px-4">
                  {createComment.isPending ? "Posting..." : "Post"}
                </Button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
