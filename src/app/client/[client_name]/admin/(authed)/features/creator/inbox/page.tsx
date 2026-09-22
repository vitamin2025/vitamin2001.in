"use client";

import { use, useState } from "react";
import { useCreatorInbox, useReplyToThread } from "@/lib/client-admin/creator";

export default function CreatorInboxPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);
  const inbox = useCreatorInbox(slug);
  const reply = useReplyToThread(slug);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Inbox</h2>
        <p className="text-sm text-slate-500">Messages from patrons whose tier allows direct messages.</p>
      </div>
      {inbox.isLoading ? <p className="text-sm text-slate-500">Loading inbox…</p> : null}
      {inbox.isError ? <p className="text-sm text-red-600">Inbox could not be loaded.</p> : null}
      {(inbox.data?.threads ?? []).length === 0 && !inbox.isLoading ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">No messages yet.</p>
      ) : null}
      <ul className="space-y-3">
        {(inbox.data?.threads ?? []).map((thread) => (
          <li key={thread.threadId} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-800">{thread.lastBody}</p>
            <p className="mt-1 text-xs text-slate-500">{thread.unread} unread</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const body = drafts[thread.threadId]?.trim();
                if (!body) return;
                reply.mutate(
                  { threadId: thread.threadId, body },
                  { onSuccess: () => setDrafts((prev) => ({ ...prev, [thread.threadId]: "" })) },
                );
              }}
            >
              <input
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={drafts[thread.threadId] ?? ""}
                onChange={(event) =>
                  setDrafts((prev) => ({ ...prev, [thread.threadId]: event.target.value }))
                }
                placeholder="Reply"
              />
              <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
                Send
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
