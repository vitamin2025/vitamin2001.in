"use client";

import React from "react";

interface EmbedPlayerProps {
  embedUrl: string;
  className?: string;
}

export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube matchers
  const ytMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/,
  );
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // api.video embed links
  if (trimmed.includes("embed.api.video/vod/")) {
    return trimmed;
  }

  // Generic iframe or player URL
  if (trimmed.includes("/embed/") || trimmed.includes("player.")) {
    return trimmed;
  }

  return null;
}

export function EmbedPlayer({ embedUrl, className = "" }: EmbedPlayerProps) {
  const src = toEmbedUrl(embedUrl);
  if (!src) return null;

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-slate-200 bg-black ${className}`}
      style={{ aspectRatio: "16/9" }}
    >
      <iframe
        src={src}
        title="Embedded Video Player"
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
