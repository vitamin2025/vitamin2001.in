"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  FileText,
  Download,
  Calendar,
  Sparkles,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useLikePost,
  useUnlikePost,
  usePostComments,
  useCreateComment,
  type CreatorPost,
} from "@/lib/client-admin/creator";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/creator/video-player";
import { VideoPlayerLegacy } from "@/components/creator/video-player-legacy";
import { EmbedPlayer } from "@/components/creator/embed-player";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: CreatorPost;
  slug: string;
  onLikeToggle?: (postId: string, currentLiked: boolean) => Promise<void>;
  showFullContent?: boolean;
}

export function PostCard({
  post,
  slug,
  onLikeToggle,
  showFullContent = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const defaultLike = useLikePost(slug);
  const defaultUnlike = useUnlikePost(slug);
  const commentsQuery = usePostComments(slug, post.id, showDiscussion);
  const createCommentMutation = useCreateComment(slug, post.id);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const nextLiked = !liked;
    const nextCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLiked(nextLiked);
    setLikeCount(nextCount);

    try {
      if (onLikeToggle) {
        await onLikeToggle(post.id, !nextLiked);
      } else if (nextLiked) {
        await defaultLike.mutateAsync(post.id);
      } else {
        await defaultUnlike.mutateAsync(post.id);
      }
    } catch {
      // Revert on error
      setLiked(!nextLiked);
      setLikeCount(likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text || createCommentMutation.isPending) return;

    try {
      await createCommentMutation.mutateAsync(text);
      setCommentInput("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const mediaLocked = Boolean(post.locked || post.isLocked);
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-shadow hover:shadow-xs">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {post.category && (
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                {post.category}
              </span>
            )}
            {post.minTierRank > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                <Sparkles className="h-3 w-3" /> Tier {post.minTierRank}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Link
          href={`/client/${encodeURIComponent(slug)}/user/post/${post.id}`}
          className="group block"
        >
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt or Body */}
        {showFullContent && !mediaLocked ? (
          <div className="mt-4 text-slate-700 text-sm leading-relaxed prose prose-slate max-w-none">
            {post.body ? (
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>
        ) : (
          <p className="mt-2.5 text-slate-600 text-sm line-clamp-3 leading-relaxed">
            {post.excerpt ||
              (!mediaLocked && post.body
                ? post.body.replace(/<[^>]*>/g, "").slice(0, 200) + "..."
                : "")}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Attachments */}
      {!mediaLocked && post.attachments && post.attachments.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
          {post.attachments.map((att) => {
            const isVideo = att.mimeType?.startsWith("video/");
            const isImage = att.mimeType?.startsWith("image/");
            const isAudio = att.mimeType?.startsWith("audio/");

            if (isImage) {
              return (
                <div key={att.id} className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={att.signedUrl}
                    alt={att.caption || att.fileName || "Post attachment"}
                    className="w-full max-h-96 object-cover"
                  />
                  {att.caption && (
                    <p className="p-2 text-xs text-slate-500 italic bg-white">{att.caption}</p>
                  )}
                </div>
              );
            }

            if (isVideo) {
              if (att.provider === "api_video" && att.apiVideoId) {
                return (
                  <div key={att.id} className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                    <VideoPlayer videoId={att.apiVideoId} poster={att.thumbnailUrl || undefined} />
                    {att.caption && (
                      <p className="p-2 text-xs text-slate-300 italic bg-slate-900">{att.caption}</p>
                    )}
                  </div>
                );
              }

              return (
                <div key={att.id} className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                  <VideoPlayerLegacy src={att.signedUrl || ""} />
                  {att.caption && (
                    <p className="p-2 text-xs text-slate-300 italic bg-slate-900">{att.caption}</p>
                  )}
                </div>
              );
            }

            if (isAudio) {
              return (
                <div key={att.id} className="p-3 bg-white rounded-xl border border-slate-200">
                  <audio src={att.signedUrl} controls className="w-full h-10" />
                  {att.caption && (
                    <p className="mt-1 text-xs text-slate-500 italic">{att.caption}</p>
                  )}
                </div>
              );
            }

            // PDF or general document
            return (
              <a
                key={att.id}
                href={att.signedUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                      {att.fileName || "Document attachment"}
                    </p>
                    {att.caption && (
                      <p className="text-[11px] text-slate-400 truncate">{att.caption}</p>
                    )}
                  </div>
                </div>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
              </a>
            );
          })}
        </div>
      )}

      {/* External Embed (YouTube, Vimeo, etc.) */}
      {!mediaLocked && post.embedUrl && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4">
          <EmbedPlayer embedUrl={post.embedUrl} />
        </div>
      )}

      {/* Footer / Actions */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 py-1 px-2.5 rounded-full transition-colors",
              liked
                ? "text-red-600 bg-red-50 font-semibold"
                : "text-slate-500 hover:bg-slate-100 hover:text-red-500",
            )}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            <span>{likeCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDiscussion(!showDiscussion)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{commentsQuery.data?.comments?.length ?? post.commentCount ?? 0}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowDiscussion(!showDiscussion)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 inline-flex items-center gap-1"
        >
          <span>{showDiscussion ? "Hide discussion" : "View discussion"}</span>
          {showDiscussion ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Inline Discussion Section */}
      {showDiscussion && (
        <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
              <span>Discussion ({commentsQuery.data?.comments?.length ?? post.commentCount ?? 0})</span>
            </h3>
            <Link
              href={`/client/${encodeURIComponent(slug)}/user/post/${post.id}`}
              className="text-[11px] font-medium text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Full post view →
            </Link>
          </div>

          {commentsQuery.isLoading ? (
            <div className="flex items-center justify-center py-6 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2 text-indigo-600" />
              <span className="text-xs">Loading comments...</span>
            </div>
          ) : commentsQuery.data?.comments && commentsQuery.data.comments.length > 0 ? (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {commentsQuery.data.comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800">{comment.userName || "Member"}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">No comments yet. Start the conversation!</p>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!commentInput.trim() || createCommentMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs px-3 h-8 gap-1"
            >
              {createCommentMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              <span>Post</span>
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
