"use client";

import { useCallback, useEffect, useRef } from "react";

// Plays a looping song clip that fades in and out. The fades go through Web Audio, since iPhones
// ignore an audio element's volume. play() has to be called from a tap or drag (browsers only
// allow sound after one), which is when the earbud is handed to the ghost.
const VOLUME = 0.35;
const FADE_IN_S = 1;
const FADE_OUT_S = 0.6;

export function useSong(src: string) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const stopTimer = useRef(0);

  // From the top of the clip, or (resume) from where it was paused.
  const play = useCallback((resume = false) => {
    if (!audio.current) {
      const el = new Audio(src);
      el.loop = true;
      el.preload = "auto";
      audio.current = el;
      const ac = new AudioContext();
      const g = ac.createGain();
      g.gain.value = 0;
      ac.createMediaElementSource(el).connect(g).connect(ac.destination);
      ctx.current = ac;
      gain.current = g;
    }
    const ac = ctx.current!;
    const g = gain.current!.gain;
    window.clearTimeout(stopTimer.current);
    void ac.resume();
    // Start from the top of the clip unless it's still fading out from a moment ago.
    if (audio.current.paused && !resume) audio.current.currentTime = 0;
    void audio.current.play().catch(() => {});
    g.cancelScheduledValues(ac.currentTime);
    g.setValueAtTime(g.value, ac.currentTime);
    g.linearRampToValueAtTime(VOLUME, ac.currentTime + FADE_IN_S);
  }, [src]);

  const stop = useCallback(() => {
    const ac = ctx.current;
    const el = audio.current;
    if (!ac || !el) return;
    const g = gain.current!.gain;
    g.cancelScheduledValues(ac.currentTime);
    g.setValueAtTime(g.value, ac.currentTime);
    g.linearRampToValueAtTime(0, ac.currentTime + FADE_OUT_S);
    window.clearTimeout(stopTimer.current);
    stopTimer.current = window.setTimeout(() => el.pause(), FADE_OUT_S * 1000 + 50);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(stopTimer.current);
      audio.current?.pause();
      void ctx.current?.close();
    },
    [],
  );

  return { play, stop };
}
