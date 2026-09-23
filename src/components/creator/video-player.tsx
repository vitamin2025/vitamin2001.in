"use client";

import React, { useEffect, useRef, useState } from "react";
import { PlayerSdk } from "@api.video/player-sdk";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface VideoPlayerProps {
  /** api.video video ID (e.g., "vi4blUQJFrYWbaG44NChkH27") */
  videoId?: string;
  /** Optional playback session token for private videos */
  sessionToken?: string;
  /** Direct source URL (for backward compatibility) */
  src?: string;
  /** Optional poster/thumbnail URL */
  poster?: string;
  title?: string;
  className?: string;
  onTokenExpired?: () => void;
}

export function VideoPlayer({
  videoId,
  sessionToken,
  src,
  poster,
  title,
  className = "",
  onTokenExpired,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerSdk | null>(null);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // If videoId is provided, use @api.video/player-sdk
  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    setHasError(false);

    // Clear previous player iframe from container if retrying
    containerRef.current.innerHTML = "";

    try {
      const player = new PlayerSdk(containerRef.current, {
        id: videoId,
        ...(sessionToken ? { token: sessionToken } : {}),
        autoplay: false,
        muted: false,
        hideTitle: true,
      });

      player.addEventListener("error", () => {
        setHasError(true);
        onTokenExpired?.();
      });

      playerRef.current = player;
    } catch (err) {
      setHasError(true);
    }

    return () => {
      try {
        playerRef.current?.destroy();
      } catch {}
      playerRef.current = null;
    };
  }, [videoId, sessionToken, retryKey, onTokenExpired]);

  const handleRetry = () => {
    setHasError(false);
    setRetryKey((prev) => prev + 1);
    onTokenExpired?.();
  };

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-xl ${className}`}
      >
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-sm font-medium text-slate-200">
          {title || "Video playback error"}
        </p>
        <p className="text-xs text-slate-400 mt-1 mb-4 text-center max-w-sm">
          The video could not be loaded or the playback session has expired.
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

  // If only legacy src is provided without videoId, fallback to native video tag
  if (!videoId && src) {
    return (
      <div
        className={`relative w-full bg-black rounded-xl overflow-hidden ${className}`}
      >
        <video
          key={retryKey}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          onError={() => {
            setHasError(true);
            onTokenExpired?.();
          }}
          className="w-full max-h-[500px] object-contain mx-auto"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full bg-black rounded-xl overflow-hidden ${className}`}
      style={{ aspectRatio: "16/9" }}
    >
      <div ref={containerRef} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0" />
    </div>
  );
}
