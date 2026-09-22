export type FileCategory =
  | "avatars"
  | "banners"
  | "documents"
  | "attachments"
  | "exports"
  | "general"
  | "posts";

export type FileVisibility = "public" | "private";

export type FileStatus = "pending" | "uploaded" | "deleted";

export interface FileRecord {
  id: string;
  originalName: string;
  fileName: string;
  gcsPath: string;
  bucketName: string;
  mimeType: string;
  sizeBytes: number;
  category: FileCategory | string;
  visibility: FileVisibility;
  status: FileStatus;
  clientId: string;
  uploaderId: string;
  metadata?: Record<string, unknown> | null;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListFilesQuery {
  page?: number;
  limit?: number;
  category?: string;
  visibility?: FileVisibility;
  clientId?: string;
  search?: string;
}

export interface ListFilesResponse {
  items: FileRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileRecord: FileRecord;
  expiresInSeconds: number;
}

export interface StorageUploadOptions {
  category?: FileCategory | string;
  visibility?: FileVisibility;
  clientId?: string;
}
