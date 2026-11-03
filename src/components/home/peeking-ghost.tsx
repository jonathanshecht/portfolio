"use client";

import { useEffect, useRef } from "react";

// The site's little ghost made of glass, traced from the reference icon: a round dome on straight
// sides, a softly wavy hem (two dips, a bump in the middle), and tall oval eyes set close together,
// in a bold white outline around a frosted inside that blurs and slightly tints whatever is
// behind it, with a faint highlight across the top. Its eyes follow the cursor around the page.

// The outline's centerline in 24-unit space, measured from the reference icon: the dome (radius
// 10, centered at 12,12) on straight sides, and a hem that rounds in from each corner, rises to a
// small bump, dips, and peaks in the middle (two dips, symmetric).
const SIDE_END = 20.1;
// Slimmer than the reference: everything is pulled in toward the center line (x = 12) by this
// much, with the dome becoming a slightly tall ellipse. Stroke weight is unaffected.
const NARROW = 0.88;
const nx = (x: number) => 12 + (x - 12) * NARROW;
const HEM: [number, number][] = [
  [22, SIDE_END],
  [20.94, 21.39],
  [18.21, 21.09],
  [15.03, 22],
  [12, 20.79],
  [8.97, 22],
  [5.79, 21.09],
  [3.06, 21.39],
  [2, SIDE_END],
];

// A smooth curve through the hem points (Catmull-Rom as cubic Béziers); the ends lean on points
// just above the corners, so the hem leaves the sides heading straight down.
function hemCurve(n: (v: number) => string) {
  const pts: [number, number][] = [
    [22, SIDE_END - 1],
    ...HEM,
    [2, SIDE_END - 1],
  ];
  let d = "";
  for (let i = 1; i < pts.length - 2; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${n(nx(c1[0]))} ${n(c1[1])} ${n(nx(c2[0]))} ${n(c2[1])} ${n(nx(p2[0]))} ${n(p2[1])}`;
  }
  return d;
}

function bodyPath(scale: number) {
  const n = (v: number) => (v * scale).toFixed(2);
  return `M${n(nx(2))} ${n(SIDE_END)}V${n(12)}A${n(10 * NARROW)} ${n(10)} 0 0 1 ${n(nx(22))} ${n(12)}V${n(SIDE_END)}${hemCurve(n)}Z`;
}

// 1.9px per unit (the box is about 46×44px).
const SCALE = 1.9;
const BODY = bodyPath(1);
const BODY_PX = bodyPath(SCALE);
// How far the eyes can look, in units, and how far away (px) the cursor must be for a full look.
const LOOK = 0.75;
const LOOK_REACH = 220;

export function GlassGhost({ className = "" }: { className?: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const eyesRef = useRef<SVGGElement>(null);

  // The eyes look toward the cursor: a small shift in its direction, fuller the farther it is.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let target = { x: 0, y: 0 };
    const apply = () => {
      raf = 0;
      const box = boxRef.current?.getBoundingClientRect();
      const eyes = eyesRef.current;
      if (!box || !eyes) return;
      const dx = target.x - (box.left + box.width / 2);
      const dy = target.y - (box.top + box.height * 0.45);
      const dist = Math.hypot(dx, dy) || 1;
      const amount = LOOK * Math.min(1, dist / LOOK_REACH);
      eyes.setAttribute(
        "transform",
        `translate(${((dx / dist) * amount).toFixed(2)} ${((dy / dist) * amount * 0.8).toFixed(2)})`,
      );
    };
    const onMove = (e: PointerEvent) => {
      target = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <span
      ref={boxRef}
      aria-hidden
      className={`block ${className}`}
      style={{ width: 24 * SCALE, height: 23 * SCALE }}
    >
      {/* Frosted glass, clipped to the body. */}
      <span
        className="absolute inset-0 backdrop-blur-[5px]"
        style={{
          clipPath: `path("${BODY_PX}")`,
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.05) 42%, rgba(0,0,0,0.22) 100%)",
        }}
      />
      <svg
        viewBox="0 0 24 23"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.38}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 size-full"
      >
        <path d={BODY} />
        <g ref={eyesRef} fill="currentColor" stroke="none">
          <ellipse cx="9.36" cy="10.6" rx="0.95" ry="1.5" />
          <ellipse cx="14.64" cy="10.6" rx="0.95" ry="1.5" />
        </g>
      </svg>
    </span>
  );
}
