"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MediaLibraryDialog } from "./media-library-dialog";
import { uploadFileHybrid } from "@/lib/storage";
import type { FileCategory, FileVisibility } from "@/types/storage";
import {
  UploadCloud,
  FolderOpen,
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

interface MediaUploadFieldProps {
  label?: string;
  description?: string;
  value?: string | null;
  onChange: (url: string) => void;
  category?: FileCategory | string;
  visibility?: FileVisibility;
  clientId?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  aspectRatio?: "square" | "banner" | "auto";
  compact?: boolean;
  name?: string;
  placeholder?: string;
}

export function MediaUploadField({
  label,
  description,
  value,
  onChange,
  category = "avatars",
  visibility = "public",
  clientId,
  error,
  disabled = false,
  aspectRatio = "auto",
  compact = false,
  name,
  placeholder = "https://example.com/image.png",
}: MediaUploadFieldProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "url">("upload");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);
    setUploadProgress(0);

    try {
      const record = await uploadFileHybrid(
        file,
        {
          category,
          visibility,
          clientId,
        },
        (pct) => setUploadProgress(pct),
      );

      if (record.url) {
        onChange(record.url);
      }
      setUploadProgress(null);
    } catch (err: unknown) {
      setUploadProgress(null);
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to upload file";
      setUploadError(msg || "Failed to upload file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.[0]) {
      void handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const previewRadius = aspectRatio === "square" ? "rounded-full" : "rounded-lg";

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">{label}</label>
          {description && <span className="text-[11px] text-slate-400">{description}</span>}
        </div>
      )}

      {/* Hidden input for standard form submission if name prop provided */}
      {name && <input type="hidden" name={name} value={value || ""} />}

      {/* Current asset preview & action toolbar */}
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
          <div
            className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white ${previewRadius}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Asset preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                // fallback icon if image fails to render
                e.currentTarget.style.display = "none";
              }}
            />
            <ImageIcon className="h-6 w-6 text-slate-400" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{value}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                disabled={disabled}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                Replace file
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                disabled={disabled}
                className="text-[11px] font-medium text-slate-600 hover:text-slate-800 disabled:opacity-50"
              >
                Browse library
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={disabled}
                className="inline-flex items-center text-[11px] font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <X className="mr-0.5 h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Mode Selector */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs text-slate-600 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                activeTab === "upload" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Upload
            </button>
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium hover:text-slate-900 transition-all"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                activeTab === "url" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Direct URL
            </button>
          </div>

          {/* Mode 1: Drag & Drop Dropzone */}
          {activeTab === "upload" && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => {
                if (!disabled && uploadProgress === null && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
              } ${compact ? "py-3" : "py-5"}`}
            >
              <UploadCloud className="h-7 w-7 text-slate-400 mb-1.5" />
              <p className="text-xs font-medium text-slate-700">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-slate-400">
                PNG, JPG, WebP, SVG up to 10MB
              </p>

              {uploadProgress !== null && (
                <div className="mt-3 w-full max-w-xs space-y-1">
                  <div className="flex justify-between text-[10px] font-medium text-slate-600">
                    <span>Uploading to Google Cloud Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Direct URL Input */}
          {activeTab === "url" && (
            <div className="flex items-center gap-2">
              <Input
                type="url"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="text-xs"
              />
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg,.pdf,.docx,.xlsx"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            void handleFile(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />

      {uploadError && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {uploadError}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Media Library Selection Modal */}
      <MediaLibraryDialog
        open={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setIsLibraryOpen(false);
        }}
        category={category}
        clientId={clientId}
      />
    </div>
  );
}
