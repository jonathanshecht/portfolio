"use client";

import { useEffect, useRef } from "react";
import { handwriting } from "@/lib/fonts";
import { GlassGhost } from "./peeking-ghost";

// The empty slot after the last project: an empty frame the same size as the project cards, with
// the site's little glass ghost sitting on its bottom edge, saying more is on the way.
//
// The ghost feels the scrolling the way the broken piano's pieces do: when the scroll speeds up
// or stops suddenly, it gets tossed up, tilts a little, and comes down in a few quick, shrinking
// bounces, squishing like slime each time it lands, then stays wherever it landed. It can also
// be grabbed and thrown, like the piano's pieces. Its words travel with it but stay level, and switch to
// its left when it's too close to the right edge. Its eyes follow the cursor, like everywhere
// else. Visitors who prefer reduced motion get a ghost that just sits there.

// Per 60th of a second.
const GRAVITY = 0.22;
const AIR = 0.982; // velocity kept each frame in the air
const BOUNCE = 0.5; // speed kept when bouncing off the floor, a side or the top
const FLOOR_FRICTION = 0.85; // sideways speed kept each frame while on the floor
const KICK = 0.15; // how hard a change in scroll speed pushes
const MAX_KICK = 5;
const TILT_SPRING = 0.09;
const TILT_DAMP = 0.88;
const EDGE = 8; // px it keeps from the frame's edges
// Soft like slime: landing squashes it flat and wide, then it wobbles back into shape on a
// springy "jelly"; moving fast stretches it a little taller.
const SQUASH_PER_HIT = 0.024; // squash added per px/frame of landing speed
const MAX_SQUASH = 0.13;
const JELLY_SPRING = 0.22;
const JELLY_DAMP = 0.78;
const STRETCH = 0.012; // stretch per px/frame of speed in the air
const MAX_STRETCH = 0.12;

