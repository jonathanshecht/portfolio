"use client";

import Image from "next/image";
import { useState } from "react";
import type { Img } from "@/data/site";
import { Annotated, type Annotation } from "./velo/annotations";

type Version = Img & { label: string; alt: string; notes: Annotation[] };

// Where a version sits relative to the current one: 0 is the middle, -1 and 1 peek from the left
// and right, anything further waits out of sight. The strip loops, so the last version peeks
// from the left of the first.
const PEEK = 0.6; // a peek's size, as a share of the middle frame
const REACH = 0.41; // how far a peek sticks out past the middle frame, as a share of its width
function slot(offset: number) {
  const d = Math.abs(offset);
  // A peek tucks partly behind the middle frame and sticks out from its side, ending just inside
  // the column so its outer edge is never cut off.
  const peekX = (0.5 + REACH - PEEK / 2) * 100;
  return {
    x: d === 0 ? 0 : Math.sign(offset) * (d === 1 ? peekX : peekX + 60),
    scale: d === 0 ? 1 : PEEK,
    blur: d === 0 ? 0 : 5,
    opacity: d === 0 ? 1 : d === 1 ? 0.55 : 0,
  };
}

// The shortest way around the loop from version `from` to version i. With an even count, the
// version opposite could sit either side; it stays on the side it was on before.
function offsetsFor(from: number, n: number, before?: number[]) {
  return Array.from({ length: n }, (_, i) => {
    let o = (((i - from) % n) + n) % n;
    if (o > n / 2) o -= n;
    if (o === n / 2 && before && before[i] < 0) o = -o;
    return o;
  });
}

// Versions of a screen side by side like a filmstrip: the current one in the middle with its
// handwritten notes, its neighbors peeking in from each side, smaller and blurred. Clicking a
// neighbor (or a dot) slides the strip over to it.
export function PeekVersions({
  versions,
  hand,
  aspect,
}: {
  versions: Version[];
  hand: string;
  aspect: string;
}) {
  const n = versions.length;
  // The current version, every version's place around it, and where they were a step ago (to
  // spot the one that wraps around the loop).
  const [state, setState] = useState(() => ({
    index: 0,
    offsets: offsetsFor(0, n),
    previous: null as number[] | null,
  }));
  const { index, offsets, previous } = state;
  const v = versions[index];
  const setIndex = (i: number) =>
    setState((st) => ({
      index: i,
      offsets: offsetsFor(i, n, st.offsets),
      previous: st.offsets,
    }));

  return (
    // overflow-x-clip keeps anything sliding out of sight from widening the page.
    <figure className="overflow-x-clip py-1">
      <div className="mx-auto w-full max-w-[440px]">
        <Annotated notes={v.notes} hand={hand} steady tall>
          <div className="relative" style={{ aspectRatio: aspect }}>
            {versions.map((x, i) => {
              const offset = offsets[i];
              const s = slot(offset);
              const isCurrent = offset === 0;
              const isPeek = Math.abs(offset) === 1;
              // A version jumping from one side to the other (wrapping around the loop) moves
              // instantly while hidden and only fades, so it never streaks across the strip.
              const wraps =
                previous !== null && Math.abs(previous[i] - offset) > 1;
              return (
                <button
                  key={x.src}
                  type="button"
                  tabIndex={isPeek ? 0 : -1}
                  aria-hidden={!isPeek}
                  aria-label={
                    isPeek ? `Show ${x.label.toLowerCase()}` : undefined
                  }
                  onClick={() => isPeek && setIndex(i)}
                  className={`absolute inset-0 overflow-hidden rounded-lg border border-white/15 bg-[#0b0b0d] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 motion-reduce:transition-none ${
                    isPeek
                      ? "cursor-pointer hover:brightness-150 max-sm:invisible"
                      : isCurrent
                        ? "cursor-default"
                        : "pointer-events-none"
                  } ${
                    wraps
                      ? "transition-[opacity] duration-500"
                      : "transition-[transform,filter,opacity] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  }`}
                  style={{
                    transform: `translateX(${s.x}%) scale(${s.scale})`,
                    filter: s.blur ? `blur(${s.blur}px)` : "none",
                    opacity: s.opacity,
                    zIndex: isCurrent ? 3 : isPeek ? 2 : 1,
                  }}
                >
                  <Image
                    src={x.src}
                    alt={isCurrent ? x.alt : ""}
                    width={x.width}
                    height={x.height}
                    sizes="(min-width: 640px) 440px, 100vw"
                    quality={90}
                    // All loaded up front, so a version is ready the moment it slides in.
                    loading="eager"
                    className="size-full object-cover object-top"
                  />
                </button>
              );
            })}
          </div>
        </Annotated>
        <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white/50">
          <span aria-live="polite">{v.label}</span>
          {/* One dot per version; the current one is in the accent color and wider. */}
          <span className="flex items-center gap-1.5">
            {versions.map((x, i) => (
              <button
                key={x.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${x.label.toLowerCase()}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${
                  i === index
                    ? "w-5 bg-(--accent)"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
