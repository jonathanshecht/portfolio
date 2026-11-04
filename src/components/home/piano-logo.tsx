"use client";

// "JONATHAN" spelled across one octave of piano keys (C to C), and the keys play.
// Geometry is computed from the key width so black keys sit exactly on the white-key
// boundaries and every letter is centered on its key.
// Clicking or tapping a key plays it, and so does typing its letter. Two small buttons beside the
// piano mute or unmute it and switch between four instruments; both choices are remembered.

import {
  AudioWaveform,
  Check,
  Ghost,
  Guitar,
  Music2,
  Piano,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Mynerve } from "next/font/google";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  setInstrument,
  markPlayed,
  resetPlayed,
  setMuted,
  useInstrument,
  useMuted,
  usePlayed,
} from "@/lib/instrument-store";
import {
  INSTRUMENTS,
  noteFrequency,
  playBreakSound,
  playNote,
  playRepairSound,
  playKnock,
  playSettleSound,
  type Instrument,
} from "@/lib/piano-synth";
import {
  startPhysics,
  type PhysicsWorld,
  type PieceSpec,
} from "@/components/home/piano-physics";

// A clean, even handwriting for the "psst… play me" hint.
const handwriting = Mynerve({ subsets: ["latin"], weight: "400" });

const LETTERS = ["J", "O", "N", "A", "T", "H", "A", "N"];
const WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B", "C"];
const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11, 12];
// Sized 15% up from the Figma piano (31px keys, 132px tall).
const KEY = 36; // white key width
const BLACK = { width: 23, height: 87 };
// Black keys sit between C–D, D–E, F–G, G–A and A–B (boundaries after keys 1, 2, 4, 5, 6).
const BLACK_KEYS = [
  { boundary: 1, semitone: 1, name: "C sharp" },
  { boundary: 2, semitone: 3, name: "D sharp" },
  { boundary: 4, semitone: 6, name: "F sharp" },
  { boundary: 5, semitone: 8, name: "G sharp" },
  { boundary: 6, semitone: 10, name: "A sharp" },
];

const INSTRUMENT_INFO: Record<Instrument, { label: string; Icon: LucideIcon }> =
  {
    piano: { label: "Piano", Icon: Piano },
    haunted: { label: "Haunted piano", Icon: Ghost },
    synth: { label: "Synth", Icon: AudioWaveform },
    guitar: { label: "Guitar", Icon: Guitar },
  };

