"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  FileText,
  Film,
  Music,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { uploadFileHybrid } from "@/lib/storage";
import { uploadVideoToApiVideo } from "@/lib/storage/video-upload";

export interface AttachedFileItem {
  fileRecordId: string;
  position?: number;
  caption?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
}

interface PostAttachmentUploadProps {
  attachments: AttachedFileItem[];
  onChange: (items: AttachedFileItem[]) => void;
  orgId?: string;
  maxFiles?: number;
}

export function PostAttachmentUpload({
  attachments = [],
  onChange,
  orgId,
  maxFiles = 5,
}: PostAttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (attachments.length + files.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} attachments allowed per post.`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const newItems: AttachedFileItem[] = [...attachments];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv|avi|m4v)$/i);

        let fileRecordId: string;
        let fileName: string;
        let mimeType: string;
        let sizeBytes: number;

        if (isVideo) {
          const result = await uploadVideoToApiVideo(
            file,
            { clientId: orgId },
            (p) => {
              const overall = Math.round(((i + p / 100) / files.length) * 100);
              setProgress(overall);
            },
          );
          fileRecordId = result.fileRecord.id;
          fileName = result.fileRecord.fileName || file.name;
          mimeType = result.fileRecord.mimeType || file.type || "video/mp4";
          sizeBytes = result.fileRecord.sizeBytes || file.size;
        } else {
          const record = await uploadFileHybrid(
            file,
            {
              category: "posts",
              visibility: "private",
              clientId: orgId,
            },
            (p) => {
              const overall = Math.round(((i + p / 100) / files.length) * 100);
              setProgress(overall);
            },
          );
          fileRecordId = record.id;
          fileName = record.fileName || file.name;
          mimeType = record.mimeType || file.type;
          sizeBytes = record.sizeBytes || file.size;
        }

        newItems.push({
          fileRecordId,
          position: newItems.length,
          fileName,
          mimeType,
          sizeBytes,
          caption: "",
        });
      }

      onChange(newItems);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file(s).");
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const next = attachments.filter((_, idx) => idx !== index);
    const reindexed = next.map((item, idx) => ({ ...item, position: idx }));
    onChange(reindexed);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const next = [...attachments];
    next[index] = { ...next[index], caption };
    onChange(next);
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="h-5 w-5 text-slate-400" />;
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (mimeType.startsWith("video/")) return <Film className="h-5 w-5 text-purple-500" />;
    if (mimeType.startsWith("audio/")) return <Music className="h-5 w-5 text-emerald-500" />;
    return <FileText className="h-5 w-5 text-amber-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-900">
          Media Attachments (Videos powered by api.video)
        </label>
        <span className="text-xs text-slate-500">
          {attachments.length} of {maxFiles} max
        </span>
      </div>

      {attachments.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*,video/*,audio/mpeg,audio/wav,application/pdf"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium text-slate-700">
                Uploading securely ({progress}%)...
              </p>
              <div className="w-48 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <UploadCloud className="h-9 w-9 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">
                Click to upload images, video, audio, or PDF
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Videos are streamed via api.video; other files stored securely in cloud storage
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((item, index) => (
            <div
              key={item.fileRecordId || index}
              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-2xs"
            >
              <div className="shrink-0">{getFileIcon(item.mimeType)}</div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {item.fileName || item.fileRecordId}
                  </p>
                  <span className="text-xs text-slate-400">
                    {item.sizeBytes ? `${Math.round(item.sizeBytes / 1024)} KB` : "Private"}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Add a caption (optional)"
                  value={item.caption || ""}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  className="mt-1 w-full text-xs text-slate-600 border border-slate-200 rounded px-2 py-1 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="shrink-0 p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 transition-colors"
                title="Remove attachment"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
