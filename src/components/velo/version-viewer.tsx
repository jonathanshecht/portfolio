"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Annotated, type Annotation } from "./annotations";

type Version = {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  notes: Annotation[];
};

// Earlier versions of a screen, shown large one at a time, each with handwritten notes pointing at
// what changed. Arrows step through them; clicking a screenshot opens it full size. Every frame is
// the same size (`aspect`), and a screenshot of a different shape sits whole inside it.
export function VersionViewer({
  versions,
  hand,
  aspect,
  noun = "version",
}: {
  versions: Version[];
  hand: string;
  aspect: string;
  // What each screenshot is, for the arrow buttons' labels ("Next version").
  noun?: string;
}) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const v = versions[index];
  const step = (by: number) =>
    setIndex((i) => (i + by + versions.length) % versions.length);
  // Big round arrows beside the screenshot on wider screens, small ones under it on phones.
  const sideArrow =
    "absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 text-white transition-colors outline-none hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white/60 sm:grid";
  const smallArrow =
    "grid size-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white outline-none focus-visible:outline-2 focus-visible:outline-white/60 sm:hidden";

  return (
    <figure className="mx-auto max-w-[600px]">
      <Annotated notes={v.notes} hand={hand} steady>
        <div className="relative">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={`Previous ${noun}`}
            className={`${sideArrow} -left-16`}
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`Next ${noun}`}
            className={`${sideArrow} -right-16`}
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setOpened(true);
              dialog.current?.showModal();
            }}
            aria-label={`Enlarge: ${v.alt}`}
            style={{ aspectRatio: aspect }}
            className="group relative flex w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-[#0b0b0d] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
          >
            <Image
              key={v.src}
              src={v.src}
              alt={v.alt}
              width={v.width}
              height={v.height}
              sizes="(min-width: 640px) 600px, 100vw"
              className="size-full object-contain"
            />
            <span
              aria-hidden
              className="absolute right-2 bottom-2 rounded-md bg-black/70 p-1.5 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <Maximize2 strokeWidth={2} className="size-3.5" />
            </span>
          </button>
        </div>
      </Annotated>

      <figcaption className="mt-3 flex items-center justify-between gap-3 text-sm text-white/50">
        <span aria-live="polite">{v.label}</span>
        <span className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={`Previous ${noun}`}
            className={smallArrow}
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          {/* One dot per version; the current one is yellow and wider. */}
          <span className="flex items-center gap-1.5">
            {versions.map((x, i) => (
              <button
                key={x.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${x.label.toLowerCase()}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${
                  i === index
                    ? "w-5 bg-(--accent)"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`Next ${noun}`}
            className={smallArrow}
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </span>
      </figcaption>

      <dialog
        ref={dialog}
        onClick={() => dialog.current?.close()}
        className="m-auto max-h-none max-w-none cursor-zoom-out bg-transparent p-0 outline-none backdrop:bg-black/85"
      >
        {opened && (
          <Image
            key={v.src}
            src={v.src}
            alt={v.alt}
            width={v.width}
            height={v.height}
            sizes="94vw"
            loading="eager"
            style={{
              width: `min(94vw, ${v.width}px, calc(90vh * ${v.width / v.height}))`,
            }}
            className="block h-auto rounded-lg"
          />
        )}
      </dialog>
    </figure>
  );
}
