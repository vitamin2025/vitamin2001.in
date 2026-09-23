import { VideoUploader } from "@api.video/video-uploader";
import { storageHttp } from "./index";
import type { FileRecord } from "@/types/storage";

export interface VideoUploadResult {
  fileRecord: FileRecord;
  apiVideoId: string;
}

/**
 * Uploads a video file directly from the browser to api.video using a delegated token,
 * then registers the uploaded video with the backend storage service.
 */
export async function uploadVideoToApiVideo(
  file: File,
  options?: {
    clientId?: string;
    caption?: string;
  },
  onProgress?: (percent: number) => void,
): Promise<VideoUploadResult> {
  // 1. Request delegated upload token from backend
  const tokenRes = await storageHttp.post<{
    token: string;
    ttl: number;
    expiresAt?: string;
  }>("/video/upload-token", {
    ttl: 3600,
    clientId: options?.clientId,
  });

  const uploadToken = tokenRes.data.token;
  if (!uploadToken) {
    throw new Error("Failed to obtain upload token from server");
  }

  // 2. Upload file directly to api.video
  const uploader = new VideoUploader({
    file,
    uploadToken,
    chunkSize: 10 * 1024 * 1024, // 10MB chunks
    retries: 5,
  });

  uploader.onProgress((event) => {
    if (onProgress && event.totalBytes > 0) {
      const percent = Math.min(
        100,
        Math.round((event.uploadedBytes * 100) / event.totalBytes),
      );
      onProgress(percent);
    }
  });

  const uploadResponse = await uploader.upload();
  const apiVideoId = uploadResponse.videoId;

  if (!apiVideoId) {
    throw new Error("api.video upload succeeded but returned no videoId");
  }

  // 3. Register the uploaded video with our backend
  const registerRes = await storageHttp.post<FileRecord>("/video/register", {
    apiVideoId,
    originalName: file.name,
    mimeType: file.type || "video/mp4",
    sizeBytes: file.size,
    clientId: options?.clientId,
    caption: options?.caption,
  });

  return {
    fileRecord: registerRes.data,
    apiVideoId,
  };
}
