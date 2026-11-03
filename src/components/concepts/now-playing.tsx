"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/data/site";
import { tracks, type Track } from "@/data/tracks";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./icons";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const queue = tracks.filter((t) => t.status === "live");
const LINE_MS = 2600;

// Deterministic waveform heights for the scrubber.
function bars(seed: string, n: number) {
  let h = 7;
  for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1664525 + 1013904223) >>> 0;
    const env = 0.55 + 0.45 * Math.sin((i / n) * Math.PI);
    return Math.max(0.15, ((h >>> 20) / 4096) * env);
  });
}

export function NowPlayingConcept({ lyrics }: { lyrics: Record<string, string[]> }) {
  const [index, setIndex] = useState(0);
  const [line, setLine] = useState(0);
  const reducedMotion = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reducedMotion;
  const track: Track = queue[index];
  const lines = lyrics[track.slug] ?? [];
  const wave = useMemo(() => bars(track.slug, 64), [track.slug]);
  const progress = lines.length ? (line + 1) / lines.length : 0;

  // Advance one lyric line at a time, then move on to the next project.
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (line + 1 < lines.length) setLine(line + 1);
      else {
        setIndex((i) => (i + 1) % queue.length);
        setLine(0);
      }
    }, LINE_MS);
    return () => clearTimeout(id);
  }, [playing, line, lines.length]);

  const go = (i: number) => {
    setIndex((i + queue.length) % queue.length);
    setLine(0);
  };

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-[#0b0b0e] text-white">
      {/* Ambient background from the current cover */}
      <Image key={track.slug} src={track.cover.src} alt="" fill priority sizes="100vw"
        className="-z-10 scale-125 object-cover opacity-40 blur-3xl saturate-150 transition-opacity duration-700" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/50 to-black/85" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <span className="logo-texture font-logo text-[32px] leading-none brightness-200" style={{ backgroundImage: `url(${site.logoTexture})` }}>jnthn</span>
        <nav className="flex gap-5 text-sm font-medium text-white/70">
          <Link href="/about" className="hover:text-white">About</Link>
          <a href={site.links.resume} target="_blank" rel="noreferrer" className="hover:text-white">Resume</a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
        </nav>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 pt-4 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pt-10">
        {/* Player */}
        <section aria-label="Now playing">
          <p className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">Now playing · Jonathan Shechtman</p>
          <Link href={`/${track.slug}`} className="group mt-4 block overflow-hidden rounded-2xl bg-night shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="relative flex aspect-[4/3] items-end justify-center px-6 pt-10">
              <Image src={track.cover.src} alt={`${track.name} designs`} width={track.cover.width} height={track.cover.height}
                sizes="(min-width: 1024px) 520px, 90vw" className="w-full object-contain object-bottom transition duration-500 group-hover:-translate-y-1" />
            </div>
          </Link>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-3xl font-bold sm:text-4xl">{track.name}</h1>
              <p className="mt-1 truncate text-white/70">{track.summary}</p>
            </div>
            <Link href={`/${track.slug}`} className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25">
              Read case study
            </Link>
          </div>

          {/* Waveform scrubber */}
          <div className="mt-6 flex h-12 items-center gap-[3px]" aria-hidden>
            {wave.map((v, i) => (
              <span key={i} className={`flex-1 rounded-full transition-colors duration-300 ${i / wave.length < progress ? "bg-white" : "bg-white/25"}`} style={{ height: `${v * 100}%` }} />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-white/60 tabular-nums">
            <span>{track.released}</span>
            <span>{track.role} · {track.length}</span>
          </div>

          <div className="mt-5 flex items-center justify-center gap-8">
            <button type="button" aria-label="Previous project" onClick={() => go(index - 1)} className="text-white/70 hover:text-white"><PrevIcon className="size-7" /></button>
            <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setChoice(!playing)}
              className="flex size-16 items-center justify-center rounded-full bg-white text-black transition hover:scale-105">
              {playing ? <PauseIcon className="size-7" /> : <PlayIcon className="ml-1 size-7" />}
            </button>
            <button type="button" aria-label="Next project" onClick={() => go(index + 1)} className="text-white/70 hover:text-white"><NextIcon className="size-7" /></button>
          </div>
        </section>

        {/* Lyrics + queue */}
        <section aria-label="Project highlights" className="flex flex-col">
          <p className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">Lyrics</p>
          <ol className="mt-4 space-y-4">
            {lines.map((text, i) => (
              <li key={`${track.slug}-${i}`}>
                <button type="button" onClick={() => setLine(i)}
                  className={`text-left font-heading text-2xl leading-snug font-bold transition duration-500 sm:text-[28px] ${
                    i === line ? "text-white" : i < line ? "text-white/45" : "text-white/20 hover:text-white/40"
                  }`}>
                  {text}
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-auto pt-12">
            <p className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">Up next</p>
            <ul className="mt-3 grid gap-1">
              {queue.map((t, i) => (
                <li key={t.slug}>
                  <button type="button" onClick={() => go(i)}
                    className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${i === index ? "bg-white/15" : "hover:bg-white/10"}`}>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white">
                      <Image src={t.logo.src} alt="" width={t.logo.width} height={t.logo.height} className="h-4 w-7 object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{t.name}</span>
                      <span className="block truncate text-xs text-white/60">{t.role}</span>
                    </span>
                    <span className="flex h-5 items-end gap-[2px]" aria-hidden>
                      {bars(t.slug, 10).map((v, k) => (
                        <span key={k} className={`w-[3px] rounded-full ${i === index && playing ? "animate-[meter_1.2s_ease-in-out_infinite] bg-[#b5e86a]" : "bg-white/40"}`}
                          style={{ height: `${v * 100}%`, transformOrigin: "bottom", animationDelay: `${k * 0.11}s` }} />
                      ))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
