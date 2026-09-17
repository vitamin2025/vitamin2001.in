"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { SocialIcon, getSocialIcon } from "./social-icons";
import { useLinktreeSocialLinkCommands, type LinktreeSocialLink } from "@/lib/client-admin";
import { cn } from "@/lib/utils";

export const getPlatformIcon = getSocialIcon;

interface SocialLinkCardProps {
  socialLink: LinktreeSocialLink;
  onEdit: (link: LinktreeSocialLink) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SocialLinkCard({
  socialLink,
  onEdit,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: SocialLinkCardProps) {
  const { updateSocialLink, deleteSocialLink } = useLinktreeSocialLinkCommands();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: socialLink.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md",
        !socialLink.isEnabled && "bg-slate-50/60 opacity-80",
        isDragging && "shadow-lg ring-2 ring-indigo-500",
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          className="cursor-grab p-1 text-slate-400 hover:text-slate-700 active:cursor-grabbing"
          aria-label="Drag to reorder social link"
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
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-100 text-slate-700">
          <SocialIcon platform={socialLink.platform} className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="truncate text-sm font-semibold capitalize text-slate-900">
            {socialLink.platform}
          </p>
          <a
            href={socialLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex max-w-xs items-center gap-1 truncate text-xs text-slate-500 hover:text-indigo-600"
          >
            <span className="truncate">{socialLink.url}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(socialLink)}
          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-4 w-px bg-slate-200" />

        <div className="flex items-center px-1" title={socialLink.isEnabled ? "Disable" : "Enable"}>
          <Switch
            checked={socialLink.isEnabled}
            onCheckedChange={() => {
              void updateSocialLink.run({
                socialLinkId: socialLink.id,
                data: { position: socialLink.position },
              });
            }}
            disabled={updateSocialLink.state.status === "running"}
            aria-label="Toggle social link visibility"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <DeleteConfirmDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Delete this social link?"
          description={`Are you sure you want to remove your ${socialLink.platform} link?`}
          running={deleteSocialLink.state.status === "running"}
          onConfirm={() => deleteSocialLink.run({ socialLinkId: socialLink.id })}
        />
      </div>
    </div>
  );
}
