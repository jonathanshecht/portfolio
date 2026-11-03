"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { skills, tracks, type Track } from "@/data/tracks";
import { PauseIcon, PlayIcon, PrevIcon } from "./icons";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const MONTHS = 72; // Jan 2021 → Jan 2027
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
const LOOP_MS = 24000;
const arrangement = [...tracks].sort((a, b) => a.start - b.start);

// Clip geometry as percentages of the timeline, with a minimum width so short projects stay readable.
function clipBox(t: Track) {
  const width = Math.max((t.months / MONTHS) * 100, 18);
  const left = Math.min((t.start / MONTHS) * 100, 100 - width);
  return { left, width };
}

// Deterministic pseudo-waveform per track.
function wave(seed: string, n = 48) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1103515245 + 12345) >>> 0;
    const env = Math.sin((i / n) * Math.PI) * 0.6 + 0.4;
    return (0.25 + ((h >>> 16) % 1000) / 1333) * env;
  });
}

function Waveform({ seed, color }: { seed: string; color: string }) {
  const bars = wave(seed);
  return (
    <svg viewBox={`0 0 ${bars.length * 3} 40`} preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-60" aria-hidden>
      {bars.map((v, i) => (
        <rect key={i} x={i * 3} y={20 - v * 18} width={1.6} height={v * 36} rx={0.8} fill={color} />
      ))}
    </svg>
  );
}

function formatPosition(pos: number) {
  const month = Math.floor(pos * MONTHS);
  return `${2021 + Math.floor(month / 12)}.${String((month % 12) + 1).padStart(2, "0")}`;
}

