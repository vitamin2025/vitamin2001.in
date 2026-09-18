"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useStorageFiles } from "@/lib/storage";
import type { FileRecord } from "@/types/storage";
import { Check, FileText, Image as ImageIcon, Search } from "lucide-react";

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, file: FileRecord) => void;
  category?: string;
  clientId?: string;
  title?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryDialog({
  open,
  onClose,
  onSelect,
  category: initialCategory = "all",
  clientId,
  title = "Select Media",
}: MediaLibraryDialogProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  const { data, isLoading } = useStorageFiles(
    {
      page: 1,
      limit: 50,
      search: search || undefined,
      category: category === "all" ? undefined : category,
      clientId,
    },
    open,
  );

  const handleConfirm = () => {
    if (selectedFile?.url) {
      onSelect(selectedFile.url, selectedFile);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="text-xs text-slate-500 truncate max-w-[200px]">
            {selectedFile ? selectedFile.originalName : "No file selected"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              type="button"
              disabled={!selectedFile}
              onClick={handleConfirm}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Select File
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="pl-8 text-xs"
            />
          </div>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-36 text-xs"
          >
            <option value="all">All categories</option>
            <option value="avatars">Avatars</option>
            <option value="banners">Banners</option>
            <option value="documents">Documents</option>
            <option value="attachments">Attachments</option>
            <option value="exports">Exports</option>
            <option value="general">General</option>
          </Select>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <LoadingSpinner text="Loading files..." />
          </div>
        ) : !data?.items.length ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 p-6 text-center">
            <ImageIcon className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">No files found</p>
            <p className="text-xs text-slate-400">Upload a file or adjust search filters</p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto pr-1">
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {data.items.map((file) => {
                const isSelected = selectedFile?.id === file.id;
                const isImage = file.mimeType.startsWith("image/");

                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelectedFile(file)}
                    onDoubleClick={() => {
                      if (file.url) {
                        onSelect(file.url, file);
                        onClose();
                      }
                    }}
                    className={`group relative flex flex-col items-center overflow-hidden rounded-lg border p-1.5 text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded bg-slate-100">
                      {isImage && file.url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={file.url}
                          alt={file.originalName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileText className="h-7 w-7 text-slate-400" />
                      )}
                      {isSelected && (
                        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="mt-1.5 w-full">
                      <p className="truncate text-[11px] font-medium text-slate-800" title={file.originalName}>
                        {file.originalName}
                      </p>
                      <p className="text-[10px] text-slate-400">{formatBytes(file.sizeBytes)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
