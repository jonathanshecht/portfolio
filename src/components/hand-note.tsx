"use client";

import { useEffect, useRef, useState } from "react";

// A takeaway written by hand, with a loose loop drawn around it. Once the note scrolls into the
// lower part of the window, the pen starts at the top left and circles the text clockwise, ending
// with a small overshoot past where it began. Shown already drawn to visitors who prefer reduced
// motion.

// The loop in the note's own pixels, so it draws at an even speed all the way around: a slightly
// uneven oval a little bigger than the text, starting top left and overshooting at the end.
function loop(w: number, h: number) {
  const x = (f: number) => (f * w).toFixed(1);
  const y = (f: number) => (f * h).toFixed(1);
  return [
    `M${x(0.1)} ${y(0.1)}`,
    `C${x(0.35)} ${y(-0.04)} ${x(0.75)} ${y(-0.05)} ${x(0.93)} ${y(0.08)}`,
    `C${x(1.03)} ${y(0.2)} ${x(1.02)} ${y(0.75)} ${x(0.92)} ${y(0.92)}`,
    `C${x(0.7)} ${y(1.04)} ${x(0.28)} ${y(1.05)} ${x(0.07)} ${y(0.9)}`,
    `C${x(-0.03)} ${y(0.75)} ${x(-0.02)} ${y(0.22)} ${x(0.14)} ${y(0.06)}`,
    `C${x(0.2)} ${y(0.01)} ${x(0.26)} ${y(-0.01)} ${x(0.3)} ${y(-0.02)}`,
  ].join(" ");
}

export function HandNote({ text, hand }: { text: string; hand: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const box = e.borderBoxSize[0];
      setSize({ w: box.inlineSize, h: box.blockSize });
    });
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className="mt-12 flex justify-center">
      <p
        ref={ref}
        className={`${hand} relative max-w-[460px] -rotate-1 px-9 py-6 text-center text-xl leading-snug text-balance text-white sm:text-[22px]`}
      >
        {text}
        {size.w > 0 && (
          <svg
            aria-hidden
            width={size.w}
            height={size.h}
            className="pointer-events-none absolute inset-0 overflow-visible text-white/85"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d={loop(size.w, size.h)}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={drawn ? 0 : 1}
              className="transition-[stroke-dashoffset] duration-[1400ms] ease-in-out motion-reduce:transition-none"
            />
          </svg>
        )}
      </p>
    </div>
  );
}
