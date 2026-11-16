"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// A handwritten note on a visual, in one of two kinds:
// - Above or below it, with a short arrow pointing in. The note sits right above or below what it
//   describes (`x`, in percent across). A note near an edge can hang off one side of its arrow
//   (`align`). If the element sits deeper inside, `to` (percent across and down) runs the arrow
//   on to it.
// - Inside it (`inside`), in an empty part of the screen right next to the element, with a short
//   arrow from `from` to `to`.
// - Beside it (`beside`), out in the page margin to the left at height `y`, with a short arrow
//   in to `to`, for an element on the visual's left edge. Only on screens wide enough for the margin to
//   hold it. All positions are percent of the visual's width and height.
type Point = { x: number; y: number };
export type Annotation =
  | {
      text: string;
      side: "above" | "below";
      x: number;
      align?: "center" | "start" | "end";
      to?: Point;
    }
  | {
      text: string;
      inside: Point & { width?: number; align?: "center" | "start" };
      // Leave the arrow out where it would be lost, like over a white screenshot.
      from?: Point;
      to?: Point;
    }
  | {
      text: string;
      beside: { y: number; width?: number };
      to: Point;
    };

type EdgeNote = Extract<Annotation, { side: string }>;
type BesideNote = Extract<Annotation, { beside: object }>;
const isBeside = (n: Annotation): n is BesideNote => "beside" in n;
type InsideNote = Extract<Annotation, { inside: object }>;
const isInside = (n: Annotation): n is InsideNote => "inside" in n;

const START = 32; // px from the visual's edge to where a long arrow leaves its note

// A long arrow from a note into the visual: a gentle curve with a small head, in the same thin
// hand-drawn style as the short arrows.
function longArrow(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = (x1 + x2) / 2 - dy * 0.08;
  const cy = (y1 + y2) / 2 + dx * 0.08;
  const ex = x2 - cx;
  const ey = y2 - cy;
  const el = Math.hypot(ex, ey) || 1;
  const ux = ex / el;
  const uy = ey / el;
  const h = 6;
  const a = 0.55;
  const p1 = [
    x2 - h * (ux * Math.cos(a) - uy * Math.sin(a)),
    y2 - h * (uy * Math.cos(a) + ux * Math.sin(a)),
  ];
  const p2 = [
    x2 - h * (ux * Math.cos(a) + uy * Math.sin(a)),
    y2 - h * (uy * Math.cos(a) - ux * Math.sin(a)),
  ];
  return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2} M${p1[0]} ${p1[1]} L${x2} ${y2} L${p2[0]} ${p2[1]}`;
}

function LongArrows({
  notes,
  size,
}: {
  notes: Annotation[];
  size: { w: number; h: number };
}) {
  if (!size.w) return null;
  const px = (p: Point) => [(p.x / 100) * size.w, (p.y / 100) * size.h];
  const paths = notes.flatMap((n) => {
    if (isBeside(n)) return [];
    if (isInside(n)) {
      if (!n.from || !n.to) return [];
      const [x1, y1] = px(n.from);
      const [x2, y2] = px(n.to);
      return [{ key: n.text, d: longArrow(x1, y1, x2, y2) }];
    }
    if (!n.to) return [];
    const [x2, y2] = px(n.to);
    return [
      {
        key: n.text,
        d: longArrow(
          (n.x / 100) * size.w,
          n.side === "above" ? -START : size.h + START,
          x2,
          y2,
        ),
      },
    ];
  });
  if (!paths.length) return null;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden size-full overflow-visible text-white/85 sm:block"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((p) => (
        <path key={p.key} d={p.d} />
      ))}
    </svg>
  );
}

// Notes written inside the visual. A soft dark glow behind the letters keeps them readable.
function InsideNotes({ notes, hand }: { notes: Annotation[]; hand: string }) {
  return (
    <>
      {notes.filter(isInside).map((n, i) => (
        <span
          key={n.text}
          aria-hidden
          className={`${hand} pointer-events-none absolute hidden -translate-y-1/2 text-[15px] leading-tight text-white/90 [text-shadow:0_0_6px_rgba(0,0,0,0.9)] sm:block ${
            n.inside.align === "start"
              ? "text-left"
              : "-translate-x-1/2 text-center"
          } ${i % 2 ? "rotate-2" : "-rotate-2"} ${n.inside.width ? "" : "whitespace-nowrap"}`}
          style={{
            left: `${n.inside.x}%`,
            top: `${n.inside.y}%`,
            width: n.inside.width,
          }}
        >
          {n.text}
        </span>
      ))}
    </>
  );
}

function Arrow({ up = false }: { up?: boolean }) {
  return (
    <svg
      viewBox="0 0 14 30"
      aria-hidden
      className={`h-[26px] w-[14px] shrink-0 overflow-visible ${up ? "-scale-y-100" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 2 C 3 10, 11 18, 7 27" />
      <path d="M3.5 22.5 L7 27.5 L10.5 22.5" />
    </svg>
  );
}

