"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Photo = { src: string; label: string };

const AUTO_INTERVAL = 4000; // 4 seconds

export default function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main image */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-paper-warm">
        <Image
          src={photos[current].src}
          alt={photos[current].label}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover transition-opacity duration-500"
          quality={90}
          priority={current === 0}
        />

        {/* Label + counter */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
          <p className="text-white text-sm font-medium">{photos[current].label}</p>
          <p className="text-white/60 text-xs">{current + 1} / {photos.length}</p>
        </div>

        {/* Arrows */}
        <button
          onClick={() => { prev(); setPaused(true); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white text-xl transition-colors"
          aria-label="Previous"
        >‹</button>
        <button
          onClick={() => { next(); setPaused(true); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white text-xl transition-colors"
          aria-label="Next"
        >›</button>

        {/* Progress bar */}
        {!paused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
            <div
              key={current}
              className="h-full bg-accent-light"
              style={{ animation: `growWidth ${AUTO_INTERVAL}ms linear forwards` }}
            />
          </div>
        )}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setPaused(true); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-accent w-4" : "bg-paper-warm w-1.5"
            }`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
