"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/data/site";

// A full-page screenshot shown whole and narrow, with handwritten notes out in the margins on both
// sides. Each note fades in with its arrow drawing toward the spot it's about as that part of the
// page scrolls into view. On narrow screens there's no margin, so numbered dots sit on the spots
// and the notes become a numbered list under the screenshot.
export type ScreenshotNote = {
  text: string;
  // The spot the arrow points at, in percent of the screenshot's width and height.
  x: number;
  y: number;
  side: "left" | "right";
  // Run the arrow all the way in to the spot (only where the screenshot is dark enough for a
  // white arrow to show). Otherwise it's a short arrow stopping at the screenshot's edge.
  inside?: boolean;
};

const GAP = 30; // px from the screenshot's edge to where an arrow starts

function arrowPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  // A gentle bow, then a small head with slightly uneven sides so it looks drawn by hand.
  const cx = (x1 + x2) / 2 - dy * 0.12;
  const cy = (y1 + y2) / 2 + dx * 0.12 - Math.min(14, Math.abs(dx) * 0.2);
  const ex = x2 - cx;
  const ey = y2 - cy;
  const len = Math.hypot(ex, ey) || 1;
  const ux = ex / len;
  const uy = ey / len;
  const head = (h: number, a: number) => [
    x2 - h * (ux * Math.cos(a) - uy * Math.sin(a)),
    y2 - h * (uy * Math.cos(a) + ux * Math.sin(a)),
  ];
  const [p1x, p1y] = head(8, 0.5);
  const [p2x, p2y] = head(7, -0.6);
  return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2} M${p1x} ${p1y} L${x2} ${y2} L${p2x} ${p2y}`;
}

export function ScreenshotNotes({
  image,
  notes,
  hand,
  alt,
}: {
  image: Img;
  notes: ScreenshotNote[];
  hand: string;
  alt: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [shown, setShown] = useState<boolean[]>(() => notes.map(() => false));

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A note appears once its spot reaches the lower third of the window, and stays.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const markers = [...el.querySelectorAll<HTMLElement>("[data-note-spot]")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = Number((entry.target as HTMLElement).dataset.noteSpot);
          setShown((s) => (s[i] ? s : s.map((v, k) => (k === i ? true : v))));
        });
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    markers.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, []);

  return (
    <figure className="mt-10">
      <div ref={boxRef} className="relative mx-auto w-full md:w-[400px]">
        <div className="overflow-hidden rounded-lg border border-white/15 bg-white">
          <Image
            src={image.src}
            alt={alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 768px) 400px, 100vw"
            quality={90}
            className="block h-auto w-full"
          />
        </div>

        {notes.map((n, i) => (
          <span
            key={n.text}
            data-note-spot={i}
            aria-hidden
            className="pointer-events-none absolute size-0"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            {/* On narrow screens: a numbered dot on the spot. */}
            <span className="absolute -top-2.5 -left-2.5 grid size-5 place-items-center rounded-full bg-(--accent) text-[11px] font-semibold text-black md:hidden">
              {i + 1}
            </span>
          </span>
        ))}

        {/* Wide screens: the notes in the margins, with arrows in to their spots. */}
        {notes.map((n, i) => (
          <span
            key={n.text}
            aria-hidden
            className={`${hand} pointer-events-none absolute hidden w-[170px] -translate-y-1/2 text-[17px] leading-tight text-white/90 transition duration-500 ease-out motion-reduce:transition-none md:block ${
              n.side === "left"
                ? `right-[calc(100%+42px)] text-right ${i % 2 ? "rotate-1" : "-rotate-2"}`
                : `left-[calc(100%+42px)] text-left ${i % 2 ? "-rotate-1" : "rotate-2"}`
            } ${shown[i] ? "opacity-100" : `opacity-0 ${n.side === "left" ? "-translate-x-2" : "translate-x-2"}`}`}
            style={{ top: `${n.y}%` }}
          >
            {n.text}
          </span>
        ))}
        {size.w > 0 && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden size-full overflow-visible text-white/85 md:block"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {notes.map((n, i) => {
              const y = (n.y / 100) * size.h;
              // Over the photo the arrow runs in to the spot; elsewhere (white page, where a
              // white arrow would vanish) it stops short at the edge, pointing in from the side.
              const x2 = n.inside
                ? (n.x / 100) * size.w
                : n.side === "left"
                  ? -6
                  : size.w + 6;
              const x1 = n.side === "left" ? -GAP : size.w + GAP;
              return (
                <path
                  key={n.text}
                  d={arrowPath(x1, y, x2, y)}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={shown[i] ? 0 : 1}
                  className="transition-[stroke-dashoffset] delay-150 duration-700 ease-out motion-reduce:transition-none"
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Shown on narrow screens; on wide ones it stays for screen readers only. */}
      <ol
        className={`${hand} mt-5 space-y-1.5 text-base leading-tight text-white/85 md:sr-only`}
      >
        {notes.map((n, i) => (
          <li key={n.text} className="flex gap-2.5">
            <span
              aria-hidden
              className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-(--accent) font-sans text-[11px] font-semibold text-black"
            >
              {i + 1}
            </span>
            {n.text}
          </li>
        ))}
      </ol>
    </figure>
  );
}
