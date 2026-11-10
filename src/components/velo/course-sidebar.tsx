import { Check, ChevronDown, ChevronRight, Lock } from "lucide-react";
import type { ReactNode } from "react";

// A small hand-drawn arrow pointing toward the sidebar, like the notes on the logo explorations.
function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 34 14"
      aria-hidden
      className={`h-[14px] w-[34px] shrink-0 overflow-visible ${flip ? "-scale-x-100" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9 C 10 3, 22 3, 31 7" />
      <path d="M26 3.5 L31.5 7.2 L26.5 11" />
    </svg>
  );
}

// One row of the sidebar, with an optional handwritten note to its left or right. The notes sit
// in the same grid row as what they describe, so the arrows always line up. `span` lets a note
// cover several rows (it's placed on the first and spans down).
type Row = {
  content: ReactNode;
  left?: string;
  right?: string;
  span?: number;
};

// The course sidebar as I designed it, opened on Chapter 1, with notes pointing out how the course
// is built. Static on purpose, so the notes always point at the right rows. On phones the notes are
// hidden and the sidebar sits alone (the text above says the same thing).
export function CourseSidebar({ font, hand }: { font: string; hand: string }) {
  const step = "py-2 pr-3 pl-[60px] text-white/60";
  const chapter = "flex items-center gap-2 py-2 pr-3 pl-[40px] font-semibold";
  const locked =
    "flex items-start gap-2 border-l-2 border-transparent px-4 py-3 text-white/40";

  const rows: Row[] = [
    {
      content: (
        <div className="flex items-start gap-3.5 border-l-2 border-[#f4f88a] bg-[#2a2a24] px-4 py-3">
          <ChevronDown aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <span className="block text-sm leading-snug font-semibold">
              Lesson 1: Understanding Your Camera
            </span>
            <span className="mt-1 block text-xs text-white/50">~30 min</span>
            {/* Progress through the lesson: 1 of its 12 steps (the video) is done. */}
            <span className="mt-2.5 block text-xs text-white/50">
              8% complete
            </span>
            <span className="mt-1.5 block h-1 w-[200px] overflow-hidden rounded-full bg-white/15">
              <span className="block h-full w-[8%] rounded-full bg-[#f4f88a]" />
            </span>
          </span>
        </div>
      ),
    },
    {
      content: (
        <div className={`${chapter} mt-2`}>
          <ChevronDown aria-hidden className="size-3.5 shrink-0" />
          Chapter 1: Aperture
        </div>
      ),
    },
    {
      // Already watched: a quiet check, like the real course shows.
      content: (
        <div className={`${step} flex items-center justify-between`}>
          Video
          <Check aria-label="Completed" className="size-3.5 text-white/50" />
        </div>
      ),
      left: "learn: video + interactive reading",
      span: 2,
    },
    {
      content: (
        <div className="py-0.5 pr-3 pl-[48px]">
          <div className="flex items-center gap-2 rounded-md bg-[#2a2a2f] px-3 py-1.5 text-white">
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-[#f4f88a]"
            />
            Reading
          </div>
        </div>
      ),
    },
    { content: <div className={step}>Field Test</div>, left: "practice" },
    { content: <div className={step}>Knowledge Check</div>, left: "review" },
    {
      content: (
        <div className={chapter}>
          <ChevronRight
            aria-hidden
            className="size-3.5 shrink-0 text-white/50"
          />
          Chapter 2: Shutter Speed
        </div>
      ),
    },
    {
      content: (
        <div className={chapter}>
          <ChevronRight
            aria-hidden
            className="size-3.5 shrink-0 text-white/50"
          />
          Chapter 3: ISO
        </div>
      ),
    },
    {
      content: (
        <div className="flex items-center justify-between gap-2 pt-2 pr-3 pb-3 pl-[26px] font-semibold text-white/50">
          Lesson 1 Assignment
          <span className="flex items-center gap-1 rounded-full bg-[#2a2a24] px-2 py-1 text-[11px] leading-none text-[#f4f88a]">
            <Lock aria-hidden className="size-3" />
            Premium
          </span>
        </div>
      ),
      right: "premium: personal feedback from the instructor",
    },
    {
      content: (
        <div className={locked}>
          <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <span className="block text-sm leading-snug font-semibold">
              Lesson 2: Lighting
            </span>
            <span className="mt-1 block text-xs">~40 min</span>
          </span>
        </div>
      ),
      right: "only the first lesson is free",
      span: 2,
    },
    {
      content: (
        <div className={`${locked} pb-4`}>
          <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <span className="block text-sm leading-snug font-semibold">
              Lesson 3: Shot Composition
            </span>
            <span className="mt-1 block text-xs">~24 min</span>
          </span>
        </div>
      ),
    },
  ];

  const note = `${hand} hidden items-center gap-1.5 text-[15px] leading-tight text-white/80 sm:flex`;

  return (
    <div
      role="img"
      aria-label="The Velo course sidebar: Lesson 1 opened to Chapter 1, whose steps are a video, a reading, a field test and a knowledge check, then a Premium assignment, with Lessons 2 and 3 locked."
      className="mx-auto grid max-w-[300px] grid-cols-1 sm:max-w-none sm:grid-cols-[1fr_300px_1fr] sm:gap-x-3"
    >
      {rows.map((row, i) => {
        const first = i === 0;
        const last = i === rows.length - 1;
        const r = i + 1;
        return (
          <div key={i} className="contents">
            {row.left && (
              <span
                className={`${note} justify-end text-right sm:col-start-1`}
                style={{ gridRow: `${r} / span ${row.span ?? 1}` }}
              >
                <span className="-rotate-2">{row.left}</span>
                <Arrow />
              </span>
            )}
            <div
              className={`${font} border-x border-white/15 bg-[#1b1b21] text-[13px] text-white sm:col-start-2 ${
                first ? "overflow-hidden rounded-t-lg border-t" : ""
              } ${last ? "rounded-b-lg border-b" : ""}`}
              style={{ gridRow: r }}
            >
              {row.content}
            </div>
            {row.right && (
              <span
                className={`${note} sm:col-start-3`}
                style={{ gridRow: `${r} / span ${row.span ?? 1}` }}
              >
                <Arrow flip />
                <span className="rotate-2">{row.right}</span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
