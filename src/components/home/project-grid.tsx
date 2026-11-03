"use client";

import {
  ArrowUpRight,
  Camera,
  ClefTreble,
  MicVocal,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { Release } from "@/data/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const HOVER_ICONS: Record<NonNullable<Release["hoverIcon"]>, LucideIcon> = {
  camera: Camera,
  clef: ClefTreble,
  mic: MicVocal,
};
const FLOAT_MS = 1300; // matches .note-float in globals.css

type Floater = {
  id: number;
  x: number;
  drift: number;
  tilt: number;
  size: number;
  blur: number;
};

function ProjectTile({ release }: { release: Release }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  // Each hover (or keyboard focus) sends one icon floating out of the top of the thumbnail,
  // using the same drift-and-fade animation as the piano notes.
  const Icon = release.hoverIcon ? HOVER_ICONS[release.hoverIcon] : null;
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const floaterId = useRef(0);
  // True while the card is hovered or focused, so hover + click-to-focus emits only once.
  const active = useRef(false);

  const removeFloater = useCallback(
    (id: number) => setFloaters((fs) => fs.filter((f) => f.id !== id)),
    [],
  );
  const emit = useCallback(() => {
    const id = ++floaterId.current;
    const drift = (Math.random() * 2 - 1) * 16;
    const tilt = drift * 0.6 + (Math.random() * 2 - 1) * 8;
    const x = 25 + Math.random() * 50; // % across the thumbnail
    // Like the piano notes: about a third come out a little bigger and slightly out of focus.
    const near = Math.random() < 0.35;
    const size = near ? 21 + Math.random() * 4 : 18;
    const blur = near ? 0.6 + Math.random() * 0.8 : 0;
    setFloaters((fs) => [...fs, { id, x, drift, tilt, size, blur }]);
    // Fallback cleanup in case animationend never fires (e.g. the tab is hidden mid-animation).
    window.setTimeout(() => removeFloater(id), FLOAT_MS + 300);
  }, [removeFloater]);

  // The still image shows at rest; the preview fades in and plays from the start on mouse hover
  // or keyboard focus, and stops when you leave. Skipped for visitors who prefer reduced motion.
  const start = () => {
    if (active.current) return;
    active.current = true;
    if (Icon) emit();
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    video.currentTime = 0;
    void video
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});
  };
  const stop = () => {
    active.current = false;
    videoRef.current?.pause();
    setPlaying(false);
  };

  return (
    <li>
      <Link
        href={`/${release.slug}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && start()}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
        className="group block rounded-2xl outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-solid focus-visible:outline-[#E5484D]"
      >
        <div className="relative">
          {Icon && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-[46]"
            >
              {floaters.map((f) => (
                <span
                  key={f.id}
                  className="note-float absolute top-0 text-[#E5484D]"
                  style={{
                    left: `${f.x}%`,
                    filter: `${f.blur ? `blur(${f.blur.toFixed(2)}px) ` : ""}drop-shadow(0 0 6px rgba(229, 72, 77, 0.35))`,
                    ["--drift" as string]: `${f.drift}px`,
                    ["--tilt" as string]: `${f.tilt}deg`,
                  }}
                  onAnimationEnd={() => removeFloater(f.id)}
                >
                  <Icon
                    style={{ width: f.size, height: f.size }}
                    strokeWidth={1.5}
                  />
                </span>
              ))}
            </div>
          )}
          {/* data-physics-solid: loose pieces of the broken piano can land on the card image. */}
          <div
            data-physics-solid
            className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f] transition-colors duration-500 group-hover:border-white/25"
          >
            {/* The layered mockups have transparent backgrounds, so they sit inset on the dark panel. */}
            <Image
              src={release.image.src}
              alt=""
              width={release.image.width}
              height={release.image.height}
              sizes="(min-width: 768px) 600px, 100vw"
              className={`size-full ${release.fit === "cover" ? "object-cover" : "object-contain p-[7%]"}`}
            />
            <video
              ref={videoRef}
              src={release.video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-2xl font-bold">
            {release.title}
            <ArrowUpRight
              aria-hidden
              strokeWidth={2.5}
              className="size-5 text-[#E5484D] opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-1 motion-safe:translate-y-1 motion-safe:group-hover:translate-0 motion-safe:group-focus-visible:translate-0"
            />
          </h3>
          <p className="text-base text-white/70">{release.blurb}</p>
          <ul className="flex flex-wrap gap-2 text-sm" aria-label="Tags">
            {release.tags.map((tag) => (
              <li key={tag} className="rounded-lg bg-white/12 p-2 leading-none">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </li>
  );
}

// Two columns on desktop, one on mobile. Each tile links to its case study.
export function ProjectGrid({ releases }: { releases: Release[] }) {
  return (
    <ul className="grid w-full grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20">
      {releases.map((release) => (
        <ProjectTile key={release.slug} release={release} />
      ))}
    </ul>
  );
}
