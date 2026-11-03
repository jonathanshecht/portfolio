"use client";

import { useState } from "react";
import { MarkSvg, marks } from "./logo-marks";

const weights = [2, 2.5, 3];

const groups = [
  { title: "Treble-clef J + S", items: marks.filter((m) => m.clef) },
  { title: "Earlier directions", items: marks.filter((m) => !m.clef) },
];

function Grid() {
  return (
    <svg viewBox="0 0 24 24" className="absolute inset-0 size-full text-white/10" aria-hidden>
      {Array.from({ length: 25 }, (_, i) => (
        <g key={i} stroke="currentColor" strokeWidth={0.04}>
          <line x1={i} y1={0} x2={i} y2={24} />
          <line x1={0} y1={i} x2={24} y2={i} />
        </g>
      ))}
    </svg>
  );
}

export function LogoLab() {
  const [weight, setWeight] = useState(2.5);
  const [light, setLight] = useState(false);

  return (
    <main className={`min-h-dvh px-5 py-12 sm:px-8 ${light ? "bg-[#f4f2ee] text-[#16151a]" : "bg-[#0b0b0e] text-white"}`}>
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.25em] opacity-50 uppercase">Logo exploration</p>
        <h1 className="mt-2 text-4xl font-bold">JS monogram</h1>
        <p className="mt-3 max-w-2xl opacity-60">Lucide-style: 24px grid, round caps and joins, no fills. Each option is shown large, at small sizes and in place.</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="opacity-60">Stroke</span>
          {weights.map((w) => (
            <button key={w} type="button" onClick={() => setWeight(w)} aria-pressed={weight === w}
              className={`rounded-full px-3 py-1 font-semibold ${weight === w ? "bg-[#b5e86a] text-black" : "bg-current/10"}`}>
              {w}px
            </button>
          ))}
          <span className="ml-4 opacity-60">Background</span>
          <button type="button" onClick={() => setLight((l) => !l)} className="rounded-full bg-current/10 px-3 py-1 font-semibold">
            {light ? "Light" : "Dark"}
          </button>
        </div>

        {groups.map((group) => (
          <section key={group.title} className="mt-12">
            <h2 className="text-xs font-semibold tracking-[0.25em] opacity-50 uppercase">{group.title}</h2>
            <ul className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((mark) => (
                <li key={mark.id} className={`rounded-2xl p-5 ${light ? "bg-white" : "bg-white/5"}`}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-bold">{mark.id.toUpperCase()} · {mark.name}</h3>
                  </div>
                  <p className="mt-1 min-h-10 text-sm opacity-60">{mark.note}</p>

                  <div className="relative mx-auto mt-4 aspect-square w-full max-w-[220px]">
                    <Grid />
                    <MarkSvg mark={mark} strokeWidth={weight} className="relative size-full" />
                  </div>

                  {/* Small sizes */}
                  <div className="mt-5 flex items-end justify-center gap-5">
                    {[48, 32, 24, 16].map((s) => (
                      <div key={s} className="flex flex-col items-center gap-1">
                        <MarkSvg mark={mark} strokeWidth={weight} style={{ width: s, height: s }} />
                        <span className="text-[10px] opacity-40">{s}</span>
                      </div>
                    ))}
                  </div>

                  {/* In context */}
                  <div className="mt-5 grid gap-2">
                    <div className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 ${light ? "bg-[#f4f2ee]" : "bg-black/40"}`}>
                      <MarkSvg mark={mark} strokeWidth={weight} className="size-7" />
                      <span className="font-heading text-[15px] font-bold">Jonathan Shechtman</span>
                      <span className="ml-auto text-xs opacity-50">Work · About</span>
                    </div>
                    <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${light ? "bg-[#16151a] text-white" : "bg-black"}`}>
                      <span className="flex size-11 items-center justify-center rounded-md bg-[#b5e86a] text-black">
                        <MarkSvg mark={mark} strokeWidth={weight} className="size-7" />
                      </span>
                      <span className="text-sm">
                        <span className="block font-semibold">Selected Work</span>
                        <span className="block text-xs opacity-60">Jonathan Shechtman</span>
                      </span>
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="flex size-5 items-center justify-center rounded bg-white text-black">
                          <MarkSvg mark={mark} strokeWidth={weight} className="size-3.5" />
                        </span>
                        <span className="text-[10px] opacity-50">tab</span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
