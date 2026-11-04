// The visitor's chosen piano instrument, remembered in this browser (best effort: storage can be
// unavailable, in which case it simply resets to the default on the next visit). New visitors
// start on the haunted piano.
import { useSyncExternalStore } from "react";
import { INSTRUMENTS, type Instrument } from "@/lib/piano-synth";

const DEFAULT_INSTRUMENT: Instrument = "haunted";

const STORAGE_KEY = "piano-instrument";
const listeners = new Set<() => void>();
let current: Instrument | null = null;

function read(): Instrument {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (INSTRUMENTS as readonly string[]).includes(saved))
      return saved as Instrument;
  } catch {}
  return DEFAULT_INSTRUMENT;
}

export function setInstrument(next: Instrument) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function useInstrument() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => (current ??= read()),
    () => DEFAULT_INSTRUMENT,
  );
}

// Whether the piano is muted, remembered the same way. Sound is on by default (nothing ever plays
// until the visitor clicks or types, so there's no autoplay).
const MUTED_KEY = "piano-muted";
let muted: boolean | null = null;

function readMuted() {
  try {
    return window.localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    window.localStorage.setItem(MUTED_KEY, next ? "1" : "0");
  } catch {}
  listeners.forEach((listener) => listener());
}

export function useMuted() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => (muted ??= readMuted()),
    () => false,
  );
}

// Whether the visitor has played the piano yet, so the "play me" hint only shows until then.
// It's kept in memory only, so the hint comes back on every page load (a refresh included).
// Treated as already seen during server rendering, so the hint only ever appears in the browser.
let played = false;

export function markPlayed() {
  if (played) return;
  played = true;
  listeners.forEach((listener) => listener());
}

export function usePlayed() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => played,
    () => true,
  );
}

// After the piano is repaired, the "play me" hint comes back to invite another round, until the
// next note is played.
export function resetPlayed() {
  played = false;
  listeners.forEach((listener) => listener());
}
