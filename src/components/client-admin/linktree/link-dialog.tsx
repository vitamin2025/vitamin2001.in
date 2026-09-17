"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLinktreeLinkCommands, type LinktreeLink } from "@/lib/client-admin";

interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  link?: LinktreeLink | null;
}

function LinkForm({
  link,
  onClose,
}: {
  link?: LinktreeLink | null;
  onClose: () => void;
}) {
  const { addLink, updateLink } = useLinktreeLinkCommands();
  const isEditing = Boolean(link);

  const [title, setTitle] = useState(link?.title || "");
  const [originalUrl, setOriginalUrl] = useState(link?.originalUrl || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(link?.thumbnailUrl || "");
  const [tags, setTags] = useState(link?.tags ? link.tags.join(", ") : "");
  const [scheduledStart, setScheduledStart] = useState(
    link?.scheduledStart ? link.scheduledStart.slice(0, 16) : "",
  );
  const [scheduledEnd, setScheduledEnd] = useState(
    link?.scheduledEnd ? link.scheduledEnd.slice(0, 16) : "",
  );

  const command = isEditing ? updateLink : addLink;
  const isRunning = command.state.status === "running";
  const fieldErrors = command.fieldErrors;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (isEditing && link) {
        await updateLink.run({
          linkId: link.id,
          data: {
            title,
            originalUrl,
            thumbnailUrl: thumbnailUrl || null,
            tags: tagArray,
            scheduledStart: scheduledStart ? new Date(scheduledStart).toISOString() : null,
            scheduledEnd: scheduledEnd ? new Date(scheduledEnd).toISOString() : null,
          },
        });
      } else {
        await addLink.run({
          title,
          originalUrl,
          thumbnailUrl: thumbnailUrl || undefined,
          tags: tagArray,
          scheduledStart: scheduledStart ? new Date(scheduledStart).toISOString() : null,
          scheduledEnd: scheduledEnd ? new Date(scheduledEnd).toISOString() : null,
        });
      }
      onClose();
    } catch {
      // Error handled by command state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fieldErrors?._form && (
        <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-700">
          {fieldErrors._form.join(", ")}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="link-title" className="text-xs font-semibold text-slate-700">
          Link Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="link-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Visit Our Website, Discord Community..."
        />
        {fieldErrors?.title && (
          <p className="text-xs text-red-600">{fieldErrors.title.join(", ")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="link-url" className="text-xs font-semibold text-slate-700">
          Destination URL <span className="text-red-500">*</span>
        </Label>
        <Input
          id="link-url"
          type="url"
          required
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/target-page"
        />
        {fieldErrors?.originalUrl && (
          <p className="text-xs text-red-600">{fieldErrors.originalUrl.join(", ")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="link-thumb" className="text-xs font-semibold text-slate-700">
          Thumbnail / Icon Image URL (optional)
        </Label>
        <Input
          id="link-thumb"
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://example.com/icon.png"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="link-tags" className="text-xs font-semibold text-slate-700">
          Tags (comma separated, optional)
        </Label>
        <Input
          id="link-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="social, shop, community"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <Label htmlFor="sched-start" className="text-xs font-semibold text-slate-700">
            Schedule Start
          </Label>
          <Input
            id="sched-start"
            type="datetime-local"
            value={scheduledStart}
            onChange={(e) => setScheduledStart(e.target.value)}
            className="text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sched-end" className="text-xs font-semibold text-slate-700">
            Schedule End
          </Label>
          <Input
            id="sched-end"
            type="datetime-local"
            value={scheduledEnd}
            onChange={(e) => setScheduledEnd(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isRunning}>
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          type="submit"
          disabled={isRunning || !title || !originalUrl}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isRunning ? "Saving..." : isEditing ? "Save Changes" : "Create Link"}
        </Button>
      </div>
    </form>
  );
}

export function LinkDialog({ open, onClose, link }: LinkDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={link ? "Edit Link" : "Add New Link"}
    >
      {open && (
        <LinkForm
          key={link?.id ?? "new"}
          link={link}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}