// A small round button showing the current instrument. Clicking it opens a compact menu above it
// (toward the right on desktop, beside the piano; toward the left on phones, where it is near the edge);
// picking an instrument (or clicking anywhere else, or pressing Escape) closes it again.
// Its icon does a tiny dance step on every note played (beat counts the notes), swaying one way,
// then the other.
function InstrumentPicker({
  instrument,
  muted,
  beat,
  className,
}: {
  instrument: Instrument;
  muted: boolean;
  beat: number;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const { Icon, label } = INSTRUMENT_INFO[instrument];
  return (
    <div ref={rootRef} className={className}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Instrument: ${label}. Change instrument`}
        title="Change instrument"
        className={`flex size-7 items-center justify-center rounded-full border transition-colors sm:size-8 ${open ? "border-[#E5484D] text-white" : "border-white/30 text-white/70 hover:border-[#E5484D] hover:text-white focus-visible:border-[#E5484D] focus-visible:text-white"} outline-none`}
      >
        {/* Re-keyed on every beat so the step restarts even mid-step. */}
        <span
          key={beat}
          aria-hidden
          className={`block ${beat === 0 ? "" : beat % 2 ? "icon-dance-left" : "icon-dance-right"}`}
        >
          <Icon className="size-4" strokeWidth={2} />
        </span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Instrument"
          className="absolute top-full right-0 mt-2 min-w-44 rounded-xl sm:top-auto sm:right-auto sm:bottom-full sm:left-0 sm:mt-0 sm:mb-2 border border-white/12 bg-[#111] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {INSTRUMENTS.map((option) => {
            const { Icon: OptionIcon, label: optionLabel } =
              INSTRUMENT_INFO[option];
            const selected = option === instrument;
            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  setInstrument(option);
                  setOpen(false);
                  // A quick preview of the new sound (unless the piano is muted).
                  if (!muted) playNote(noteFrequency(7), option);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors outline-none focus-visible:bg-white/8 ${selected ? "text-white" : "text-white/70 hover:bg-white/8 hover:text-white focus-visible:text-white"}`}
              >
                <OptionIcon
                  aria-hidden
                  className="size-4 shrink-0"
                  strokeWidth={2}
                />
                <span className="flex-1 whitespace-nowrap">{optionLabel}</span>
                {selected && (
                  <Check
                    aria-hidden
                    className="size-4 text-[#E5484D]"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      <path d="M4 9v6h4l5 4V5L8 9Z" />
      {on ? (
        <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
      ) : (
        <path d="m17 9 5 6M22 9l-5 6" />
      )}
    </svg>
  );
}

const NOTE_MS = 1300;
// Like a real piano, the lines between white keys are gaps, not drawn lines: each key has a
// transparent 1.5px edge on its inner sides (its white stops short of it), so side by side they
// leave a 3px gap where the dark background shows through. Falling keys are just plain white.
// The end keys (J and N) have no outer edge and get the piano's rounded corners.
const WHITE_KEY_BASE =
  "relative h-full border-x-[1.5px] border-y-0 border-solid border-transparent bg-clip-padding transition-colors ease-out focus-visible:outline-none";
function keyEnds(i: number) {
  if (i === 0) return "border-l-0 rounded-l-[9px]";
  if (i === LETTERS.length - 1) return "border-r-0 rounded-r-[9px]";
  return "";
}
// Pressed-key color changes quickly.
const KEY_TRANSITION = { transitionDuration: "150ms" };
// Each letter is nudged, tilted and sized slightly differently, so JONATHAN looks hand-lettered
// rather than typeset. Fixed values, so it looks the same on every visit.
const LETTER_WOBBLE = [
  "translateY(0.5px) rotate(-5deg) scale(1.04)",
  "translateY(-1px) rotate(3deg)",
  "translateY(1px) rotate(-2deg) scale(0.96)",
  "translateY(-0.5px) rotate(6deg) scale(1.03)",
  "translateY(1.5px) rotate(-3deg)",
  "translateY(-1px) rotate(2deg) scale(1.05)",
  "translateY(0.5px) rotate(-6deg) scale(0.97)",
  "translateY(-0.5px) rotate(4deg) scale(1.02)",
];

type FloatingNote = {
  id: number;
  x: number;
  drift: number;
  tilt: number;
  size: number;
  blur: number;
};

// The piano starts clean and cracks slowly the more it's played. Notes are counted for the whole
// visit (module scope, so the damage survives navigating away and back) and the damage moves
// through five fixed stages, never going back down. Keep playing past full damage and the piano
// falls apart (stage 6); only then can the visitor repair it, which starts it clean again.
// Paced for people clicking with a mouse: a first crack almost straight away, something new every
// couple of clicks after that, and the break at 15 clicks (about ten seconds of playing), so the
// curious find it while a few casual taps still leave a working piano.
const CRACK_STAGE_AT = [2, 4, 6, 9, 12, 15]; // notes needed to reach stages 1–5, then to break
const BROKEN = 6;
// Interaction phases. Notes only play while "intact" (which includes the cracked stages).
type Phase = "intact" | "breaking" | "broken" | "repairing";
const SEPARATE_AT = 560; // ms of building tremble before the piano snaps
let notesPlayed = 0;
function countNote() {
  return ++notesPlayed;
}
function resetNotes() {
  notesPlayed = 0;
}
// Where a piece sits across the piano: 0 at the cracked N, 1 at the J (used to order the break).
function dropPose(part: HTMLElement, width: number) {
  const center = part.offsetLeft + part.offsetWidth / 2;
  return { fromRight: (width - center) / width };
}
// ---- Breaking apart -------------------------------------------------------------------------
// When the piano breaks, each white key snaps into jagged pieces (the last N, the most cracked,
// into three), with its cracks and letter carried on the pieces; the black keys go whole. After a
// short, building tremble everything lets go within about a third of a second and becomes real
// physical pieces (see piano-physics): they fall, land on the project cards or the bottom of the
// page, and can be grabbed and thrown.

const between = (min: number, max: number) => min + Math.random() * (max - min);

// A jagged fracture across a key of the given width, at about height y: [x, y] points left to right.
function fractureLine(width: number, y: number): [number, number][] {
  const steps = 6;
  return Array.from({ length: steps + 1 }, (_, i) => [
    (i / steps) * width,
    y + (i === 0 || i === steps ? between(-3, 3) : between(-7, 7)),
  ]);
}

// A copy of a key that can live outside the piano as a loose piece.
function loosePiece(key: HTMLElement): HTMLElement {
  const piece = key.cloneNode(true) as HTMLElement;
  piece.removeAttribute("data-part");
  piece.removeAttribute("aria-label");
  piece.setAttribute("aria-hidden", "true");
  piece.tabIndex = -1;
  Object.assign(piece.style, {
    width: `${key.offsetWidth}px`,
    height: `${key.offsetHeight}px`,
    borderRadius: getComputedStyle(key).borderRadius,
    visibility: "visible",
  });
  return piece;
}

// Cuts a white key into jagged fragments (the last N, the most cracked, into three): copies of the
// key, each clipped to the region between two fractures, with a physics body the size of its
// region. The crack drawings aren't carried over: the key has broken, so the pieces are clean.
function shatter(key: HTMLElement): Omit<PieceSpec, "delay">[] {
  const w = key.offsetWidth;
  const h = key.offsetHeight;
  const heights =
    key.dataset.main !== undefined
      ? [between(38, 52), between(86, 100)]
      : [between(52, 100)];
  const bounds: [number, number][][] = [
    [
      [0, -2],
      [w, -2],
    ],
    ...heights.map((y) => fractureLine(w, y)),
    [
      [0, h + 2],
      [w, h + 2],
    ],
  ];
  const average = (line: [number, number][]) =>
    line.reduce((sum, [, y]) => sum + y, 0) / line.length;
  return bounds.slice(0, -1).map((upper, i) => {
    const lower = bounds[i + 1];
    const polygon = [...upper, ...[...lower].reverse()]
      .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)
      .join(", ");
    const top = Math.max(0, average(upper));
    const bottom = Math.min(h, average(lower));
    const el = loosePiece(key);
    el.querySelectorAll("svg").forEach((svg) => svg.remove()); // no crack lines on the pieces
    el.style.clipPath = `polygon(${polygon})`;
    return {
      el,
      original: key,
      w,
      h: Math.max(10, bottom - top),
      ox: w / 2,
      oy: (top + bottom) / 2,
    };
  });
}

function crackStage(count: number) {
  return CRACK_STAGE_AT.filter((at) => count >= at).length;
}

// Crack artwork. Each piece is drawn in its own key's coordinates (35 wide; letters sit below
// y ≈ 115, black keys cover the top 87px on their sides) as a thick, rounded, slightly wobbly
// doodle, like a kawaii cartoon crack rather than real damage. Every piece starts on an edge
// (the piano's outline, a key divider, the bottom of a black key) or on another crack.
// The last N starts with a small Y-shaped split that grows up the key; as the piano keeps being
// played, new little cracks spread to the other white keys, stage by stage.
type Pt = [number, number];
// Main line on the last key, top to bottom. It's anchored to the right edge by the Y-split's
// right arm, climbs higher with each stage, and finally reaches the top edge.
const MAIN: Pt[] = [
  [15, -1],
  [19, 18],
  [16, 30],
  [20, 40],
  [15, 52],
  [19, 60],
  [17, 70],
  [22, 74],
  [25, 88],
];
const MAIN_START = [0, 6, 4, 4, 2, 0, 0]; // first point of MAIN shown at each stage (6 = broken)
const PIECES: { key: number; from: number; points: Pt[] }[] = [
  // Last N: the Y-split, then branches as it grows.
  {
    key: 7,
    from: 1,
    points: [
      [25, 88],
      [18, 92],
      [12, 92],
    ],
  },
  {
    key: 7,
    from: 1,
    points: [
      [25, 88],
      [31, 95],
      [38, 97],
    ],
  },
  {
    key: 7,
    from: 3,
    points: [
      [19, 60],
      [11, 63],
      [6, 58],
    ],
  },
  {
    key: 7,
    from: 4,
    points: [
      [20, 40],
      [28, 37],
      [31, 31],
    ],
  },
  {
    key: 7,
    from: 5,
    points: [
      [18, 92],
      [13, 100],
      [7, 103],
    ],
  },
  {
    key: 7,
    from: 5,
    points: [
      [16, 30],
      [9, 26],
    ],
  },
  // Stage 2: the first A, from its left divider.
  {
    key: 3,
    from: 2,
    points: [
      [-1, 90],
      [6, 93],
      [11, 97],
      [9, 103],
      [15, 108],
    ],
  },
  // Stage 3: J (from the piano's left edge) and H (from under the black key beside it).
  {
    key: 0,
    from: 3,
    points: [
      [-1, 40],
      [7, 44],
      [5, 51],
      [12, 56],
    ],
  },
  {
    key: 5,
    from: 3,
    points: [
      [28, 87],
      [19, 95],
      [22, 101],
      [16, 106],
    ],
  },
  // Stage 4: O and T (from under their black keys), and the A crack branches.
  {
    key: 1,
    from: 4,
    points: [
      [8, 87],
      [14, 93],
      [11, 99],
      [17, 104],
    ],
  },
  {
    key: 4,
    from: 4,
    points: [
      [28, 87],
      [23, 93],
      [26, 99],
      [21, 103],
    ],
  },
  {
    key: 3,
    from: 4,
    points: [
      [11, 97],
      [18, 95],
      [22, 100],
    ],
  },
  // Stage 5: the first N (from its right divider) and the second A (from under its black key),
  // and the J and H cracks branch.
  {
    key: 2,
    from: 5,
    points: [
      [36, 30],
      [28, 36],
      [30, 43],
      [23, 48],
    ],
  },
  {
    key: 6,
    from: 5,
    points: [
      [8, 87],
      [13, 93],
      [10, 99],
      [15, 104],
    ],
  },
  {
    key: 0,
    from: 5,
    points: [
      [7, 44],
      [10, 36],
      [16, 33],
    ],
  },
  {
    key: 5,
    from: 5,
    points: [
      [19, 95],
      [12, 94],
    ],
  },
  // The moment it gives way: the cracks spread a little further just before it comes apart.
  {
    key: 1,
    from: 6,
    points: [
      [17, 104],
      [22, 108],
      [28, 106],
    ],
  },
  {
    key: 4,
    from: 6,
    points: [
      [21, 103],
      [15, 106],
      [11, 111],
    ],
  },
  {
    key: 6,
    from: 6,
    points: [
      [15, 104],
      [21, 108],
      [26, 105],
    ],
  },
  {
    key: 7,
    from: 6,
    points: [
      [9, 26],
      [3, 22],
      [-1, 25],
    ],
  },
];
// Hand-drawn feel: each segment bows slightly, alternating sides, so the zigzag reads as a
// doodle rather than a precise lightning bolt. The wobble is fixed, so every stage looks the same.
function doodle(points: Pt[]) {
  return points
    .map(([x, y], i) => {
      if (i === 0) return `M${x} ${y}`;
      const [px, py] = points[i - 1];
      const len = Math.hypot(x - px, y - py) || 1;
      const bow = (i % 2 ? 1 : -1) * Math.min(1.4, len * 0.12);
      const cx = (px + x) / 2 + (-(y - py) / len) * bow;
      const cy = (py + y) / 2 + ((x - px) / len) * bow;
      return `Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x} ${y}`;
    })
    .join(" ");
}

// The cracks on one white key, drawn inside the key itself so they move with it and stay on
// when the piano gives way. Lines are clipped at the key's edges.
function KeyCrack({ stage, keyIndex }: { stage: number; keyIndex: number }) {
  const pieces = PIECES.filter((p) => p.key === keyIndex && stage >= p.from);
  const main = keyIndex === LETTERS.length - 1 && stage > 0;
  if (!main && pieces.length === 0) return null; // clean: no cracks until it has been played a while
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${KEY} 152`}
      className="pointer-events-none absolute top-0 left-0"
      style={{ width: KEY, height: 152 }}
    >
      <g
        fill="none"
        stroke="#0a0a0a"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={2.2}
        transform="translate(1 0)"
      >
        {main && (
          <path d={doodle(MAIN.slice(MAIN_START[stage]))} strokeWidth={2.6} />
        )}
        {pieces.map((p, i) => (
          <path key={i} d={doodle(p.points)} />
        ))}
      </g>
    </svg>
  );
}

export function PianoLogo() {
  const instrument = useInstrument();
  const muted = useMuted();
  const played = usePlayed(); // hides the "play me" hint once the piano has been played
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);
  const [notes, setNotes] = useState<FloatingNote[]>([]);
  // Counts notes played, so the instrument icon can dance along.
  const [beat, setBeat] = useState(0);
  const noteId = useRef(0);
  const width = KEY * LETTERS.length + 2; // including the piano's 1px border
  // On phones the piano is scaled up to fill the screen's width (less the page's 16px sides), so
  // the keys are a comfortable size to tap.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      setScale(w < 640 ? Math.min(1.4, (w - 32) / width) : 1);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [width]);
  const pianoRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(() => crackStage(notesPlayed));
  const stageRef = useRef(stage);
  const [phase, setPhase] = useState<Phase>(() =>
    crackStage(notesPlayed) === BROKEN ? "broken" : "intact",
  );
  const phaseRef = useRef<Phase>(phase);
  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);
  const repairRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<PhysicsWorld | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Keys that are currently down, counted so several inputs can hold the same key (e.g. a held
  // letter plus the short flash from playing it). Every pressed key shows as pressed on its own.
  const [down, setDown] = useState<Record<string, number>>({});
  const press = useCallback(
    (s: string) => setDown((d) => ({ ...d, [s]: (d[s] ?? 0) + 1 })),
    [],
  );
  const release = useCallback(
    (s: string) =>
      setDown((d) => {
        const next = { ...d };
        if ((d[s] ?? 0) > 1) next[s] = d[s] - 1;
        else delete next[s];
        return next;
      }),
    [],
  );

  const removeNote = useCallback(
    (id: number) => setNotes((ns) => ns.filter((n) => n.id !== id)),
    [],
  );

  // A tiny, restrained twitch of the whole piano when it cracks further or gets repaired.
  const twitch = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pianoRef.current?.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)" },
        { transform: "translate(-1px, 0) rotate(-0.4deg)" },
        { transform: "translate(1px, 0) rotate(0.3deg)" },
        { transform: "translate(-0.5px, 0) rotate(-0.15deg)" },
        { transform: "translate(0, 0) rotate(0deg)" },
      ],
      { duration: 260, easing: "ease-out" },
    );
  }, []);

  // The piano's separate pieces: white keys (with their halves of the dividers) and black keys.
  // Keys hidden at this screen size (the plain outer keys on phones) are left out.
  const pianoParts = () =>
    pianoRef.current
      ? [
          ...pianoRef.current.querySelectorAll<HTMLElement>("[data-part]"),
        ].filter((part) => part.offsetWidth > 0)
      : [];
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Resolves true once every animation has finished, false if any was cancelled.
  const allFinished = (anims: Animation[]) =>
    Promise.all(anims.map((a) => a.finished)).then(
      () => true,
      () => false,
    );

  // The piano gives way: a tremble that builds while the cracks spread, then it snaps. The white
  // keys break into pieces along jagged fractures and, with the black keys, let go within about a
  // third of a second of each other (the cracked N side first) and fall as physical pieces.
  const fallApart = useCallback(() => {
    const piano = pianoRef.current;
    if (!piano) return;
    changePhase("breaking");
    if (!muted) playBreakSound();
    const reduce = prefersReducedMotion();

    if (!reduce) {
      piano.animate(
        [
          { transform: "translate(0, 0) rotate(0deg)" },
          { transform: "translate(0, 0) rotate(-0.25deg)" },
          { transform: "translate(0, 0.5px) rotate(0.35deg)" },
          { transform: "translate(0, 0) rotate(-0.5deg)" },
          { transform: "translate(0, 1px) rotate(0.7deg)" },
          { transform: "translate(0, 0) rotate(-0.9deg)" },
          { transform: "translate(0, 1.5px) rotate(0.6deg)" },
          { transform: "translate(0, 0) rotate(0deg)" },
        ],
        { duration: SEPARATE_AT + 60, easing: "ease-in" },
      );
    }

    // It snaps once the tremble is over (by then the last cracks have drawn, so the pieces carry
    // them all).
    window.setTimeout(
      () => {
        if (!mounted.current || phaseRef.current !== "breaking") return;
        if (reduce) {
          for (const part of pianoParts()) part.style.visibility = "hidden";
        } else {
          const specs: PieceSpec[] = [];
          for (const part of pianoParts()) {
            const { fromRight } = dropPose(part, piano.offsetWidth);
            const black = part.dataset.part === "black";
            const shapes = black
              ? [
                  {
                    el: loosePiece(part),
                    original: part,
                    w: part.offsetWidth,
                    h: part.offsetHeight,
                    ox: part.offsetWidth / 2,
                    oy: part.offsetHeight / 2,
                  },
                ]
              : shatter(part);
            shapes.forEach((shape, i) =>
              specs.push({
                ...shape,
                delay:
                  fromRight * 160 +
                  between(0, 170) +
                  (black ? between(-60, 60) : i * between(10, 50)),
              }),
            );
          }
          worldRef.current = startPhysics(specs, {
            // The piano may be drawn scaled up; the loose pieces match its size.
            scale: piano.getBoundingClientRect().width / piano.offsetWidth,
            onImpact: (strength) => {
              if (!mutedRef.current) playKnock(strength);
            },
          });
        }
        // The repair button appears once the pieces are on their way.
        window.setTimeout(
          () => {
            if (mounted.current && phaseRef.current === "breaking")
              changePhase("broken");
          },
          reduce ? 0 : 1100,
        );
      },
      reduce ? 0 : SEPARATE_AT,
    );
  }, [changePhase, muted]);

  // Repair: the button fades away, then every piece flies back from wherever it is and the piano
  // is whole again: clean, with the count restarted.
  const repair = () => {
    if (phaseRef.current !== "broken") return; // ignore repeat presses
    phaseRef.current = "repairing";
    if (!muted) playRepairSound();
    const fadeOut = repairRef.current?.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 250, easing: "ease-in", fill: "forwards" },
    );
    void (fadeOut ? allFinished([fadeOut]) : Promise.resolve(true)).then(() => {
      if (!mounted.current) return;
      changePhase("repairing");
      resetNotes();
      stageRef.current = 0;
      setStage(0);
      const finish = () => {
        // Skip if the page was left mid-repair (it is then set back to broken; see below).
        if (!mounted.current || phaseRef.current !== "repairing") return;
        if (!muted) playSettleSound();
        changePhase("intact");
        resetPlayed(); // the "play me" hint comes back for another round
      };
      // The world stays in worldRef while it flies back, so leaving the page mid-repair can clear
      // it away.
      const world = worldRef.current;
      if (world) {
        world.repair(() => {
          if (worldRef.current === world) worldRef.current = null;
          finish();
        });
        return;
      }
      // Nothing to fly back (reduced motion, or the page was reopened while broken): the keys
      // simply rise back into place.
      const parts = pianoParts();
      for (const part of parts) part.style.visibility = "";
      const anims = prefersReducedMotion()
        ? []
        : parts.map((part, i) =>
            part.animate(
              [
                { translate: "0px 24px", opacity: 0 },
                { translate: "0px 0px", opacity: 1 },
              ],
              {
                duration: 450,
                delay: i * 25,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "backwards",
              },
            ),
          );
      void allFinished(anims).then(finish);
    });
  };

  // Coming back to the page with the piano already broken: keep the keys hidden.
  useEffect(() => {
    if (phaseRef.current !== "broken") return;
    for (const part of pianoParts()) part.style.visibility = "hidden";
  }, []);

  // Leaving the page: clear away any loose pieces. The page may be kept alive in the background
  // and shown again on Back, with its state intact, so a piano that isn't whole is left plainly
  // broken: on return its keys are hidden again and the repair button brings them back from
  // scratch (the loose pieces are gone by then).
  useEffect(
    () => () => {
      const world = worldRef.current;
      worldRef.current = null;
      world?.destroy();
      if (phaseRef.current !== "intact") changePhase("broken");
    },
    [changePhase],
  );

  // Once the piano has broken, the repair button fades gently in.
  useEffect(() => {
    if (phase !== "broken") return;
    repairRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      easing: "ease-out",
      fill: "backwards",
    });
  }, [phase]);

  // Every way of playing a key (click, tap, hover, typed letter) goes through strike(), so the
  // floating note is spawned here, above the key that was played: one independent note per
  // strike, with its own small drift. Keys are named by id.
  const strike = useCallback(
    (key: string, semitone: number, el: HTMLElement | null) => {
      if (phaseRef.current !== "intact") return; // no playing while it breaks, lies in pieces or is repaired
      if (!muted) playNote(noteFrequency(semitone), instrument);
      markPlayed();
      setBeat((b) => b + 1);
      // A short pressed flash, so even a quick tap or hover shows; held keys stay down until released.
      press(key);
      window.setTimeout(() => release(key), 160);

      // Crack a little more at each milestone, with a tiny twitch of the whole piano; at the end
      // it falls apart.
      const next = crackStage(countNote());
      if (next > stageRef.current) {
        stageRef.current = next;
        setStage(next);
        if (next === BROKEN) fallApart();
        else twitch();
      }

      const id = ++noteId.current;
      const drift = (Math.random() * 2 - 1) * 14;
      const tilt = drift * 0.6 + (Math.random() * 2 - 1) * 6;
      // About a third of the notes come out a little bigger and slightly out of focus, as if
      // they're closer to the viewer, so the stream feels organic rather than stamped.
      const near = Math.random() < 0.35;
      const size = near ? 19 + Math.random() * 4 : 16;
      const blur = near ? 0.6 + Math.random() * 0.8 : 0;
      setNotes((ns) => [
        ...ns,
        {
          id,
          // The key's center, from the piano's outer edge (its 1px border plus the key's offset).
          x: el ? 1 + el.offsetLeft + el.offsetWidth / 2 : 0,
          drift,
          tilt,
          size,
          blur,
        },
      ]);
      // Fallback cleanup in case animationend never fires (e.g. the tab is hidden mid-animation).
      window.setTimeout(() => removeNote(id), NOTE_MS + 300);
    },
    [removeNote, press, release, twitch, fallApart, instrument, muted],
  );

  // Typing a letter of the name plays its key. Letters that appear twice (A, N) alternate
  // between their keys: the first press plays the first one, the next press the second.
  // The key stays down while the letter is held.
  const presses = useRef<Record<string, number>>({});
  const heldLetters = useRef<Record<string, string>>({});
  useEffect(() => {
    const releaseAll = () => {
      Object.values(heldLetters.current).forEach(release);
      heldLetters.current = {};
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof Element &&
        e.target.closest("input, textarea, select, [contenteditable]");
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing) return;
      const letter = e.key.toUpperCase();
      const keys = LETTERS.flatMap((l, i) => (l === letter ? [i] : []));
      if (
        keys.length === 0 ||
        letter in heldLetters.current ||
        phaseRef.current !== "intact"
      )
        return;
      const n = presses.current[letter] ?? 0;
      presses.current[letter] = n + 1;
      const i = keys[n % keys.length];
      const key = `L${i}`;
      heldLetters.current[letter] = key;
      press(key);
      strike(
        key,
        WHITE_SEMITONES[i],
        pianoRef.current?.querySelector<HTMLElement>(`[data-key="${key}"]`) ??
          null,
      );
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase();
      const key = heldLetters.current[letter];
      if (key === undefined) return;
      delete heldLetters.current[letter];
      release(key);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", releaseAll);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseAll);
    };
  }, [strike, press, release]);

  // Mouse and touch: a key stays down for as long as the pointer holds it down.
  const heldPointers = useRef<Record<number, string>>({});
  const pointerUp = (e: PointerEvent) => {
    const key = heldPointers.current[e.pointerId];
    if (key === undefined) return;
    delete heldPointers.current[e.pointerId];
    release(key);
  };
  // key: the key's id; semitone: its note (semitones from middle C).
  const keyProps = (key: string, label: string, semitone: number) => ({
    type: "button" as const,
    "data-key": key,
    "aria-label": `Play ${label}`,
    onClick: (e: { currentTarget: HTMLElement }) =>
      strike(key, semitone, e.currentTarget),
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerId in heldPointers.current) return;
      heldPointers.current[e.pointerId] = key;
      press(key);
    },
    onPointerUp: pointerUp,
    onPointerCancel: pointerUp,
    onPointerLeave: pointerUp,
  });
  const isDown = (key: string) => (down[key] ?? 0) > 0;
  const whiteFill = (key: string) =>
    isDown(key)
      ? "bg-[#d9d9d9]"
      : "bg-white hover:bg-[#f0f0f0] focus-visible:bg-[#e8e8e8]";

  return (
    <div className="relative" style={{ width: width * scale, height: 152 * scale }}>
      {/* A small hand-drawn nudge for first-time visitors: "psst… play me", with a doodled arrow
          at the keys (to the left of the piano; above it on phones and narrow windows, where there
          isn't room beside it). It fades in shortly after
          the page loads and fades away once the piano has been played, and comes back after a repair. It never hints
          at what happens if you keep playing. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-[84px] left-1 text-white/85 transition-opacity duration-700 ease-out md:top-1/2 md:right-[calc(100%+10px)] md:left-auto md:-translate-y-1/2 ${!played && phase === "intact" ? "opacity-100 delay-1000" : "opacity-0"}`}
      >
        {/* The whole note bobs gently, so the arrow moves with the text. */}
        <div className="flex animate-[nudge_1.8s_ease-in-out_infinite] items-end md:items-center">
          <span
            className={`${handwriting.className} -rotate-3 text-[22px] leading-none whitespace-nowrap`}
          >
            psst… play me
          </span>
          {/* Hand-drawn arrow starting just after the text, with a little loop, pointing at the
            keys. */}
          <svg
            viewBox="0 0 56 28"
            className="ml-2 hidden h-7 w-14 md:block"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12 C 9 9, 17 7, 23 11 C 28 15, 23 20, 20 16 C 17 12, 29 6, 52 13" />
            <path d="M45.5 8.6 L52.5 13 L45.2 17.6" />
          </svg>
          <svg
            viewBox="0 0 30 36"
            className="ml-1.5 h-9 w-7.5 translate-y-[21px] md:hidden"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Starts at the end of the text, loops on the inside of its bend, ends at the keys. */}
            <path d="M2 5 C 12 3, 22 7, 22 14 C 22 19, 15 19, 15 15 C 15 11, 22 11, 23 18 C 24 24, 20 29, 15 33" />
            <path d="M15.5 26.8 L15 33 L21 31.2" />
          </svg>
        </div>
      </div>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height: 152, scale: String(scale) }}
      >
      {/* The keys draw their own white and outlines, so the piano looks the same whether whole or
          apart; the frame itself is invisible and doesn't clip, so falling keys can leave it. While
          apart it sits above the rest of the page, so the keys fall in front of everything. */}
      <div
        ref={pianoRef}
        role="group"
        aria-label="Piano spelling Jonathan"
        inert={phase !== "intact"}
        className="relative h-[152px] rounded-[10px] border border-transparent"
        style={{
          width,
          zIndex: phase === "intact" ? undefined : 40,
        }}
      >
        <div className="flex h-full">
          {LETTERS.map((letter, i) => (
            <button
              key={i}
              data-part="white"
              data-main={i === LETTERS.length - 1 ? "" : undefined}
              {...keyProps(`L${i}`, WHITE_NOTES[i], WHITE_SEMITONES[i])}
              className={`${WHITE_KEY_BASE} flex flex-col justify-end pb-3.5 text-center font-heading text-base font-bold text-black ${keyEnds(i)} ${whiteFill(`L${i}`)}`}
              style={{ width: KEY, ...KEY_TRANSITION }}
            >
              <KeyCrack stage={stage} keyIndex={i} />
              <span
                aria-hidden
                className="relative inline-block"
                style={{ transform: LETTER_WOBBLE[i] }}
              >
                {letter}
              </span>
            </button>
          ))}
        </div>
        {[...BLACK_KEYS.map((k) => ({ ...k, id: `b${k.semitone}` }))].map(
          ({ id, boundary, semitone, name }) => (
            <button
              key={id}
              data-part="black"
              {...keyProps(id, name, semitone)}
              className={`absolute top-0 transition-colors ease-out focus-visible:outline-none rounded-b-[5px] ${isDown(id) ? "bg-[#444]" : "bg-black hover:bg-[#222] focus-visible:bg-[#555]"}`}
              style={{
                left: boundary * KEY - BLACK.width / 2,
                width: BLACK.width,
                height: BLACK.height,
                ...KEY_TRANSITION,
              }}
            />
          ),
        )}
      </div>
      {/* Red notes rise out of the top edge of the piano, each one emerging from its key. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
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
            onAnimationEnd={() => removeNote(note.id)}
          >
            <Music2
              style={{ width: note.size, height: note.size }}
              strokeWidth={1.5}
            />
          </span>
        ))}
      </div>
      {/* Repair: only exists once every key has dropped away. The icon-only white button (like the
          page's primary buttons) sits centered where the piano was. */}
      {phase === "broken" && (
        <div
          ref={repairRef}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <button
            type="button"
            onClick={repair}
            aria-label="Repair piano"
            title="Repair piano"
            className="flex size-11 items-center justify-center rounded-full bg-white text-black transition-colors outline-none hover:bg-[#E5484D] focus-visible:bg-[#E5484D]"
          >
            <Wrench aria-hidden className="size-5" strokeWidth={2} />
          </button>
        </div>
      )}
      </div>
      {/* Mute / unmute, at the piano's bottom right (available even while it's broken, for the
          sound of the pieces), with the instrument picker just above it while the piano is whole.
          On phones, where the piano fills the width, they sit side by side above its top right. */}
      {phase !== "repairing" && (
        <>
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            aria-pressed={muted}
            aria-label={muted ? "Unmute piano" : "Mute piano"}
            title={muted ? "Unmute piano" : "Mute piano"}
            className="absolute -top-10 right-0 flex size-7 items-center sm:top-auto sm:bottom-0 justify-center rounded-full border border-white/30 text-white/70 transition-colors outline-none hover:border-[#E5484D] hover:text-white focus-visible:border-[#E5484D] focus-visible:text-white sm:-right-12 sm:size-8"
          >
            <SpeakerIcon on={!muted} />
          </button>
          {phase === "intact" && (
            <InstrumentPicker
              instrument={instrument}
              muted={muted}
              beat={beat}
              className="absolute -top-10 right-9 z-30 sm:top-auto sm:-right-12 sm:bottom-10"
            />
          )}
        </>
      )}
    </div>
  );
}
