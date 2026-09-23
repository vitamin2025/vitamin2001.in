import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/auth";
import type {
  FileRecord,
  ListFilesQuery,
  ListFilesResponse,
  PresignedUploadResponse,
  StorageUploadOptions,
} from "@/types/storage";

export const LARGE_FILE_THRESHOLD_BYTES = 20 * 1024 * 1024; // 20 MB

function resolveStorageBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const trimmed = raw.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(trimmed);
    return `${parsed.origin}/v1/storage`;
  } catch {
    return "http://localhost:8000/v1/storage";
  }
}

export const storageHttp = axios.create({
  baseURL: resolveStorageBase(),
  withCredentials: true,
  timeout: 60000,
});

storageHttp.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchStorageFiles(query: ListFilesQuery = {}): Promise<ListFilesResponse> {
  const params: Record<string, string | number> = {};
  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;
  if (query.category && query.category !== "all") params.category = query.category;
  if (query.visibility) params.visibility = query.visibility;
  if (query.clientId && query.clientId !== "all") params.clientId = query.clientId;
  if (query.search) {
    params.search = query.search;
    params.q = query.search;
  }

  const res = await storageHttp.get<any>("", { params });
  const raw = res.data;
  const items = Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.data)
      ? raw.data
      : [];
  const meta = raw?.meta ?? {
    total: typeof raw?.total === "number" ? raw.total : items.length,
    page: typeof raw?.page === "number" ? raw.page : (query.page ?? 1),
    limit: typeof raw?.limit === "number" ? raw.limit : (query.limit ?? 20),
    totalPages:
      typeof raw?.totalPages === "number"
        ? raw.totalPages
        : Math.ceil((raw?.total ?? items.length) / (query.limit ?? 20)) || 1,
  };
  return { items, meta };
}

export async function fetchStorageFile(id: string): Promise<FileRecord> {
  const res = await storageHttp.get<FileRecord>(`/${encodeURIComponent(id)}`);
  return res.data;
}

export async function fetchFreshUrl(id: string, expiresIn?: number): Promise<{ url: string; expiresInSeconds?: number }> {
  const params: Record<string, number> = {};
  if (expiresIn) params.expiresIn = expiresIn;
  const res = await storageHttp.get<{ url: string; expiresInSeconds?: number }>(
    `/${encodeURIComponent(id)}/url`,
    { params },
  );
  return res.data;
}

export async function deleteStorageFile(id: string): Promise<void> {
  await storageHttp.delete(`/${encodeURIComponent(id)}`);
}

export async function uploadViaMultipart(
  file: File,
  options?: StorageUploadOptions,
  onProgress?: (percent: number) => void,
): Promise<FileRecord> {
  const formData = new FormData();
  formData.append("file", file);
  if (options?.category) formData.append("category", options.category);
  if (options?.visibility) formData.append("visibility", options.visibility);
  if (options?.clientId) formData.append("clientId", options.clientId);

  const res = await storageHttp.post<FileRecord>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return res.data;
}

export async function uploadViaPresigned(
  file: File,
  options?: StorageUploadOptions,
  onProgress?: (percent: number) => void,
): Promise<FileRecord> {
  const presignedRes = await storageHttp.post<PresignedUploadResponse>("/presigned-upload-url", {
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    category: options?.category || "general",
    visibility: options?.visibility || "public",
    clientId: options?.clientId,
  });

  const { uploadUrl, fileRecord } = presignedRes.data;

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  const confirmRes = await storageHttp.post<FileRecord>(`/confirm-upload/${fileRecord.id}`);
  return confirmRes.data;
}

export async function uploadFileHybrid(
  file: File,
  options?: StorageUploadOptions,
  onProgress?: (percent: number) => void,
): Promise<FileRecord> {
  if (file.size > LARGE_FILE_THRESHOLD_BYTES) {
    return uploadViaPresigned(file, options, onProgress);
  }
  return uploadViaMultipart(file, options, onProgress);
}

export const storageKeys = {
  all: ["storage"] as const,
  lists: () => [...storageKeys.all, "list"] as const,
  list: (query: ListFilesQuery) => [...storageKeys.lists(), query] as const,
  details: () => [...storageKeys.all, "detail"] as const,
  detail: (id: string) => [...storageKeys.details(), id] as const,
};

export function useStorageFiles(query: ListFilesQuery = {}, enabled = true) {
  return useQuery({
    queryKey: storageKeys.list(query),
    queryFn: () => fetchStorageFiles(query),
    enabled,
    staleTime: 30000,
  });
}

export function useStorageFile(id: string, enabled = true) {
  return useQuery({
    queryKey: storageKeys.detail(id),
    queryFn: () => fetchStorageFile(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useDeleteStorageFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStorageFile(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storageKeys.lists() });
    },
  });
}

export function useUploadStorageFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      options,
      onProgress,
    }: {
      file: File;
      options?: StorageUploadOptions;
      onProgress?: (pct: number) => void;
    }) => uploadFileHybrid(file, options, onProgress),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storageKeys.lists() });
    },
  });
}
