"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export type MediaItem = {
  src: string;
  label: string;
  type: "image" | "video";
};

export default function GalleryLightbox({ items }: { items: MediaItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const prev = useCallback(() => {
    setActive((a) => (a !== null ? (a - 1 + items.length) % items.length : null));
  }, [items.length]);

  const next = useCallback(() => {
    setActive((a) => (a !== null ? (a + 1) % items.length : null));
  }, [items.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    if (active !== null) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, next, prev]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative group rounded-xl overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-accent"
            style={{ height: "180px" }}
            aria-label={`View ${item.label}`}
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            {/* Video play icon */}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 2l9 5-9 5V2z" fill="#1a1917" />
                  </svg>
                </div>
              </div>
            )}

            {/* Label on hover */}
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-all duration-200 flex items-end p-3">
              <span className="text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 leading-tight">
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-5 text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Media container */}
          <div
            className="relative w-full max-w-4xl rounded-xl overflow-hidden bg-black"
            style={{ height: "70vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {items[active].type === "video" ? (
              <video
                src={items[active].src}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={items[active].src}
                alt={items[active].label}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            )}

            {/* Prev arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Label + counter */}
          <div
            className="mt-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white text-sm font-medium">{items[active].label}</p>
            <p className="text-white/40 text-xs mt-1">{active + 1} / {items.length} · ESC to close · ← → to navigate</p>
          </div>
        </div>
      )}
    </>
  );
}
