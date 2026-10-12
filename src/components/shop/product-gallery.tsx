"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-card";

/** Swipeable product images with thumbnails. `focus` jumps to an image, e.g. the chosen variant's. */
export function ProductGallery({
  images,
  name,
  focus,
}: {
  images: readonly string[];
  name: string;
  focus?: string | null;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    const element = track.current;
    if (!element) return;
    const clamped = Math.max(0, Math.min(images.length - 1, next));
    element.scrollTo({ left: clamped * element.clientWidth, behavior: "smooth" });
  }, [images.length]);

  useEffect(() => {
    if (!focus) return;
    const at = images.indexOf(focus);
    if (at >= 0) goTo(at);
  }, [focus, images, goTo]);

  const onScroll = () => {
    const element = track.current;
    if (!element || !element.clientWidth) return;
    setIndex(Math.round(element.scrollLeft / element.clientWidth));
  };

  if (!images.length) {
    return <ProductImage src={null} alt={name} className="aspect-square w-full rounded-3xl" />;
  }

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200/70">
        <div
          ref={track}
          onScroll={onScroll}
          className="shop-snap flex aspect-square overflow-x-auto"
          tabIndex={0}
          aria-label={`${name} images`}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") goTo(index + 1);
            if (event.key === "ArrowLeft") goTo(index - 1);
          }}
        >
          {images.map((src, at) => (
            <div key={src} className="h-full w-full shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={at === 0 ? name : `${name}, image ${at + 1}`}
                loading={at === 0 ? "eager" : "lazy"}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white disabled:opacity-0 sm:inline-flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === images.length - 1}
              aria-label="Next image"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white disabled:opacity-0 sm:inline-flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden" aria-hidden>
              {images.map((src, at) => (
                <span
                  key={src}
                  className={cn("h-1.5 rounded-full transition-all", at === index ? "w-5 bg-slate-800" : "w-1.5 bg-slate-400/70")}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="hidden gap-3 sm:flex">
          {images.slice(0, 8).map((src, at) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(at)}
              aria-label={`Show image ${at + 1}`}
              aria-current={at === index}
              className={cn(
                "h-20 w-20 overflow-hidden rounded-xl bg-slate-100 ring-2 transition",
                at === index ? "ring-(--shop-accent)" : "ring-transparent hover:ring-slate-300",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
