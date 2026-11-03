import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Concepts" };

const concepts = [
  { href: "/concepts/streaming", name: "Streaming", note: "Your work as an album: tracklist, artist card, now-playing bar." },
  { href: "/concepts/daw", name: "DAW", note: "Your career as an arrangement: projects as clips on a timeline, skills as a mixer." },
  { href: "/concepts/now-playing", name: "Now Playing", note: "A full-screen player: one project at a time, highlights as synced lyrics, waveform scrubber." },
];

export default function ConceptsIndex() {
  return (
    <main className="min-h-dvh bg-[#0b0b0e] px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.25em] text-white/50 uppercase">Redesign</p>
        <h1 className="mt-2 text-4xl font-bold">Music-app concepts</h1>
        <p className="mt-3 text-white/60">Home-page explorations using the real projects. Pick one direction (or mix pieces) to develop.</p>
        <ul className="mt-10 grid gap-3">
          {concepts.map((c, i) => (
            <li key={c.href}>
              <Link href={c.href} className="flex items-start gap-5 rounded-2xl bg-white/5 p-5 transition hover:bg-white/10">
                <span className="font-heading text-3xl font-bold text-[#b5e86a]">{String.fromCharCode(65 + i)}</span>
                <span>
                  <span className="block font-heading text-xl font-bold">{c.name}</span>
                  <span className="mt-1 block text-sm text-white/60">{c.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
