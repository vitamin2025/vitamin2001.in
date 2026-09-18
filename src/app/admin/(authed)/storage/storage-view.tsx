"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { AdminFileUploadDialog } from "@/components/storage/admin-file-upload-dialog";
import { useOrgs } from "@/lib/admin";
import { useStorageFiles, useDeleteStorageFile, fetchFreshUrl } from "@/lib/storage";
import type { FileRecord, FileVisibility } from "@/types/storage";
import {
  UploadCloud,
  Search,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  FileText,
  HardDrive,
  Eye,
} from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | Date): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

export function StorageView() {
  const orgs = useOrgs({ page: 1, limit: 100, q: "" });
  const [clientId, setClientId] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [visibility, setVisibility] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<FileRecord | null>(null);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const deleteMutation = useDeleteStorageFile();

  const { data, isLoading, refetch } = useStorageFiles({
    page,
    limit: 20,
    clientId: clientId === "all" ? undefined : clientId,
    category: category === "all" ? undefined : category,
    visibility: visibility === "all" ? undefined : (visibility as FileVisibility),
    search: search || undefined,
  });

  const handleCopyUrl = async (file: FileRecord) => {
    try {
      let targetUrl = file.url;
      if (!targetUrl || file.visibility === "private") {
        const fresh = await fetchFreshUrl(file.id);
        targetUrl = fresh.url;
      }
      if (targetUrl) {
        await navigator.clipboard.writeText(targetUrl);
        setCopiedId(file.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      await deleteMutation.mutateAsync(fileToDelete.id);
      setFileToDelete(null);
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  const totalPages = data?.meta.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          title="Storage & Media"
          description="Manage tenant partitions, uploaded media files, and Google Cloud Storage contents."
        />
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 w-fit shrink-0"
        >
          <UploadCloud className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by file name..."
            className="pl-8 text-xs"
          />
        </div>

        {/* Tenant / Client Filter */}
        <div className="w-48">
          <Select
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setPage(1);
            }}
            className="text-xs"
          >
            <option value="all">All Organizations</option>
            <option value="system">system</option>
            {orgs.items.map((org) => (
              <option key={org.id} value={org.slug}>
                {org.name} ({org.slug})
              </option>
            ))}
          </Select>
        </div>

        {/* Category Filter */}
        <div className="w-36">
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="text-xs"
          >
            <option value="all">All Categories</option>
            <option value="avatars">Avatars</option>
            <option value="banners">Banners</option>
            <option value="documents">Documents</option>
            <option value="attachments">Attachments</option>
            <option value="exports">Exports</option>
            <option value="general">General</option>
          </Select>
        </div>

        {/* Visibility Filter */}
        <div className="w-32">
          <Select
            value={visibility}
            onChange={(e) => {
              setVisibility(e.target.value);
              setPage(1);
            }}
            className="text-xs"
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Select>
        </div>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <LoadingSpinner text="Loading storage files..." />
        </div>
      ) : !data?.items.length ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <HardDrive className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">No files found in storage</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            No files match your current filters. Upload a new file or adjust your search.
          </p>
          <Button
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="mt-4 gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Upload File
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Tenant / Client</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Visibility</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((file) => {
                  const isImage = file.mimeType.startsWith("image/");

                  return (
                    <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* File Name & Preview */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => setPreviewFile(file)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            {isImage && file.url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={file.url}
                                alt={file.originalName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FileText className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p
                              className="truncate font-medium text-slate-900 hover:text-indigo-600 cursor-pointer"
                              onClick={() => setPreviewFile(file)}
                              title={file.originalName}
                            >
                              {file.originalName}
                            </p>
                            <p className="truncate text-[10px] text-slate-400" title={file.gcsPath}>
                              {file.gcsPath}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tenant */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-semibold text-slate-700">
                          {file.clientId}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="capitalize text-[10px]">
                          {file.category}
                        </Badge>
                      </td>

                      {/* Visibility */}
                      <td className="px-4 py-3">
                        <Badge
                          variant={file.visibility === "public" ? "success" : "default"}
                          className="capitalize text-[10px]"
                        >
                          {file.visibility}
                        </Badge>
                      </td>

                      {/* Size */}
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {formatBytes(file.sizeBytes)}
                      </td>

                      {/* Uploaded */}
                      <td className="px-4 py-3 text-[11px] text-slate-500 whitespace-nowrap">
                        {formatDate(file.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            title="Preview file details"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(file)}
                            title="Copy URL"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          >
                            {copiedId === file.id ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          {file.url && (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open in new tab"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            title="Delete file"
                            className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500">
            <div>
              Showing <span className="font-medium">{data.items.length}</span> of{" "}
              <span className="font-medium">{data.meta.total}</span> files
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload Dialog */}
      <AdminFileUploadDialog
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          void refetch();
        }}
        defaultClientId={clientId === "all" ? "system" : clientId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(fileToDelete)}
        onClose={() => setFileToDelete(null)}
        title="Delete File from Storage"
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFileToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{fileToDelete?.originalName}</span>?
          </p>
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
            This action cannot be undone. The file will be permanently removed from Google Cloud Storage and cannot be recovered.
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Path: {fileToDelete?.gcsPath}
          </p>
        </div>
      </Dialog>

      {/* File Details & Full Preview Dialog */}
      <Dialog
        open={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        title="File Details"
        footer={
          <div className="flex w-full items-center justify-between">
            {previewFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyUrl(previewFile)}
                className="gap-1.5 text-xs"
              >
                {copiedId === previewFile.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Copied URL
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Fresh URL
                  </>
                )}
              </Button>
            )}
            <Button variant="default" size="sm" onClick={() => setPreviewFile(null)}>
              Close
            </Button>
          </div>
        }
      >
        {previewFile && (
          <div className="space-y-4">
            {previewFile.mimeType.startsWith("image/") && previewFile.url && (
              <div className="flex max-h-64 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewFile.url}
                  alt={previewFile.originalName}
                  className="max-h-56 max-w-full rounded object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-medium text-slate-500">File Name:</span>
                <p className="font-semibold text-slate-900 break-all">{previewFile.originalName}</p>
              </div>
              <div>
                <span className="font-medium text-slate-500">Client / Tenant:</span>
                <p className="font-semibold text-slate-900">{previewFile.clientId}</p>
              </div>
              <div>
                <span className="font-medium text-slate-500">Category:</span>
                <p className="font-semibold text-slate-900 capitalize">{previewFile.category}</p>
              </div>
              <div>
                <span className="font-medium text-slate-500">Visibility:</span>
                <p className="font-semibold text-slate-900 capitalize">{previewFile.visibility}</p>
              </div>
              <div>
                <span className="font-medium text-slate-500">Size:</span>
                <p className="font-semibold text-slate-900">{formatBytes(previewFile.sizeBytes)}</p>
              </div>
              <div>
                <span className="font-medium text-slate-500">MIME Type:</span>
                <p className="font-semibold text-slate-900">{previewFile.mimeType}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-slate-500">GCS Path:</span>
                <p className="font-mono text-[11px] text-slate-700 break-all">{previewFile.gcsPath}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
