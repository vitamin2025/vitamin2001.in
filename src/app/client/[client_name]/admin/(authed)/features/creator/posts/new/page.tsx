"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";
import {
  useCreateCreatorPost,
  useCreatorTiers,
} from "@/lib/client-admin/creator";
import {
  PostAttachmentUpload,
  type AttachedFileItem,
} from "@/components/creator/post-attachment-upload";

export default function NewPostPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);
  const router = useRouter();

  const { data: tiers = [] } = useCreatorTiers(slug);
  const createPostMutation = useCreateCreatorPost(slug);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [minTierRank, setMinTierRank] = useState<number>(0);
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [scheduledPublishAt, setScheduledPublishAt] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachedFileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const basePath = `/client/${encodeURIComponent(slug)}/admin/features/creator/posts`;

  const handleSubmit = async (publishImmediate = false) => {
    if (!title.trim()) {
      setError("Post title is required.");
      return;
    }

    const postStatus = publishImmediate ? "published" : status;
    if (postStatus === "scheduled" && !scheduledPublishAt) {
      setError("Please select a date and time for scheduled publishing.");
      return;
    }

    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await createPostMutation.mutateAsync({
        title: title.trim(),
        body: body.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        minTierRank: Number(minTierRank),
        status: postStatus,
        scheduledPublishAt:
          postStatus === "scheduled" && scheduledPublishAt
            ? new Date(scheduledPublishAt).toISOString()
            : undefined,
        category: category.trim() || undefined,
        tags: tags.length ? tags : undefined,
        embedUrl: embedUrl.trim() || undefined,
        attachments: attachments.map((att, idx) => ({
          fileRecordId: att.fileRecordId,
          position: att.position ?? idx,
          caption: att.caption || undefined,
        })),
      });

      router.push(basePath);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to create post.");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={basePath}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Post</h2>
            <p className="text-xs text-slate-500">Draft, schedule, or publish new tiered content</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={createPostMutation.isPending}
            onClick={() => handleSubmit(false)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Save className="h-4 w-4" /> Save as {status === "scheduled" ? "Scheduled" : "Draft"}
          </button>
          <button
            type="button"
            disabled={createPostMutation.isPending}
            onClick={() => handleSubmit(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            {createPostMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Publish Now
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Fields */}
        <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Behind the Scenes: New Charcoal Sketch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base font-semibold border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Post Body (Rich Content)
            </label>
            <textarea
              rows={8}
              placeholder="Write your story, design notes, instructions, or article here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teaser Excerpt (Public Preview)
            </label>
            <textarea
              rows={2}
              maxLength={500}
              placeholder="Short preview visible to visitors and locked patrons before joining..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-xs text-slate-600 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Leave blank to automatically truncate from post body
            </p>
          </div>

          {/* Media Attachments */}
          <div className="pt-2 border-t border-slate-100">
            <PostAttachmentUpload
              attachments={attachments}
              onChange={setAttachments}
              maxFiles={5}
            />
          </div>
        </div>

        {/* Post Settings & Gating Sidebar */}
        <div className="space-y-5">
          {/* Access Gating Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Access Control & Entitlement
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Tier Required
              </label>
              <select
                value={minTierRank}
                onChange={(e) => setMinTierRank(parseInt(e.target.value, 10))}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value={0}>Public (Free for everyone)</option>
                {tiers
                  .filter((t) => t.rank > 0)
                  .map((t) => (
                    <option key={t.id} value={t.rank}>
                      Level {t.rank}+ ({t.name})
                    </option>
                  ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Subscribers with equal or higher tier rank will be able to unlock this post.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="draft">Draft (Saved only to admin)</option>
                <option value="published">Published (Visible immediately)</option>
                <option value="scheduled">Scheduled (Evaluated at read-time)</option>
              </select>
            </div>

            {status === "scheduled" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheduled Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledPublishAt}
                  onChange={(e) => setScheduledPublishAt(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Post unlocks automatically when this timestamp passes.
                </p>
              </div>
            )}
          </div>

          {/* Taxonomies Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories & Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Announcements, Sketches, VIP"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="art, wip, charcoal, 4k"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Embed / Video URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://vimeo.com/... or unlisted YouTube"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
