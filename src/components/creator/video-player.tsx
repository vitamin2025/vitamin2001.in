"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  onTokenExpired?: () => void;
}

export function VideoPlayer({
  src,
  poster,
  title,
  className = "",
  onTokenExpired,
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setHasError(false);
    setRetryKey((prev) => prev + 1);
    if (onTokenExpired) {
      onTokenExpired();
    }
  };

  const handleError = () => {
    setHasError(true);
    if (onTokenExpired) {
      onTokenExpired();
    }
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-xl ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-sm font-medium text-slate-200">{title || "Video playback error"}</p>
        <p className="text-xs text-slate-400 mt-1 mb-4 text-center max-w-sm">
          The video could not be loaded or the secure playback link has expired.
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry loading
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full bg-black rounded-xl overflow-hidden ${className}`}>
      <video
        key={retryKey}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        onError={handleError}
        className="w-full max-h-[500px] object-contain mx-auto"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
