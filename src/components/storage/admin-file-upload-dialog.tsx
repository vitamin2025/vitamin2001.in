"use client";

import { useState, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useOrgs } from "@/lib/admin";
import { uploadFileHybrid } from "@/lib/storage";
import type { FileCategory, FileVisibility, FileRecord } from "@/types/storage";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

interface AdminFileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (record: FileRecord) => void;
  defaultClientId?: string;
}

export function AdminFileUploadDialog({
  open,
  onClose,
  onSuccess,
  defaultClientId = "system",
}: AdminFileUploadDialogProps) {
  const orgs = useOrgs({ page: 1, limit: 100, q: "" });
  const [clientId, setClientId] = useState(defaultClientId);
  const [category, setCategory] = useState<FileCategory>("general");
  const [visibility, setVisibility] = useState<FileVisibility>("public");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setError(null);
    setUploadProgress(0);

    try {
      const record = await uploadFileHybrid(
        selectedFile,
        {
          category,
          visibility,
          clientId: clientId === "system" ? undefined : clientId,
        },
        (pct) => setUploadProgress(pct),
      );
      setUploadProgress(null);
      onSuccess(record);
      onClose();
    } catch (err: unknown) {
      setUploadProgress(null);
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to upload file";
      setError(msg || "Failed to upload file");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Upload File to Storage"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={uploadProgress !== null}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            type="button"
            disabled={!selectedFile || uploadProgress !== null}
            onClick={handleUpload}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {uploadProgress !== null ? "Uploading..." : "Start Upload"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Target Client */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Target Organization / Tenant</label>
          <Select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            disabled={uploadProgress !== null}
            className="text-xs"
          >
            <option value="system">System (Platform Default)</option>
            {orgs.items.map((org) => (
              <option key={org.id} value={org.slug}>
                {org.name} ({org.slug})
              </option>
            ))}
          </Select>
        </div>

        {/* Category & Visibility */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as FileCategory)}
              disabled={uploadProgress !== null}
              className="text-xs"
            >
              <option value="general">General</option>
              <option value="avatars">Avatars (Max 5MB)</option>
              <option value="banners">Banners (Max 10MB)</option>
              <option value="documents">Documents (Max 50MB)</option>
              <option value="attachments">Attachments (Max 50MB)</option>
              <option value="exports">Exports (Max 100MB)</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Visibility</label>
            <Select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as FileVisibility)}
              disabled={uploadProgress !== null}
              className="text-xs"
            >
              <option value="public">Public (CDN URL)</option>
              <option value="private">Private (Signed URL)</option>
            </Select>
          </div>
        </div>

        {/* File Dropzone */}
        <div
          onClick={() => {
            if (uploadProgress === null && fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all"
        >
          {selectedFile ? (
            <div className="flex flex-col items-center space-y-1">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-1" />
              <p className="text-xs font-semibold text-slate-800">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || "unknown mime"}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="text-[11px] text-indigo-600 hover:underline pt-1"
              >
                Choose another file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs font-medium text-slate-700">Select file to upload</p>
              <p className="text-[11px] text-slate-400">
                Supports images, documents, spreadsheets, PDFs, and archives
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {uploadProgress !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Uploading to GCS...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-indigo-600 transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          disabled={uploadProgress !== null}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setSelectedFile(e.target.files[0]);
              setError(null);
            }
          }}
        />
      </div>
    </Dialog>
  );
}
