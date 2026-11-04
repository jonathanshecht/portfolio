"use client";

import { useEffect, useRef } from "react";

// On touch screens (no hover), lights up the surrounding ".glow-zone" once it has scrolled well
// into view, by giving it data-lit: the graffiti glows, starts dripping and the paint spreads,
// as hovering does on a computer. It stays lit after that.
export function LightWhenSeen() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const zone = ref.current?.closest<HTMLElement>(".glow-zone");
    if (!zone || !window.matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        zone.setAttribute("data-lit", "");
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(zone);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}