// Notes out in the left margin, each with a short arrow in to the element on the visual's edge.
function BesideNotes({
  notes,
  hand,
  size,
}: {
  notes: Annotation[];
  hand: string;
  size: { w: number; h: number };
}) {
  const list = notes.filter(isBeside);
  if (!list.length) return null;
  return (
    <>
      {list.map((n) => (
        <span
          key={n.text}
          aria-hidden
          className={`${hand} pointer-events-none absolute right-[calc(100%+30px)] hidden -translate-y-1/2 -rotate-2 text-right text-[15px] leading-tight text-white/85 min-[1080px]:block`}
          style={{ top: `${n.beside.y}%`, width: n.beside.width ?? 96 }}
        >
          {n.text}
        </span>
      ))}
      {size.w > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden size-full overflow-visible text-white/85 min-[1080px]:block"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {list.map((n) => (
            <path
              key={n.text}
              d={longArrow(
                -26,
                (n.beside.y / 100) * size.h,
                (n.to.x / 100) * size.w,
                (n.to.y / 100) * size.h,
              )}
            />
          ))}
        </svg>
      )}
    </>
  );
}

function NoteRow({
  notes,
  side,
  hand,
  steady,
}: {
  notes: Annotation[];
  side: "above" | "below";
  hand: string;
  steady: boolean;
}) {
  const row = notes.filter(
    (n): n is EdgeNote => "side" in n && n.side === side,
  );
  // In a viewer that switches between screenshots, an empty row keeps its height so the page
  // doesn't jump; anywhere else it takes no space.
  if (!row.length && !steady) return null;
  return (
    <div aria-hidden className="relative hidden h-14 sm:block">
      {row.map((n, i) => {
        const align = n.align ?? "center";
        const place =
          align === "center"
            ? "-translate-x-1/2 items-center"
            : align === "start"
              ? "-translate-x-[7px] items-start"
              : "-translate-x-[calc(100%-7px)] items-end";
        const tilt =
          (i + (side === "below" ? 1 : 0)) % 2 ? "rotate-2" : "-rotate-2";
        const text = <span className={tilt}>{n.text}</span>;
        return (
          <span
            key={n.text}
            className={`${hand} absolute flex flex-col gap-1 text-[15px] leading-tight whitespace-nowrap text-white/85 ${place} ${
              side === "above" ? "bottom-1" : "top-1"
            }`}
            style={{ left: `${n.x}%` }}
          >
            {/* A note with a long arrow keeps the short arrow's space, so its text sits in
                the same place; the long arrow is drawn over the visual instead. */}
            {side === "above" ? (
              <>
                {text}
                {n.to ? <span className="h-[26px]" /> : <Arrow />}
              </>
            ) : (
              <>
                {n.to ? <span className="h-[26px]" /> : <Arrow up />}
                {text}
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}

// A visual with handwritten notes above and below it. On phones there's no room for them, so the
// notes show as a short handwritten list under the visual instead (unless `phoneList` is off, for
// visuals whose text already covers the same points).
export function Annotated({
  notes,
  hand,
  children,
  phoneList = true,
  steady = false,
}: {
  notes: Annotation[];
  hand: string;
  children: ReactNode;
  phoneList?: boolean;
  steady?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div>
      <NoteRow notes={notes} side="above" hand={hand} steady={steady} />
      <div ref={boxRef} className="relative">
        {children}
        <InsideNotes notes={notes} hand={hand} />
        <BesideNotes notes={notes} hand={hand} size={size} />
        <LongArrows notes={notes} size={size} />
      </div>
      <NoteRow notes={notes} side="below" hand={hand} steady={steady} />
      {phoneList ? (
        <ul
          className={`${hand} mt-3 space-y-1 text-base leading-tight text-white/80 sm:hidden`}
        >
          {notes.map((n) => (
            <li key={n.text}>{n.text}</li>
          ))}
        </ul>
      ) : (
        <ul className="sr-only">
          {notes.map((n) => (
            <li key={n.text}>{n.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
