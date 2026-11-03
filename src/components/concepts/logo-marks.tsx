// "JS" as two beamed sixteenth notes, drawn Lucide-style: 24×24 grid, round caps and joins, no fills.
import type { SVGProps } from "react";

export type Mark = { id: string; name: string; note: string; paths: string[]; transform?: string; refined?: boolean; clef?: boolean };

// Treble-clef J: the hooked tail is the J, the spine rises into the top loop, which swings
// back down into the belly around the G line. Drawn as one continuous stroke.
// The tail hangs below the belly so the J stays legible; the loop and belly are sized to stay open at a 2.5px stroke.
const CLEF_TOP = "M3.1 19.5a2.2 2.2 0 0 0 4.4 0V5C7.5 2.4 9.2 1 10.6 1.6c1.6.7 1.3 3.4-1.2 5.6C7 9.3 3.4 11 3.4 14.2";
const CLEF_SPIRAL = `${CLEF_TOP}a4.4 4.4 0 0 0 8.8 0 4.4 4.4 0 0 0-4.4-4.4c-1.8 0-2.9 1.4-2.6 3`;
const CLEF_OPEN = `${CLEF_TOP}a4.4 4.4 0 0 0 8.8 0 4.4 4.4 0 0 0-4.4-4.4`;
const CLEF_DOT = "M4.6 19.1a1 1 0 1 1-2 0 1 1 0 0 1 2 0";
// A regular S, slightly shorter than the clef so it sits on the clef's belly like a capital.
const S_REGULAR = "M21.5 8.9C21 7.3 19.9 6.4 18.4 6.4 16.7 6.4 15.5 7.6 15.5 9.1c0 2.1 1.9 2.9 3.4 3.6 1.6.7 2.7 1.7 2.7 3.7 0 2.2-1.6 3.4-3.5 3.4-1.5 0-2.6-.8-3.1-2.1";
const S_TALL = "M21.7 6.2C21.2 4.5 20 3.6 18.5 3.6 16.7 3.6 15.4 4.9 15.4 6.6c0 2.5 2 3.4 3.6 4.2 1.7.8 2.9 2 2.9 4.3 0 2.6-1.7 4.3-3.7 4.3-1.6 0-2.8-.9-3.3-2.4";

// Shared geometry for the refined E/F family. Beams are parallel, 4 units apart, sloping down
// from the J's top into the S like real sixteenth-note beams.
const S = "M19.8 7.4C19.3 5.6 18.1 4.6 16.5 4.6 14.7 4.6 13.4 5.9 13.4 7.6c0 2.4 2.1 3.3 3.7 4.1 1.7.8 2.9 1.9 2.9 4.2 0 2.5-1.7 4.1-3.8 4.1-1.6 0-2.8-.9-3.3-2.4";
const S_TO_HEAD = "M19.8 7.4C19.3 5.6 18.1 4.6 16.5 4.6 14.7 4.6 13.4 5.9 13.4 7.6c0 2.4 2.1 3.3 3.7 4.1 1.7.8 2.9 1.9 2.9 4.2 0 2.3-1.4 3.8-3.2 4.1";
const BEAM_1 = "M8 3.4l8.5 1.2";
const BEAM_2 = "M8 7.4l5.5.8";
const J_HOOK = "M8 3.4v13.5a3 3 0 0 1-5.6 1.5";
const J_STEM = "M8 3.4V17";
const ROUND_HEAD = "M8 17a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0";
const OVAL_HEAD = "M8.1 15.9A3 2.2-25 1 1 2.7 18.5 3 2.2-25 1 1 8.1 15.9";

