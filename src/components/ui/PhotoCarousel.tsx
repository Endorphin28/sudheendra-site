"use client";

import { useState } from "react";
import Image from "next/image";

type Photo = { src: string; label: string };

export default function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  return (
    <div className="relative w-full">
      {/* Main image */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-paper-warm">
        <Image
          src={photos[current].src}
          alt={photos[current].label}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover transition-opacity duration-300"
          priority={current === 0}
        />
        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
          <p className="text-white text-sm font-medium">{photos[current].label}</p>
          <p className="text-white/60 text-xs">{current + 1} / {photos.length}</p>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
          aria-label="Next"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-accent" : "bg-paper-warm"}`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
