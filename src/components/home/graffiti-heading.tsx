"use client";

// The contact section's graffiti JS mark and its heading, drawn together so the paint can line
// up: while the mark is lit (a ".glow-trigger" in the surrounding ".glow-zone" is hovered or
// focused), each drip drops a bead that falls straight down onto a letter of the heading and splats, and red
// paint spreads out from every spot where a drop lands, unevenly, until the whole heading is red.
// Moving away drains the paint. On touch screens it paints once the section scrolls into view,
// and stays painted. Styles live in globals.css
// (.drop-fall, .paint-layer).

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DRIP_DELAY, DRIPS, GraffitiJsMark } from "@/components/home/js-mark";

const LOGO = { w: 21.3938, h: 20.914 }; // the mark's own units
const CYCLE = 2.6; // s, one drip-and-drop cycle (matches globals.css)
const LAND_AT = 0.92; // fraction of the cycle when a drop lands (matches the drop-fall keyframes)
// How far each paint blob spreads (px) and how round it is (height / width), one per drip. Drops
// land in the order 3, 2, 1, 0; the early splats stay small, each later one spreads further, and
// the last one finishes covering the heading, so the red builds up unevenly over a few seconds.
const SPREAD = [
  { max: 430, round: 0.55 },
  { max: 170, round: 0.8 },
  { max: 120, round: 0.85 },
  { max: 90, round: 0.95 },
];

type Geometry = {
  drops: { left: number; top: number; dy: number }[];
  spots: { x: number; y: number }[];
};

export function GraffitiHeading({ id, text }: { id: string; text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);

  // Work out where each drop starts (the end of its drip) and where it lands: straight below,
  // halfway down the heading's lowercase letters. The drips sit above solid letter strokes (see
  // DRIPS), so every drop lands on a letter.
  useEffect(() => {
    const wrap = wrapRef.current;
    const mark = markRef.current;
    const heading = headingRef.current;
    const textNode = heading?.firstChild;
    if (!wrap || !mark || !heading || !(textNode instanceof Text)) return;

    const measure = () => {
      const w = wrap.getBoundingClientRect();
      const m = mark.getBoundingClientRect();
      const h = heading.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const lines = [...range.getClientRects()];
      if (lines.length === 0) return;
      const line = lines[0];
      const landY = line.top + line.height * 0.6; // middle of the lowercase letters
      const drops: Geometry["drops"] = [];
      const spots: Geometry["spots"] = [];
      for (const [x, top, length] of DRIPS) {
        const sx = m.left + (x / LOGO.w) * m.width;
        const sy = m.top + ((top + length) / LOGO.h) * m.height;
        drops.push({ left: sx - w.left, top: sy - w.top, dy: landY - sy });
        spots.push({ x: sx - h.left, y: landY - h.top });
      }
      setGeo({ drops, spots });
    };

    const observer = new ResizeObserver(() => measure());
    observer.observe(wrap);
    void document.fonts.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  // Paint variables for the overlay: one blob per landing spot, starting as its drop lands.
  const paintVars: Record<string, string> = {};
  geo?.spots.forEach((s, i) => {
    const firstLanding =
      (((LAND_AT * CYCLE + parseFloat(DRIP_DELAY(i))) % CYCLE) + CYCLE) % CYCLE;
    paintVars[`--x${i}`] = `${s.x.toFixed(1)}px`;
    paintVars[`--y${i}`] = `${s.y.toFixed(1)}px`;
    paintVars[`--max${i}`] = `${SPREAD[i].max}px`;
    paintVars[`--round${i}`] = `${SPREAD[i].round}`;
    paintVars[`--t${i}`] = `${firstLanding.toFixed(2)}s`;
  });

  return (
    <div ref={wrapRef} className="relative flex flex-col items-center gap-6">
      <span ref={markRef} className="block">
        <GraffitiJsMark className="size-10" />
      </span>
      {/* A little bottom padding keeps descenders (the g) inside the painted area. */}
      <h2
        ref={headingRef}
        id={id}
        className="relative pb-1.5 text-[32px] leading-tight font-bold"
      >
        {text}
        {geo && (
          <span
            aria-hidden
            className="paint-layer absolute inset-0 pb-1.5"
            style={paintVars as CSSProperties}
          >
            {text}
          </span>
        )}
      </h2>
      {geo?.drops.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className="drop-fall"
          style={
            {
              left: d.left,
              top: d.top,
              "--dy": `${d.dy.toFixed(1)}px`,
              "--delay": DRIP_DELAY(i),
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
