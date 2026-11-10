"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

// A short silent demo that plays on a loop, like a moving screenshot. Visitors who prefer reduced
// motion get a still frame with play controls instead.
export function DemoVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
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
        className="block aspect-[11/4] w-full"
      />
    </div>
  );
}
