"use client";

import { User } from "lucide-react";
import { useState } from "react";

// A note is an interviewee's quote, or a finding from a Reddit thread. Reddit findings that
// summarize a thread rather than quote one comment set quote: false, so they show without quote marks.
export type Note = {
  text: string;
  who: string;
  reddit?: boolean;
  quote?: boolean;
  // What the quote is about, shown small above it (e.g. "On Duolingo's gamification").
  about?: string;
};

// A small line drawing of Reddit's robot, in the same weight as the lucide icons.
export function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <ellipse cx="10" cy="12.5" rx="6.5" ry="4.5" />
      <circle cx="3.6" cy="9.6" r="1.5" />
      <circle cx="16.4" cy="9.6" r="1.5" />
      <path d="M10 8 L11.3 3.2 L14.2 3.9" />
      <circle cx="15.6" cy="4.1" r="1.3" />
      <circle cx="7.6" cy="11.6" r="0.6" fill="currentColor" />
      <circle cx="12.4" cy="11.6" r="0.6" fill="currentColor" />
      <path d="M7.8 14.4 Q10 15.8 12.2 14.4" />
    </svg>
  );
}

// Square sticky notes piled on top of each other, each a little askew. Only the top note can be read;
// clicking the pile sends it to the back so the next one shows. A single note is just a note.
export function NoteStack({
  notes,
  font,
  flip = false,
}: {
  notes: Note[];
  font: string;
  flip?: boolean;
}) {
  const [front, setFront] = useState(0);
  const many = notes.length > 1;
  // Tilt and nudge by depth in the pile (0 = top), mirrored on every other insight.
  const tilt = [-1.2, 2.4, -3.4];
  const sign = flip ? -1 : 1;

  const pile = (
    <span className="grid w-full max-w-[200px]">
      {notes.map((note, i) => {
        const depth = (i - front + notes.length) % notes.length;
        return (
          <span
            key={note.text}
            aria-hidden={depth !== 0}
            className={`${font} col-start-1 row-start-1 flex aspect-square flex-col rounded-[2px] bg-[#f4f4f2] px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3 text-left text-[#1c1c1e] shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out`}
            style={{
              zIndex: notes.length - depth,
              transform: `translate(${depth * 5 * sign}px, ${depth * 3}px) rotate(${tilt[depth % tilt.length] * sign}deg)`,
            }}
          >
            {/* Back notes keep their size but hide their words, so the pile reads as paper. */}
            <span
              className={`flex flex-1 flex-col ${depth ? "invisible" : ""}`}
            >
              {note.about && (
                <span className="mb-2.5 block text-xs text-[#1c1c1e]/55 sm:text-sm">
                  {note.about}
                </span>
              )}
              <span className="block text-base leading-tight sm:text-[19px]">
                {note.quote === false ? (
                  note.text
                ) : (
                  <>&ldquo;{note.text}&rdquo;</>
                )}
              </span>
              <span className="mt-auto flex justify-between gap-2 pt-2 text-xs sm:text-sm text-[#1c1c1e]/55">
                <span className="flex items-center gap-1.5">
                  {note.reddit ? (
                    <RedditIcon className="size-3.5 shrink-0" />
                  ) : (
                    <User
                      aria-hidden
                      strokeWidth={1.75}
                      className="size-3.5 shrink-0"
                    />
                  )}
                  {note.who}
                </span>
                {many && (
                  <span>
                    {i + 1}/{notes.length}
                  </span>
                )}
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );

  if (!many) return pile;
  return (
    <button
      type="button"
      onClick={() => setFront((f) => (f + 1) % notes.length)}
      aria-label={`Quote ${front + 1} of ${notes.length}. Show the next quote.`}
      className="block w-full cursor-pointer rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white/60"
    >
      {pile}
    </button>
  );
}
