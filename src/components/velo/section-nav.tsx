"use client";

import { useEffect, useState } from "react";

// A small list of the page's sections pinned to the right edge on wide screens, like the side nav
// on the older case studies. Clicking one scrolls to it, and the section you're reading lights up.
// Hidden below 1280px, where there's no room beside the text.
export function SectionNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    // A section counts as "current" once its top passes the upper third of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  const go = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="On this page"
      className="fixed top-1/2 right-[max(16px,calc((100vw-846px)/2-200px))] z-30 hidden w-36 -translate-y-1/2 xl:block"
    >
      <ul className="grid gap-2.5 font-heading text-sm font-semibold">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={go(item.id)}
              aria-current={active === item.id ? "location" : undefined}
              className={`block transition-colors outline-none focus-visible:text-white/90 ${
                active === item.id
                  ? "font-bold text-(--accent)"
                  : "text-white/40 hover:text-white/75"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Back to top"
            className="block text-white/40 transition-colors outline-none hover:text-white/75 focus-visible:text-white"
          >
            ↑
          </a>
        </li>
      </ul>
    </nav>
  );
}
