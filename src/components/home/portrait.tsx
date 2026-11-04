"use client";

import { Music2 } from "lucide-react";
import { Mynerve } from "next/font/google";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GraffitiFilter } from "@/components/home/graffiti-filter";
import { GlassGhost } from "@/components/home/peeking-ghost";
import { NowPlaying } from "@/components/home/now-playing";
import { about } from "@/data/site";
import { useSong } from "@/lib/use-song";

// Same handwriting as the home page's "psst… play me".
const handwriting = Mynerve({ subsets: ["latin"], weight: "400" });

// The About portrait: the photo in a rounded white frame, drawn on in white: wired earphones (one
// earbud in his ear, the other wire coming out from under his chin, joining in a Y and running
// off the bottom) and the site's little glass ghost perched on his shoulder, whose eyes follow
// the cursor. The ghost says it wants to listen too, and a little cursor shows how: drag the
// earbud onto the ghost (or tap it) and the ghost gets the music: it dances, with the earbud
// staying on its head, and notes float up like the home page piano's. Let go anywhere else, or
// tap it again, and the earbud springs back to his ear.

// Points are in % of the frame, in the earphones' own coordinates: the drawing was traced from a
// mockup whose photo sits a little lower-right in its frame, so it's all drawn shifted by OFFSET.
const OFFSET = { x: -3.2, y: -2.9 };
const EAR = { x: 58, y: 41.3 }; // the earbud in his ear
const SPLIT = { x: 44.7, y: 71.4 }; // where the two wires join
// Where the earbud sits on the ghost: against the side of its head, in px from the ghost's
// top-left. It's tracked live from a marker inside the ghost, so it moves as the ghost dances.
const GHOST_EAR_PX = { x: 3.6, y: 19.9 };
const SNAP = 10; // how close (in %) a dropped earbud must be to the ghost to stay there
const RETURN_MS = 450;
const NOTE_EVERY_MS = 420; // on average; each gap is jittered
const FLOAT_MS = 1300; // matches .note-float in globals.css

type Point = { x: number; y: number };
type Note = {
  id: number;
  x: number;
  drift: number;
  tilt: number;
  size: number;
  blur: number;
};

// The wire from the split up to the earbud. At rest it follows the traced curve (up the side of
// his neck); stretched farther, it sags in the middle.
function wirePath(b: Point) {
  const dx = b.x - SPLIT.x;
  const dy = b.y - SPLIT.y;
  const sag = Math.max(0, Math.hypot(dx, dy) - 33) * 0.15;
  const c1 = { x: SPLIT.x + dx * 0.36, y: SPLIT.y + dy * 0.28 + sag };
  const c2 = { x: b.x - dx * 0.03, y: b.y - dy * 0.29 + sag };
  const n = (v: number) => v.toFixed(2);
  return `M${n(SPLIT.x)} ${n(SPLIT.y)}C${n(c1.x)} ${n(c1.y)} ${n(c2.x)} ${n(c2.y)} ${n(b.x)} ${n(b.y)}`;
}

// A quick ease with a small overshoot, for the earbud springing into place.
const easeOutBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

