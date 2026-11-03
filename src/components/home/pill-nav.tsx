import Link from "next/link";
import { FloatingIconLink } from "@/components/home/floating-icon-link";
import { GraffitiJsMark } from "@/components/home/js-mark";
import { site } from "@/data/site";

const links = [
  { href: "/#playlist", label: "Work" },
  { href: "/about", label: "About" },
  { href: site.links.resume, label: "Resume", external: true },
];

// Floating dark pill (same fill and hairline stroke as the instrument menu): JS mark on the left,
// then the page links, and a small white "Get in touch" button with an arrow that opens an email
// ("Contact" on phones, where space is tight). Like the contact section's button, it sends a little
// envelope floating up on hover.
export function PillNav() {
  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-4 sm:top-14">
      <nav className="flex h-15 items-center gap-5 rounded-full border border-white/12 bg-[#111] pr-2.5 pl-4 sm:gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="flex shrink-0 items-center rounded-md transition-opacity outline-none hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:outline-[#E5484D]"
        >
          <GraffitiJsMark className="size-7" mode="static" />
        </Link>
        <ul className="flex items-center gap-4 text-sm text-white sm:gap-10">
          {links.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 transition-colors outline-none hover:text-[#E5484D] focus-visible:text-[#E5484D] focus-visible:underline"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="underline-offset-4 transition-colors outline-none hover:text-[#E5484D] focus-visible:text-[#E5484D] focus-visible:underline"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <FloatingIconLink
              href={site.links.email}
              icon="mail"
              look="filled"
              size="compact"
              label={
                <>
                  <span className="sm:hidden">Contact</span>
                  <span className="hidden sm:inline">Get in touch</span>
                </>
              }
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}
