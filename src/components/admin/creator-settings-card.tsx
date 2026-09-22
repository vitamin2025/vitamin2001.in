"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/admin/field";
import { adminHttp } from "@/lib/admin/http";
import { asOrgId, useOrg } from "@/lib/admin";
import { Sparkles, Check, AlertCircle, Loader2 } from "lucide-react";

interface CreatorSettingsCardProps {
  orgId: string;
}

export function CreatorSettingsCard({ orgId }: CreatorSettingsCardProps) {
  const org = useOrg(asOrgId(orgId));
  const [enabled, setEnabled] = useState(false);
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(50);
  const [maxFilesPerPost, setMaxFilesPerPost] = useState(5);
  const [allowedTypes, setAllowedTypes] = useState<string[]>([
    "image/*",
    "video/*",
    "audio/*",
    "application/pdf",
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (org.item) {
      const extra = org.item.extraMetadata || {};
      const features = (extra.enabledFeatures as string[]) || [];
      setEnabled(features.includes("creator"));

      const settings = (extra.creatorSettings as Record<string, any>) || {};
      if (settings.maxFileSizeBytes) {
        setMaxFileSizeMb(Math.round(settings.maxFileSizeBytes / (1024 * 1024)));
      }
      if (settings.maxFilesPerPost) {
        setMaxFilesPerPost(settings.maxFilesPerPost);
      }
      if (Array.isArray(settings.allowedMimeTypes)) {
        setAllowedTypes(settings.allowedMimeTypes);
      }
    }
  }, [org.item]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org.item) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const currentMeta = { ...(org.item.extraMetadata || {}) };
      const currentFeatures = Array.isArray(currentMeta.enabledFeatures)
        ? [...currentMeta.enabledFeatures]
        : [];

      let updatedFeatures: string[];
      if (enabled) {
        updatedFeatures = currentFeatures.includes("creator")
          ? currentFeatures
          : [...currentFeatures, "creator"];
      } else {
        updatedFeatures = currentFeatures.filter((f) => f !== "creator");
      }

      const updatedMeta = {
        ...currentMeta,
        enabledFeatures: updatedFeatures,
        creatorSettings: {
          maxFileSizeBytes: maxFileSizeMb * 1024 * 1024,
          maxFilesPerPost,
          allowedMimeTypes: allowedTypes,
        },
      };

      await adminHttp.patch(`/organizations/${orgId}`, {
        metadata: JSON.stringify(updatedMeta),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      void org.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to update creator settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleMime = (mime: string) => {
    setAllowedTypes((prev) =>
      prev.includes(mime) ? prev.filter((t) => t !== mime) : [...prev, mime]
    );
  };

  return (
    <form
      onSubmit={handleSave}
      className="max-w-lg space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Creator Platform Settings</h3>
            <p className="text-xs text-slate-500">Patreon-style creator access and upload caps</p>
          </div>
        </div>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            enabled ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
          }`}
        >
          {enabled ? "Active" : "Disabled"}
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          id="creator-feature-toggle"
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="creator-feature-toggle" className="text-sm font-medium text-slate-700 cursor-pointer">
          Enable &apos;creator&apos; feature for this organization
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Max File Size (MB)">
          <Input
            type="number"
            min={1}
            max={500}
            value={maxFileSizeMb}
            onChange={(e) => setMaxFileSizeMb(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </Field>
        <Field label="Max Files Per Post">
          <Input
            type="number"
            min={1}
            max={20}
            value={maxFilesPerPost}
            onChange={(e) => setMaxFilesPerPost(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </Field>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Allowed Media Formats
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
          {[
            { label: "Images (JPEG, PNG, WebP, GIF)", mime: "image/*" },
            { label: "Videos (MP4, WebM, MOV)", mime: "video/*" },
            { label: "Audio (MP3, WAV, AAC)", mime: "audio/*" },
            { label: "Documents (PDF)", mime: "application/pdf" },
          ].map((item) => (
            <label key={item.mime} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowedTypes.includes(item.mime)}
                onChange={() => toggleMime(item.mime)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Creator Settings"
          )}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <Check className="w-3.5 h-3.5" /> Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}
