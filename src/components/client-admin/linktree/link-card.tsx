"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  GripVertical,
  Link as LinkIcon,
  MousePointerClick,
  Pencil,
  QrCode,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { useLinktreeLinkCommands, type LinktreeLink } from "@/lib/client-admin";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  link: LinktreeLink;
  onEdit: (link: LinktreeLink) => void;
  onQr: (link: LinktreeLink) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function LinkCard({
  link,
  onEdit,
  onQr,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: LinkCardProps) {
  const { toggleLink, deleteLink } = useLinktreeLinkCommands();
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  const isScheduled =
    Boolean(link.scheduledStart && new Date(link.scheduledStart) > new Date()) ||
    Boolean(link.scheduledEnd && new Date(link.scheduledEnd) < new Date());

  const isExpired = Boolean(link.scheduledEnd && new Date(link.scheduledEnd) < new Date());

  const handleCopyShort = async () => {
    const target = link.shortUrl || link.originalUrl;
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md md:flex-row md:items-center md:justify-between",
        !link.isEnabled && "bg-slate-50/60 opacity-80",
        isDragging && "shadow-lg ring-2 ring-indigo-500",
      )}
    >
      <div className="flex items-start gap-3 md:items-center min-w-0 flex-1">
        {/* Drag handle & arrow controls */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            className="cursor-grab p-1 text-slate-400 hover:text-slate-700 active:cursor-grabbing"
            aria-label="Drag to reorder link"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="flex flex-col md:hidden">
            <button
              type="button"
              disabled={isFirst}
              onClick={onMoveUp}
              className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={onMoveDown}
              className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Thumbnail or Fallback Icon */}
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-100 text-slate-500">
          {link.thumbnailUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={link.thumbnailUrl}
              alt={link.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <LinkIcon className="h-5 w-5" />
          )}
        </div>

        {/* Link Info */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {link.title}
            </h3>
            {isExpired ? (
              <Badge variant="outline" className="border-red-200 bg-red-50 text-[10px] text-red-700">
                Expired
              </Badge>
            ) : isScheduled ? (
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-700">
                <Calendar className="mr-1 h-2.5 w-2.5" /> Scheduled
              </Badge>
            ) : !link.isEnabled ? (
              <Badge variant="outline" className="border-slate-200 bg-slate-100 text-[10px] text-slate-500">
                Disabled
              </Badge>
            ) : null}

            {link.tags && link.tags.length > 0 && (
              <div className="hidden sm:flex gap-1">
                {link.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex max-w-[220px] sm:max-w-xs items-center gap-1 truncate hover:text-indigo-600"
            >
              <span className="truncate">{link.originalUrl}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>

            {link.shortUrl && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={handleCopyShort}
                  className="flex items-center gap-1 font-mono text-[11px] text-indigo-600 hover:underline"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{link.shortUrl.replace(/^https?:\/\//, "")}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right controls: Clicks, Toggle, QR, Edit, Delete */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2 md:border-0 md:pt-0">
        {/* Click counter */}
        <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
          <MousePointerClick className="h-3.5 w-3.5 text-slate-400" />
          <span>{link.totalClicks ?? 0}</span>
          <span className="hidden sm:inline text-slate-400">clicks</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQr(link)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600"
            title="View QR Code"
          >
            <QrCode className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(link)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
            title="Edit Link"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          {/* Toggle Switch */}
          <div className="flex items-center px-1" title={link.isEnabled ? "Disable link" : "Enable link"}>
            <Switch
              checked={link.isEnabled}
              onCheckedChange={(checked) => {
                void toggleLink.run({ linkId: link.id, isEnabled: checked });
              }}
              disabled={toggleLink.state.status === "running"}
              aria-label="Toggle link visibility"
            />
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
            title="Delete Link"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <DeleteConfirmDialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            title="Delete this link?"
            description={`Are you sure you want to delete "${link.title}"? The shortened link will stop working.`}
            running={deleteLink.state.status === "running"}
            onConfirm={() => deleteLink.run({ linkId: link.id })}
          />
        </div>
      </div>
    </div>
  );
}
