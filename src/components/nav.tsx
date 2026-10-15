import Link from "next/link";
import { site } from "@/data/site";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: site.links.linkedin, label: "LinkedIn", external: true },
  { href: site.links.resume, label: "Resume", external: true },
];

// `tone="dark"` is for pages whose top section is dark (case studies).
export function Nav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <header className={dark ? "absolute inset-x-0 top-0 z-20" : "relative z-20"}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <Link href="/" aria-label={`${site.name}, home`} className="shrink-0">
          <span
            className={`logo-texture font-logo text-[32px] leading-none ${dark ? "brightness-200" : ""}`}
            style={{ backgroundImage: `url(${site.logoTexture})` }}
          >
            jnthn
          </span>
        </Link>
        <ul className={`flex gap-4 text-sm font-medium sm:gap-7 ${dark ? "text-white/80" : "text-body"}`}>
          {links.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noreferrer" className={dark ? "hover:text-white" : "hover:text-ink"}>
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className={dark ? "hover:text-white" : "hover:text-ink"}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
