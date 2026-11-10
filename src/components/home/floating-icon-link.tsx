"use client";

// The site's button (contact section, nav, case studies): it sends one little icon floating up out of it each time it's hovered
// or focused, with the same drift-and-fade as the piano notes (and one icon per hover, like the
// project cards).
// Two looks: "filled" (white, red on hover) and "outlined" (red outline and arrow on hover).
// Two sizes: "regular" (contact section) and "compact" (the nav's pill).
// Each is also a ".glow-trigger": inside the contact section, hovering it lights up the graffiti
// JS mark above.

import { ArrowDown, ArrowUpRight, FileUser, Mail, Play } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const FLOAT_MS = 1300; // matches .note-float in globals.css

const LOOKS = {
  filled: {
    link: "bg-white text-black hover:bg-(--accent) focus-visible:bg-(--accent)",
    arrow: "",
  },
  outlined: {
    link: "border border-white/40 hover:border-(--accent) focus-visible:border-(--accent)",
    arrow:
      "transition-colors group-hover:text-(--accent) group-focus-visible:text-(--accent)",
  },
};

const ICONS = { mail: Mail, resume: FileUser, play: Play };

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
  onClick,
}: {
  href: string;
  label: ReactNode;
  icon: keyof typeof ICONS;
  look: keyof typeof LOOKS;
  size?: keyof typeof SIZES;
  // For a link to a spot on the same page (href "#..."), what to do on click.
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  // A link to a spot on the same page opens in place; others open in a new tab (except email).
  // The trailing icon is a play triangle for a video button, a down arrow for an in-page link, and
  // the usual up-right arrow otherwise.
  const inPage = href.startsWith("#");
  const isPlay = icon === "play";
  const Arrow = isPlay ? Play : inPage ? ArrowDown : ArrowUpRight;
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
            className="note-float absolute top-0 text-(--accent)"
            style={{
              left: `${f.x}%`,
              filter: `${f.blur ? `blur(${f.blur.toFixed(2)}px) ` : ""}drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 35%, transparent))`,
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
        {...(href.startsWith("mailto:") || inPage
          ? {}
          : { target: "_blank", rel: "noreferrer" })}
        onClick={onClick}
        onPointerEnter={(e) => e.pointerType === "mouse" && start()}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
        className={`glow-trigger group flex items-center rounded-full font-heading text-sm font-bold transition-colors outline-none ${SIZES[size].link} ${LOOKS[look].link}`}
      >
        {label}
        <Arrow
          aria-hidden
          className={`${isPlay ? "size-3.5" : "size-4"} ${SIZES[size].arrow} ${LOOKS[look].arrow}`}
          fill={isPlay ? "currentColor" : "none"}
          strokeWidth={isPlay ? 0 : 2.5}
        />
      </a>
    </div>
  );
}