export const marks: Mark[] = [
  {
    id: "k1",
    name: "Clef J",
    note: "Full treble clef: the tail is the J, with the loop and spiral above it. A regular S sits beside it at cap height.",
    paths: [CLEF_SPIRAL, S_REGULAR],
    clef: true,
  },
  {
    id: "k2",
    name: "Clef J, open belly",
    note: "Drops the inner spiral: the belly closes back onto the spine. Simpler and cleaner at small sizes.",
    paths: [CLEF_OPEN, S_REGULAR],
    clef: true,
  },
  {
    id: "k3",
    name: "Clef J with dot",
    note: "Adds the clef's classic ball at the end of the tail, which makes the J read as a clef faster.",
    paths: [CLEF_SPIRAL, CLEF_DOT, S_REGULAR],
    clef: true,
  },
  {
    id: "k4",
    name: "Clef J, tall S",
    note: "The S grows to match the clef's height, so the pair reads more like two equal letters.",
    paths: [CLEF_OPEN, S_TALL],
    clef: true,
  },
  {
    id: "k5",
    name: "Clef J, leaning",
    note: "The open-belly version with a slight forward lean, closer to how a clef is drawn by hand.",
    paths: [CLEF_OPEN, S_REGULAR],
    transform: "translate(1.6 0) skewX(-7)",
    clef: true,
  },
  {
    id: "e1",
    name: "E refined",
    note: "Hooked j, sloped parallel beams, a more typographic S. The beams now read as music instead of serifs.",
    paths: [J_HOOK, BEAM_1, BEAM_2, S],
    refined: true,
  },
  {
    id: "e2",
    name: "E refined, leaning",
    note: "Same mark with an 8° forward lean: closer to handwriting while staying geometric.",
    paths: [J_HOOK, BEAM_1, BEAM_2, S],
    transform: "translate(1.7 0) skewX(-8)",
    refined: true,
  },
  {
    id: "f1",
    name: "F refined",
    note: "The J ends in a round open notehead, sitting on the same baseline as the S.",
    paths: [J_STEM, ROUND_HEAD, BEAM_1, BEAM_2, S],
    refined: true,
  },
  {
    id: "f2",
    name: "F, two noteheads",
    note: "Both letters end in noteheads, so the pair reads most clearly as two notes.",
    paths: [J_STEM, ROUND_HEAD, BEAM_1, BEAM_2, S_TO_HEAD, "M16.2 18.9a2.3 2.3 0 1 1-4.6 0 2.3 2.3 0 0 1 4.6 0"],
    refined: true,
  },
  {
    id: "f3",
    name: "F, tilted head",
    note: "A tilted oval notehead, like real notation: the most musical of the F family.",
    paths: [J_STEM.replace("V17", "V16"), OVAL_HEAD, BEAM_1, BEAM_2, S],
    refined: true,
  },
  {
    id: "a",
    name: "Beamed letters",
    note: "J is the first note. The top beam lands on the crown of the S; the second beam meets its shoulder.",
    paths: [
      "M8 4v11.5a3 3 0 0 1-6 0", // J: stem + hooked head
      "M8 4h8.5", // beam 1, meets the S's top
      "M8 8h5.6", // beam 2
      "M19.5 6.5C19 4.8 17.8 4 16.5 4 14.8 4 13.5 5.3 13.5 7c0 4 6 2.5 6 8 0 2.8-1.5 5-3.3 5-1.6 0-2.6-1-3-2.5", // S
    ],
  },
  {
    id: "b",
    name: "Slanted beams",
    note: "Same idea with real-score beams: they slope down from the taller J into the S.",
    paths: [
      "M8 3v12.5a3 3 0 0 1-6 0",
      "M8 3l8.4 2.1",
      "M8 7l5.7 1.4",
      "M19.5 7.5C19 5.8 17.8 5 16.5 5 14.8 5 13.5 6.3 13.5 8c0 3.8 6 2.4 6 7.5 0 2.7-1.5 4.5-3.3 4.5-1.6 0-2.6-.9-3-2.3",
    ],
  },
  {
    id: "c",
    name: "Two stems",
    note: "Reads as music first: two stems, two beams. The left foot curls into a J, the right one swings into an S tail.",
    paths: [
      "M9 4v12a3 3 0 0 1-6 0", // J note
      "M9 4l11-2", // beam 1
      "M9 8l11-2", // beam 2
      "M20 2v12a3 3 0 0 1-3 3 3 3 0 0 0-3 3", // stem with S-curve tail
    ],
  },
  {
    id: "g",
    name: "Stem + S head",
    note: "Like C, but the right stem ends in a full small S, so both letters read without losing the two beamed notes.",
    paths: [
      "M8 4v12a3 3 0 0 1-6 0", // J note
      "M8 4l10-2", // beam 1
      "M8 8l10-2", // beam 2
      "M18 2v7.5", // right stem down to the S
      "M20.5 11.5c-.3-1.2-1.2-2-2.5-2-1.4 0-2.5.9-2.5 2.3 0 3 5 2 5 5.6 0 1.9-1.2 3.6-2.6 3.6-1.3 0-2.2-.7-2.6-1.9", // S notehead
    ],
  },
  {
    id: "d",
    name: "Notes, no letters",
    note: "Plain beamed sixteenth notes as a reference point. The quietest option.",
    paths: [
      "M9 18V5l12-2v13",
      "M9 9l12-2",
      "M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
      "M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    ],
  },
  {
    id: "e",
    name: "Lowercase js",
    note: "Softer, more handwritten: a lowercase j and s tied by two short beams.",
    paths: [
      "M9 6v10.5a3.5 3.5 0 0 1-6.5 1.8", // j stem + tail
      "M9 6h7", // beam 1 into s
      "M9 10h4.4", // beam 2
      "M20 8.5c-.7-1.6-2-2.5-3.6-2.5-1.9 0-3.4 1.2-3.4 3 0 3.7 7 2.3 7 6.3 0 1.9-1.6 3.2-3.6 3.2-1.7 0-3.1-.8-3.8-2.2", // s
    ],
  },
  {
    id: "f",
    name: "Open noteheads",
    note: "J and S letters, each with a small open notehead where the strokes end.",
    paths: [
      "M8 4v12",
      "M8 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0",
      "M8 4h8.5",
      "M8 8h5.6",
      "M19.5 6.5C19 4.8 17.8 4 16.5 4 14.8 4 13.5 5.3 13.5 7c0 4 6 2.5 6 8 0 2.3-1 4-2.4 4.7",
    ],
  },
];

export function MarkSvg({ mark, strokeWidth = 2, ...props }: { mark: Mark; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <g transform={mark.transform}>
        {mark.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
