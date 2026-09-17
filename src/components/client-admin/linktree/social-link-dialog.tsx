"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useLinktreeSocialLinkCommands, type LinktreeSocialLink } from "@/lib/client-admin";

export const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "X / Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "discord", label: "Discord" },
  { value: "twitch", label: "Twitch" },
  { value: "spotify", label: "Spotify" },
  { value: "snapchat", label: "Snapchat" },
  { value: "pinterest", label: "Pinterest" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "email", label: "Email" },
  { value: "website", label: "Personal Website" },
];

interface SocialLinkDialogProps {
  open: boolean;
  onClose: () => void;
  socialLink?: LinktreeSocialLink | null;
}

function SocialLinkForm({
  socialLink,
  onClose,
}: {
  socialLink?: LinktreeSocialLink | null;
  onClose: () => void;
}) {
  const { addSocialLink, updateSocialLink } = useLinktreeSocialLinkCommands();
  const isEditing = Boolean(socialLink);

  const [platform, setPlatform] = useState(socialLink?.platform || "instagram");
  const [url, setUrl] = useState(socialLink?.url || "");

  const command = isEditing ? updateSocialLink : addSocialLink;
  const isRunning = command.state.status === "running";
  const fieldErrors = command.fieldErrors;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && socialLink) {
        await updateSocialLink.run({
          socialLinkId: socialLink.id,
          data: { platform, url },
        });
      } else {
        await addSocialLink.run({ platform, url });
      }
      onClose();
    } catch {
      // Error handled by command
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
        <Label htmlFor="social-platform" className="text-xs font-semibold text-slate-700">
          Platform <span className="text-red-500">*</span>
        </Label>
        <Select
          id="social-platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {SOCIAL_PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="social-url" className="text-xs font-semibold text-slate-700">
          Profile URL or Handle <span className="text-red-500">*</span>
        </Label>
        <Input
          id="social-url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={
            platform === "email"
              ? "mailto:hello@example.com"
              : platform === "whatsapp"
                ? "https://wa.me/1234567890"
                : `https://${platform}.com/yourhandle`
          }
        />
        {fieldErrors?.url && (
          <p className="text-xs text-red-600">{fieldErrors.url.join(", ")}</p>
        )}
      </div>

      <div className="flex w-full items-center justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isRunning}>
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          type="submit"
          disabled={isRunning || !url}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isRunning ? "Saving..." : isEditing ? "Save Changes" : "Add Link"}
        </Button>
      </div>
    </form>
  );
}

export function SocialLinkDialog({ open, onClose, socialLink }: SocialLinkDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={socialLink ? "Edit Social Link" : "Add Social Platform Link"}
    >
      {open && (
        <SocialLinkForm
          key={socialLink?.id ?? "new"}
          socialLink={socialLink}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}