export function DawConcept() {
  const reducedMotion = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reducedMotion;
  const [pos, setPos] = useState(0.15);
  const [muted, setMuted] = useState<string[]>([]);
  const [solo, setSolo] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setPos((p) => (p + (now - last) / LOOP_MS) % 1);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const underPlayhead = arrangement.find((t) => {
    const { left, width } = clipBox(t);
    return pos * 100 >= left && pos * 100 <= left + width;
  });
  const audible = (t: Track) => (solo ? solo === t.slug : !muted.includes(t.slug));
  const toggle = (slug: string) => setMuted((m) => (m.includes(slug) ? m.filter((s) => s !== slug) : [...m, slug]));

  return (
    <div className="flex min-h-dvh flex-col bg-[#141417] font-sans text-[#d7d7dc]">
      {/* Transport bar */}
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-black/60 bg-[#26262c] px-4 py-2.5">
        <Link href="/concepts/daw" className="logo-texture font-logo text-[28px] leading-none brightness-200" style={{ backgroundImage: `url(${site.logoTexture})` }}>
          jnthn
        </Link>
        <nav className="flex gap-4 text-[13px] text-white/60">
          <a href="#arrangement" className="hover:text-white">Work</a>
          <Link href="/about" className="hover:text-white">About</Link>
          <a href={site.links.resume} target="_blank" rel="noreferrer" className="hover:text-white">Resume</a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
        </nav>
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label="Back to start" onClick={() => setPos(0)} className="rounded bg-[#1a1a1e] p-2 text-white/70 hover:text-white"><PrevIcon className="size-4" /></button>
          <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setChoice(!playing)}
            className={`rounded p-2 ${playing ? "bg-[#b5e86a] text-black" : "bg-[#1a1a1e] text-[#b5e86a]"}`}>
            {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
          </button>
        </div>
        <div className="flex items-stretch overflow-hidden rounded-md border border-black/60 bg-[#0d120b] font-mono text-[#b5e86a]">
          <div className="px-3 py-1">
            <p className="text-[9px] tracking-widest text-[#b5e86a]/50 uppercase">Position</p>
            <p className="text-lg leading-6 tabular-nums">{formatPosition(pos)}</p>
          </div>
          <div className="border-l border-black/60 px-3 py-1">
            <p className="text-[9px] tracking-widest text-[#b5e86a]/50 uppercase">Tempo</p>
            <p className="text-lg leading-6 tabular-nums">128</p>
          </div>
          <div className="hidden border-l border-black/60 px-3 py-1 sm:block">
            <p className="text-[9px] tracking-widest text-[#b5e86a]/50 uppercase">Now playing</p>
            <p className="w-40 truncate text-lg leading-6">{underPlayhead?.name ?? "—"}</p>
          </div>
        </div>
        <p className="ml-auto hidden font-mono text-xs text-white/40 lg:block">jnthn_portfolio.flp</p>
      </header>

      <main className="flex-1 p-3 sm:p-4">
        <section className="mb-4 px-1">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Jonathan Shechtman</h1>
          <p className="mt-1 text-sm text-white/60">Product designer &amp; producer · {site.location} · {site.job}</p>
        </section>

        {/* Arrangement */}
        <section id="arrangement" aria-label="Projects timeline" className="overflow-hidden rounded-lg border border-black/60 bg-[#1d1d22]">
          <div className="flex items-center justify-between border-b border-black/60 bg-[#2a2a31] px-3 py-1.5 text-xs text-white/60">
            <span className="font-semibold text-white/80">Playlist · Arrangement</span>
            <span>Click a clip to open the case study</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex min-w-[820px]">
              {/* Track headers */}
              <div className="w-[200px] shrink-0 border-r border-black/60">
                <div className="h-7 border-b border-black/60 bg-[#26262c]" />
                {arrangement.map((t, i) => {
                  const soon = t.status === "soon";
                  return (
                    <div key={t.slug} className="flex h-[84px] items-center gap-2 border-b border-black/60 bg-[#24242a] px-2">
                      <span className="h-full w-1.5 rounded-full" style={{ background: t.color }} />
                      <span className="w-5 font-mono text-[11px] text-white/40">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        {soon ? (
                          <span className="block truncate text-sm font-semibold text-white/70">{t.name}</span>
                        ) : (
                          <Link href={`/${t.slug}`} className="block truncate text-sm font-semibold text-white hover:underline">{t.name}</Link>
                        )}
                        <span className="block truncate text-[11px] text-white/45">{t.role}</span>
                        <div className="mt-1.5 flex gap-1">
                          <button type="button" aria-label={`Mute ${t.name}`} aria-pressed={muted.includes(t.slug)} onClick={() => toggle(t.slug)}
                            className={`rounded px-1.5 text-[10px] font-bold ${muted.includes(t.slug) ? "bg-[#ffd166] text-black" : "bg-[#1a1a1e] text-white/60"}`}>M</button>
                          <button type="button" aria-label={`Solo ${t.name}`} aria-pressed={solo === t.slug} onClick={() => setSolo((s) => (s === t.slug ? null : t.slug))}
                            className={`rounded px-1.5 text-[10px] font-bold ${solo === t.slug ? "bg-[#6ab7ff] text-black" : "bg-[#1a1a1e] text-white/60"}`}>S</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline: ruler, lanes and playhead */}
              <div className="relative flex-1">
                <div className="relative h-7 border-b border-black/60 bg-[#26262c]">
                  {YEARS.map((y, i) => (
                    <span key={y} className="absolute top-0 h-full border-l border-white/15 pl-1.5 font-mono text-[11px] leading-7 text-white/50" style={{ left: `${(i / YEARS.length) * 100}%` }}>
                      {y}
                    </span>
                  ))}
                </div>

              {arrangement.map((t) => {
                const { left, width } = clipBox(t);
                const soon = t.status === "soon";
                const on = audible(t);
                const active = underPlayhead?.slug === t.slug;
                const clipClass = `absolute inset-y-1.5 overflow-hidden rounded-[5px] border text-left transition ${on ? "" : "opacity-30 grayscale"} ${active ? "ring-2 ring-white/70" : ""}`;
                const clipStyle = {
                  left: `${left}%`,
                  width: `${width}%`,
                  borderColor: t.color,
                  background: soon
                    ? `repeating-linear-gradient(135deg, ${t.color}22 0 6px, transparent 6px 12px)`
                    : `${t.color}2e`,
                };
                const clipBody = (
                  <>
                    <span className="block truncate px-2 py-0.5 text-[11px] font-semibold text-black" style={{ background: t.color }}>
                      {t.name} {soon ? "· recording…" : `· ${t.kind}`}
                    </span>
                    <span className="block truncate px-2 pt-1 text-xs text-white/80">{soon ? "Coming soon" : t.summary}</span>
                    {!soon && <Waveform seed={t.slug} color={t.color} />}
                  </>
                );
                return (
                  <div key={t.slug} className="relative h-[84px] border-b border-black/60" style={{ background: "repeating-linear-gradient(90deg, transparent 0 calc(100%/24 - 1px), rgba(255,255,255,0.04) calc(100%/24 - 1px) calc(100%/24))" }}>
                    {soon ? (
                      <div className={clipClass} style={clipStyle}>{clipBody}</div>
                    ) : (
                      <Link href={`/${t.slug}`} className={`${clipClass} hover:brightness-125`} style={clipStyle}>{clipBody}</Link>
                    )}
                  </div>
                );
              })}

                <span className="pointer-events-none absolute inset-y-0 w-px bg-[#ff5c5c] shadow-[0_0_8px_#ff5c5c]" style={{ left: `${pos * 100}%` }}>
                  <span className="absolute top-0 -left-[5px] block size-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#ff5c5c]" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Mixer */}
        <section aria-label="Skills mixer" className="mt-4 overflow-hidden rounded-lg border border-black/60 bg-[#1d1d22]">
          <div className="border-b border-black/60 bg-[#2a2a31] px-3 py-1.5 text-xs font-semibold text-white/80">Mixer · Skills</div>
          <div className="flex gap-2 overflow-x-auto p-3">
            {skills.map((s, i) => (
              <div key={s.name} className="flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-md bg-[#24242a] px-2 py-3">
                <div className="relative flex h-36 w-full justify-center gap-1">
                  {[0, 1].map((ch) => (
                    <span key={ch} className="relative h-full w-1.5 overflow-hidden rounded-full bg-black/60">
                      <span
                        className="absolute inset-0 origin-bottom animate-[meter_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-t from-[#4fd1a5] via-[#b5e86a] to-[#ff5c5c]"
                        style={{ ["--lo" as string]: s.level * 0.55, ["--hi" as string]: s.level, animationDelay: `${(i * 0.23 + ch * 0.4) % 1.6}s` }}
                      />
                    </span>
                  ))}
                  <span className="absolute right-1 h-3 w-5 -translate-y-1/2 rounded-sm border border-black/60 bg-[#d7d7dc]" style={{ top: `${(1 - s.level) * 100}%` }} />
                </div>
                <span className="font-mono text-[10px] text-white/45">{(-(1 - s.level) * 24).toFixed(1)} dB</span>
                <span className="w-full truncate text-center text-[11px] font-semibold text-white/80">{s.name}</span>
              </div>
            ))}
            <Link href="/about" className="flex w-[92px] shrink-0 flex-col items-center justify-end gap-2 rounded-md bg-[#b5e86a] px-2 py-3 text-black hover:brightness-110">
              <span className="font-heading text-lg font-bold">Master</span>
              <span className="text-[11px] font-semibold">About me →</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