export function Portrait({ className = "" }: { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [bud, setBud] = useState<Point>(EAR);
  const budRef = useRef<Point>(EAR);
  const [sharing, setSharing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [shared, setShared] = useState(false); // has it ever been shared (hides the hint)
  const [notes, setNotes] = useState<Note[]>([]);
  const noteId = useRef(0);
  const tween = useRef(0);
  const drag = useRef<{ id: number; moved: boolean; start: Point } | null>(
    null,
  );
  const anchorRef = useRef<HTMLSpanElement>(null);
  const gliding = useRef(false);

  const place = useCallback((p: Point) => {
    budRef.current = p;
    setBud(p);
  }, []);

  // The spot on the ghost's head right now (it moves while the ghost dances), in the
  // earphones' coordinates.
  const ghostEar = useCallback((): Point => {
    const f = frameRef.current?.getBoundingClientRect();
    const a = anchorRef.current?.getBoundingClientRect();
    if (!f || !a) return EAR;
    return {
      x: ((a.left - f.left) / f.width) * 100 - OFFSET.x,
      y: ((a.top - f.top) / f.height) * 100 - OFFSET.y,
    };
  }, []);

  // Glide the earbud to a spot (or a moving one), with a small overshoot.
  const glideTo = useCallback(
    (target: Point | (() => Point)) => {
      cancelAnimationFrame(tween.current);
      const to = typeof target === "function" ? target : () => target;
      const from = budRef.current;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        place(to());
        return;
      }
      gliding.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / RETURN_MS);
        const k = easeOutBack(t);
        const end = to();
        place({
          x: from.x + (end.x - from.x) * k,
          y: from.y + (end.y - from.y) * k,
        });
        if (t < 1) tween.current = requestAnimationFrame(step);
        else gliding.current = false;
      };
      tween.current = requestAnimationFrame(step);
    },
    [place],
  );
  useEffect(() => () => cancelAnimationFrame(tween.current), []);

  // The song plays while the ghost has the earbud. It's started right in the tap or drop, since
  // browsers only allow sound in response to one.
  const song = useSong(about.song.src);
  // Paused from the "now playing" card: the earbud stays on the ghost, but the music, the
  // dancing and the notes stop until it's played again.
  const [paused, setPaused] = useState(false);
  const playing = sharing && !paused;

  const share = useCallback(() => {
    setSharing(true);
    setShared(true);
    setPaused(false);
    glideTo(ghostEar);
    song.play();
  }, [glideTo, ghostEar, song]);

  const unshare = useCallback(() => {
    setSharing(false);
    setPaused(false);
    glideTo(EAR);
    song.stop();
  }, [glideTo, song]);

  const togglePause = useCallback(() => {
    if (paused) song.play(true);
    else song.stop();
    setPaused(!paused);
  }, [paused, song]);

  // While the ghost has the earbud (even with the song paused), my name glows.
  useEffect(() => {
    const sign = document.querySelector("[data-glow-name]");
    sign?.toggleAttribute("data-on", sharing);
    return () => sign?.removeAttribute("data-on");
  }, [sharing]);

  // While the ghost has it, the earbud stays on the ghost's head as it dances.
  useEffect(() => {
    if (!sharing || dragging) return;
    let raf = 0;
    const follow = () => {
      if (!gliding.current) place(ghostEar());
      raf = requestAnimationFrame(follow);
    };
    raf = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(raf);
  }, [sharing, dragging, place, ghostEar]);

  // While the ghost has the music, notes float up from it, like the home page piano's: each from
  // a slightly different spot over its head, about a third of them bigger and a little out of
  // focus (as if closer to the viewer).
  useEffect(() => {
    if (!playing) return;
    let timer = 0;
    const spawn = () => {
      const id = ++noteId.current;
      const drift = (Math.random() * 2 - 1) * 14;
      const near = Math.random() < 0.35;
      setNotes((ns) => [
        ...ns,
        {
          id,
          x: (Math.random() * 2 - 1) * 10,
          drift,
          tilt: drift * 0.6 + (Math.random() * 2 - 1) * 6,
          size: near ? 17 + Math.random() * 4 : 13 + Math.random() * 2,
          blur: near ? 0.6 + Math.random() * 0.8 : 0,
        },
      ]);
      // Fallback cleanup in case animationend never fires (e.g. a hidden tab).
      window.setTimeout(
        () => setNotes((ns) => ns.filter((n) => n.id !== id)),
        FLOAT_MS + 300,
      );
      timer = window.setTimeout(
        spawn,
        NOTE_EVERY_MS * (0.6 + Math.random() * 0.8),
      );
    };
    spawn();
    return () => window.clearTimeout(timer);
  }, [playing]);

  // Pointer position as a point in the earphones' coordinates, kept inside the frame.
  const toPoint = (e: React.PointerEvent) => {
    const r = frameRef.current!.getBoundingClientRect();
    const clamp = (v: number) => Math.max(4, Math.min(96, v));
    return {
      x: clamp(((e.clientX - r.left) / r.width) * 100) - OFFSET.x,
      y: clamp(((e.clientY - r.top) / r.height) * 100) - OFFSET.y,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimationFrame(tween.current);
    gliding.current = false;
    drag.current = { id: e.pointerId, moved: false, start: toPoint(e) };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const p = toPoint(e);
    if (!d.moved && Math.hypot(p.x - d.start.x, p.y - d.start.y) < 1.5) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
    }
    place(p);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (!d.moved) {
      // A tap: hand it over, or take it back.
      if (sharing) unshare();
      else share();
      return;
    }
    const b = budRef.current;
    const g = ghostEar();
    if (Math.hypot(b.x - g.x, b.y - g.y) < SNAP) share();
    else unshare();
  };

  const pct = (v: number) => `${v.toFixed(2)}%`;

  return (
    <div
      ref={frameRef}
      className={`relative aspect-square w-full select-none ${className}`}
    >
      {/* The framed photo. The ghost sits in its own layer above it, so its speech line can reach past the frame. */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border-[1.5px] border-white/85 bg-[#010101]">
        <Image
          src="/about/jonathan.jpg"
          alt="Jonathan smiling, in a red sweater, wearing earphones, with a little ghost on his shoulder"
          fill
          // A dark photo gets blotchy at the default compression.
          quality={90}
          sizes="(min-width: 640px) 312px, 100vw"
          priority
          draggable={false}
          className="object-cover"
        />
        {/* Earphones. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          fill="none"
          stroke="white"
          strokeWidth={0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <g transform={`translate(${OFFSET.x} ${OFFSET.y})`}>
            {/* From under his chin (the other earbud is hidden behind his face) to the split. */}
            <path d="M41.6 54.4C41.8 57 42.1 58.6 42.6 60.6C43.3 63.2 44.4 65.5 44.8 67.6C45.1 69.2 45 70.4 44.7 71.4" />
            {/* One cable from the split off the bottom of the photo. */}
            <path d="M44.7 71.4C43.8 72.7 43.4 73.6 43.1 75C42.7 76.6 42.4 78.2 42.3 79.9C42.1 82.4 42.3 85.2 42 87.2C41.7 89 40.9 90 39.9 91.2C37.8 94 35.6 97 33 103" />
            {/* The wire up to the earbud, wherever it is. */}
            <path d={wirePath(bud)} />
            <ellipse
              cx={bud.x.toFixed(2)}
              cy={bud.y.toFixed(2)}
              rx="0.6"
              ry="1.1"
              fill="white"
              stroke="none"
            />
          </g>
        </svg>

        {/* The earbud's handle: a bigger, invisible target over it, for dragging or tapping. */}
        <button
          type="button"
          aria-label={
            sharing
              ? "Take the earbud back from the ghost"
              : "Share the earbud with the ghost"
          }
          aria-pressed={sharing}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          // Keyboard: Enter or Space hands it over or takes it back.
          onClick={(e) => {
            if (e.detail !== 0) return; // pointer taps are handled on pointer up
            if (sharing) unshare();
            else share();
          }}
          className={`absolute size-7 -translate-1/2 touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#E5484D] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ left: pct(bud.x + OFFSET.x), top: pct(bud.y + OFFSET.y) }}
        />
        <NowPlaying
          song={about.song}
          shown={sharing}
          paused={paused}
          onTogglePause={togglePause}
        />
      </div>

      {/* The ghost's layer, lined up with the inside of the frame (the hint cursor is on
          top of the ghost). */}
      <div className="pointer-events-none absolute inset-[1.5px] z-10">
        {/* Sitting on top of his shoulder, upright: centered at 64.6% across, with the bottom of its
          hem (about 43px down the ghost) at 59% down. It bops while it has the music. */}
        <div className="absolute top-[calc(59%-43px)] left-[calc(64.6%-23px)]">
          <div className="relative">
            {/* What the ghost says: a little handwritten line up and to its right, with a short
            stroke pointing back at it, like a comic speech line. It goes once it has had a turn. */}
            <div
              aria-hidden
              className={`pointer-events-none absolute bottom-[calc(100%-4px)] left-[calc(100%-6px)] flex items-end text-white/85 transition-opacity duration-500 ${shared ? "opacity-0" : "opacity-100"}`}
            >
              <svg
                viewBox="0 0 14 14"
                className="mb-[-2px] size-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
              >
                <path d="M1.5 12.5C4 9.5 7 6.5 11.5 3" />
              </svg>
              <span
                className={`${handwriting.className} -mb-2 -rotate-6 text-[15px] leading-[1.05] whitespace-nowrap`}
              >
                I want to
                <br />
                listen too!
              </span>
            </div>
            {/* Notes floating up out of the ghost, like the piano's. They're drawn before
                the ghost and start a little way down inside it, so each one rises out from
                behind it (seen softly through its frosted glass at first). */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-4 left-1/2"
            >
              {notes.map((note) => (
                <span
                  key={note.id}
                  className="note-float absolute top-0 text-[#E5484D]"
                  style={{
                    left: note.x,
                    filter: `${note.blur ? `blur(${note.blur.toFixed(2)}px) ` : ""}drop-shadow(0 0 6px rgba(229, 72, 77, 0.35))`,
                    ["--drift" as string]: `${note.drift}px`,
                    ["--tilt" as string]: `${note.tilt}deg`,
                  }}
                  onAnimationEnd={() =>
                    setNotes((ns) => ns.filter((x) => x.id !== note.id))
                  }
                >
                  <Music2
                    style={{ width: note.size, height: note.size }}
                    strokeWidth={1.5}
                  />
                </span>
              ))}
            </div>
            <div
              className={`relative origin-bottom ${playing ? "motion-safe:animate-[ghost-dance_0.9s_ease-in-out_infinite]" : ""}`}
            >
              <GlassGhost className="relative text-white" />
              {/* Marks where the earbud sits on its head, so the earbud can follow it. */}
              <span
                ref={anchorRef}
                className="absolute size-0"
                style={{ left: GHOST_EAR_PX.x, top: GHOST_EAR_PX.y }}
              />
            </div>
          </div>
        </div>
        {/* A little cursor showing what to do: it picks up the earbud, carries it down to the
            ghost, and lets go (in front of the ghost), every few seconds, until the ghost has had a turn. */}
        {!shared && !dragging && (
          <div
            aria-hidden
            className="drag-demo pointer-events-none absolute"
            style={
              {
                "--from-x": pct(EAR.x + OFFSET.x),
                "--from-y": pct(EAR.y + OFFSET.y),
                // The ghost's ear: its top-left corner plus the earbud spot.
                "--to-x": `calc(64.6% - 23px + ${GHOST_EAR_PX.x}px)`,
                "--to-y": `calc(59% - 43px + ${GHOST_EAR_PX.y}px)`,
              } as React.CSSProperties
            }
          >
            {/* A little pointing hand: one closed shape (traced from lucide's Pointer, whose
              open strokes left see-through gaps), solid black with a white outline (like the ghost), and the
              same sprayed-on edge as the logo (the filter is rendered
              at the end of this component). The fingertip sits on the point. */}
            <svg
              viewBox="0 0 24 24"
              className="-mt-[1.7px] -ml-[6.7px] size-5 overflow-visible [filter:url(#graffiti-spray)]"
              fill="#010101"
              stroke="white"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 14V4a2 2 0 0 1 4 0v5a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82Z" />
              {/* Lines between the fingers. */}
              <path fill="none" d="M10 9v2.5M14 10v2M18 11v1.5" />
            </svg>
          </div>
        )}
      </div>
      <GraffitiFilter />
    </div>
  );
}