export function ComingSoonTile() {
  const frameRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frameEl = frameRef.current;
    const ghost = ghostRef.current;
    const speech = speechRef.current;
    if (!frameEl || !ghost || !speech) return;

    // Offset from its resting spot, in px (up is negative), and the tilt, in degrees.
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;
    let angle = 0;
    let spin = 0;
    // How squashed it is (positive: flat and wide; negative: tall and thin), and how fast that's
    // changing.
    let squash = 0;
    let squashV = 0;
    let raf = 0;
    let last = 0;
    let lastScroll = window.scrollY;
    let scrollSpeed = 0;
    // While it's held: where the pointer wants it, and the grab point's offset from its origin.
    let drag: {
      id: number;
      offX: number;
      offY: number;
      tx: number;
      ty: number;
    } | null = null;

    // Where it can go: from its resting spot, out to the frame's sides and up to the top.
    const bounds = () => {
      const frame = frameEl.getBoundingClientRect();
      const halfW = ghost.offsetWidth / 2;
      return {
        frame,
        maxX: frame.width / 2 - halfW - EDGE,
        minY: -(frame.height - ghost.offsetHeight - EDGE - 10),
        // Its resting spot (bottom center) on screen.
        cx: frame.left + frame.width / 2,
        floor: frame.bottom - 10,
      };
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(50, now - last) : 1000 / 60;
      last = now;
      const f = dt / (1000 / 60);

      // A sharp change in scroll speed tosses it, as with the piano's pieces: a sudden stop after
      // scrolling down throws it up.
      const speed = (window.scrollY - lastScroll) / f;
      const change = speed - scrollSpeed;
      lastScroll = window.scrollY;
      scrollSpeed = speed;
      if (Math.abs(change) > 1) {
        const kick = Math.max(-MAX_KICK, Math.min(MAX_KICK, change * KICK));
        // Pushing off the floor, it squishes down first (anticipation), then stretches as it
        // flies; pushed into the floor, it just squishes.
        if (y === 0 && !drag) squashV += Math.min(0.12, Math.abs(kick) * 0.025);
        vy += kick;
        vx += (Math.random() - 0.5) * Math.abs(kick) * 0.7;
        spin += (Math.random() - 0.5) * Math.abs(kick) * 1.4;
      }

      const b = bounds();
      if (drag) {
        // Held: it follows the pointer, and its speed is how fast it's being moved, so letting
        // go throws it. It leans into the motion.
        const nx = Math.max(-b.maxX, Math.min(b.maxX, drag.tx));
        const ny = Math.max(b.minY, Math.min(0, drag.ty));
        vx = vx * 0.5 + ((nx - x) / f) * 0.5;
        vy = vy * 0.5 + ((ny - y) / f) * 0.5;
        x = nx;
        y = ny;
        spin = (spin + (vx * 1.2 - angle) * 0.2 * f) * TILT_DAMP ** f;
        angle = Math.max(-25, Math.min(25, angle + spin * f));
      } else {
        vy += GRAVITY * f;
        vx *= AIR ** f;
        vy *= AIR ** f;
        x += vx * f;
        y += vy * f;
        // It tilts a little in the air and rights itself.
        spin = (spin - TILT_SPRING * angle * f) * TILT_DAMP ** f;
        angle = Math.max(-25, Math.min(25, angle + spin * f));
      }

      // The floor: it lands with a few shrinking bounces, then stops.
      if (!drag && y >= 0) {
        // The harder it lands, the more it squishes.
        if (vy > 0.8) squashV += Math.min(MAX_SQUASH, vy * SQUASH_PER_HIT);
        y = 0;
        vy = vy > 0.8 ? -vy * BOUNCE : 0;
        vx *= FLOOR_FRICTION ** f;
      }
      // The jelly: squash springs back toward its shape (a little stretched while flying fast),
      // overshooting a few times so it wobbles.
      const stretchTarget =
        y < 0 ? -Math.min(MAX_STRETCH, Math.abs(vy) * STRETCH) : 0;
      squashV =
        (squashV + (stretchTarget - squash) * JELLY_SPRING * f) *
        JELLY_DAMP ** f;
      squash = Math.max(
        -MAX_STRETCH,
        Math.min(MAX_SQUASH, squash + squashV * f),
      );
      // The sides and the top: it bounces back off them, squishing sideways off a wall.
      if (!drag) {
        if (Math.abs(x) > b.maxX) {
          squashV -= Math.min(0.1, Math.abs(vx) * 0.02);
          x = Math.sign(x) * b.maxX;
          vx = -vx * BOUNCE;
          spin -= vx * 1.5;
        }
        if (y < b.minY) {
          y = b.minY;
          vy = Math.abs(vy) * BOUNCE;
        }
      }
      const frame = b.frame;
      const box = ghost.getBoundingClientRect();

      const move = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      ghost.style.transform = `${move} rotate(${angle.toFixed(1)}deg) scale(${(1 + squash).toFixed(3)}, ${(1 - squash).toFixed(3)})`;
      // The words go wherever the ghost goes, but stay level. Near the right side there's no
      // room for them on the ghost's right, so they switch to its left (and back once there's
      // room again; the gap between the two limits stops them flickering at the edge).
      speech.style.transform = move;
      const roomRight = frame.right - box.right;
      const need = speech.offsetWidth + 12;
      if (speech.dataset.side !== "left" && roomRight < need)
        speech.dataset.side = "left";
      else if (speech.dataset.side === "left" && roomRight > need + 24)
        speech.dataset.side = "right";

      const still =
        !drag &&
        y === 0 &&
        vy === 0 &&
        Math.abs(vx) < 0.05 &&
        Math.abs(angle) < 0.2 &&
        Math.abs(spin) < 0.05 &&
        Math.abs(squash) < 0.004 &&
        Math.abs(squashV) < 0.004 &&
        Math.abs(scrollSpeed) < 0.5;
      if (still) {
        // It stays wherever it landed, upright.
        angle = spin = vx = squash = squashV = 0;
        ghost.style.transform = `translate(${x.toFixed(1)}px, 0px)`;
        speech.style.transform = `translate(${x.toFixed(1)}px, 0px)`;
        last = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", wake, { passive: true });

    // Grab it and throw it, like the piano's pieces.
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const b = bounds();
      const rx = e.clientX - b.cx;
      const ry = e.clientY - b.floor;
      drag = { id: e.pointerId, offX: x - rx, offY: y - ry, tx: x, ty: y };
      ghost.setPointerCapture(e.pointerId);
      ghost.style.cursor = "grabbing";
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const b = bounds();
      drag.tx = e.clientX - b.cx + drag.offX;
      drag.ty = e.clientY - b.floor + drag.offY;
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      ghost.style.cursor = "";
      // A throw, but not so hard it pins itself to a wall.
      vx = Math.max(-22, Math.min(22, vx));
      vy = Math.max(-22, Math.min(22, vy));
      wake();
    };
    ghost.addEventListener("pointerdown", onDown);
    ghost.addEventListener("pointermove", onMove);
    ghost.addEventListener("pointerup", onUp);
    ghost.addEventListener("pointercancel", onUp);
    // If the browser takes the pointer away without a release, let go anyway.
    ghost.addEventListener("lostpointercapture", onUp);
    return () => {
      ghost.removeEventListener("pointerdown", onDown);
      ghost.removeEventListener("pointermove", onMove);
      ghost.removeEventListener("pointerup", onUp);
      ghost.removeEventListener("pointercancel", onUp);
      ghost.removeEventListener("lostpointercapture", onUp);
      window.removeEventListener("scroll", wake);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // Only where there's an empty slot to fill: the two-column grid. On phones the list just ends.
    <li className="hidden md:block" aria-label="More case studies coming soon">
      <div
        ref={frameRef}
        // Clipped at the sides only: the ghost stays inside, but its words may rise past the
        // top edge when it's thrown high.
        className="relative aspect-[3/2] overflow-x-clip rounded-2xl border border-white/10"
      >
        {/* The ghost sits on the frame's bottom edge, in the middle. */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
          {/* A slow, small bob, so it always looks like it's hovering (the scroll physics move
              the ghost and its words inside this). */}
          <div className="relative motion-safe:animate-[ghost-hover_2.6s_ease-in-out_infinite]">
            {/* What the ghost says: a handwritten line up and to its right, with a short stroke
                pointing back at it, like a comic speech line, the text centered on the stroke. It
                moves with the ghost but never tilts with it. */}
            <div
              ref={speechRef}
              aria-hidden
              data-side="right"
              className="group/speech pointer-events-none absolute bottom-[calc(100%-4px)] left-[calc(100%-6px)] flex items-center gap-1 text-white/85 will-change-transform data-[side=left]:right-[calc(100%-6px)] data-[side=left]:left-auto data-[side=left]:flex-row-reverse"
            >
              <svg
                viewBox="0 0 14 14"
                className="size-3.5 shrink-0 translate-y-1 group-data-[side=left]/speech:-scale-x-100"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
              >
                <path d="M1.5 12.5C4 9.5 7 6.5 11.5 3" />
              </svg>
              <span
                className={`${handwriting.className} -rotate-6 text-[15px] leading-[1.05] whitespace-nowrap group-data-[side=left]/speech:rotate-6 group-data-[side=left]/speech:text-right`}
              >
                more case studies
                <br />
                coming soon!
              </span>
            </div>
            <div
              ref={ghostRef}
              className="relative origin-bottom cursor-grab touch-none will-change-transform select-none"
            >
              <GlassGhost className="relative text-white" />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
