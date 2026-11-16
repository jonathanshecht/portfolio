"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

// A short silent demo that plays on a loop, like a moving screenshot. Visitors who prefer reduced
// motion get a still frame with play controls instead.
export function DemoVideo({
  src,
  poster,
  label,
  aspect = "11 / 4",
}: {
  src: string;
  poster: string;
  label: string;
  // The video's width / height, so the frame matches it.
  aspect?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0b0b0d]">
      <video
        key={reducedMotion ? "still" : "loop"}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        autoPlay={!reducedMotion}
        controls={reducedMotion}
        preload="metadata"
        style={{ aspectRatio: aspect }}
        className="block w-full"
      />
    </div>
  );
}
