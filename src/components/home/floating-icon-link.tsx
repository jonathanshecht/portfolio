"use client";

// A contact-section button that sends one little icon floating up out of it each time it's hovered
// or focused, with the same drift-and-fade as the piano notes (and one icon per hover, like the
// project cards).
// Two looks: "filled" (white, red on hover) and "outlined" (red outline and arrow on hover).
// Two sizes: "regular" (contact section) and "compact" (the nav's pill).
// Each is also a ".glow-trigger": inside the contact section, hovering it lights up the graffiti
// JS mark above.

import { ArrowUpRight, FileUser, Mail } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const FLOAT_MS = 1300; // matches .note-float in globals.css

const LOOKS = {
  filled: {
    link: "bg-white text-black hover:bg-[#E5484D] focus-visible:bg-[#E5484D]",
    arrow: "",
  },
  outlined: {
    link: "border border-white/40 hover:border-[#E5484D] focus-visible:border-[#E5484D]",
    arrow:
      "transition-colors group-hover:text-[#E5484D] group-focus-visible:text-[#E5484D]",
  },
};

const ICONS = { mail: Mail, resume: FileUser };

const SIZES = {
  regular: { link: "gap-2 px-6 py-3", arrow: "" },
  // On phones the nav is tight, so the compact button drops its arrow there.
  compact: { link: "h-10 gap-1.5 px-4", arrow: "hidden sm:block" },
};

type Floater = {
  id: number;
  x: number;
  drift: number;
  tilt: number;
  size: number;
  blur: number;
};

export function FloatingIconLink({
  href,
  label,
  icon,
  look,
  size = "regular",
}: {
  href: string;
  label: ReactNode;
  icon: keyof typeof ICONS;
  look: keyof typeof LOOKS;
  size?: keyof typeof SIZES;
}) {
  const Icon = ICONS[icon];
  const reducedMotion = useReducedMotion();
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const nextId = useRef(0);
  // True while hovered or focused, so hover plus focus only sends one icon.
  const active = useRef(false);

  const remove = useCallback(
    (id: number) => setFloaters((fs) => fs.filter((f) => f.id !== id)),
    [],
  );
  const emit = useCallback(() => {
    const id = ++nextId.current;
    const drift = (Math.random() * 2 - 1) * 16;
    const tilt = drift * 0.6 + (Math.random() * 2 - 1) * 8;
    // Like the notes: about a third come out a little bigger and slightly out of focus.
    const near = Math.random() < 0.35;
    const size = near ? 19 + Math.random() * 4 : 16;
    const blur = near ? 0.6 + Math.random() * 0.8 : 0;
    const x = 20 + Math.random() * 60; // % across the button
    setFloaters((fs) => [...fs, { id, x, drift, tilt, size, blur }]);
    // Fallback cleanup in case animationend never fires (e.g. the tab is hidden mid-animation).
    window.setTimeout(() => remove(id), FLOAT_MS + 300);
  }, [remove]);

  const stop = () => {
    active.current = false;
  };
  const start = () => {
    if (active.current) return;
    active.current = true;
    if (!reducedMotion) emit();
  };

  return (
    <div className="relative">
      {/* Above everything around it, so the icons float over the text above the buttons. */}
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
            onAnimationEnd={() => remove(f.id)}
          >
            <Icon style={{ width: f.size, height: f.size }} strokeWidth={1.5} />
          </span>
        ))}
      </div>
      <a
        href={href}
        {...(href.startsWith("mailto:")
          ? {}
          : { target: "_blank", rel: "noreferrer" })}
        onPointerEnter={(e) => e.pointerType === "mouse" && start()}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
        className={`glow-trigger group flex items-center rounded-full font-heading text-sm font-bold transition-colors outline-none ${SIZES[size].link} ${LOOKS[look].link}`}
      >
        {label}
        <ArrowUpRight
          aria-hidden
          className={`size-4 ${SIZES[size].arrow} ${LOOKS[look].arrow}`}
          strokeWidth={2.5}
        />
      </a>
    </div>
  );
}
