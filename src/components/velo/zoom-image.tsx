"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

// A small framed image that opens full size when clicked. The full view is a native dialog, so
// Escape closes it and focus returns to the thumbnail; clicking anywhere also closes it.
export function ZoomImage({
  src,
  width,
  height,
  alt,
  caption,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  // The full-size image is only loaded once someone opens it.
  const [opened, setOpened] = useState(false);
  const gif = src.endsWith(".gif");

  return (
    <figure>
      <button
        type="button"
        onClick={() => {
          setOpened(true);
          dialog.current?.showModal();
        }}
        aria-label={`Enlarge: ${alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/15 bg-[#0b0b0d] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 640px) 420px, 100vw"
          unoptimized={gif}
          className="block w-full"
        />
        <span
          aria-hidden
          className="absolute right-2 bottom-2 rounded-md bg-black/70 p-1.5 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Maximize2 strokeWidth={2} className="size-3.5" />
        </span>
      </button>
      {caption && (
        <figcaption className="mt-2 text-sm text-white/50">
          {caption}
        </figcaption>
      )}

      <dialog
        ref={dialog}
        onClick={() => dialog.current?.close()}
        className="m-auto max-h-none max-w-none cursor-zoom-out bg-transparent p-0 outline-none backdrop:bg-black/85"
      >
        {opened && (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="94vw"
            unoptimized={gif}
            loading="eager"
            // As wide as fits: 94% of the screen, or less if that would be taller than 90%.
            style={{
              width: `min(94vw, ${width}px, calc(90vh * ${width / height}))`,
            }}
            className="block h-auto rounded-lg"
          />
        )}
      </dialog>
    </figure>
  );
}
