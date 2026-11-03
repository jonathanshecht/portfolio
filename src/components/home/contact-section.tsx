import { FloatingIconLink } from "@/components/home/floating-icon-link";
import { GraffitiHeading } from "@/components/home/graffiti-heading";
import { site } from "@/data/site";

// The closing "Let's work together" section and the small footer, shared by the home and About
// pages (both dark).
export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-title"
      className="glow-zone relative flex w-full max-w-xl flex-col items-center gap-6 py-32 text-center"
    >
      {/* The divider above the section: a faint line with a gentle hand-drawn wobble. */}
      <svg
        aria-hidden
        viewBox="0 0 576 6"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-1.5 w-full overflow-visible"
      >
        <path
          d="M0 3 C 48 1.6, 96 4.4, 150 3.1 S 250 1.5, 310 3.2 S 420 4.6, 470 2.9 S 550 1.8, 576 3"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <GraffitiHeading id="contact-title" text="Let’s work together" />
      <p className="text-base text-white/70">
        I&rsquo;m open to product design roles. Send me an email, grab my resume
        below, or find me on{" "}
        <a
          href={site.links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="text-white underline underline-offset-4 transition-colors outline-none hover:text-[#E5484D] focus-visible:text-[#E5484D]"
        >
          LinkedIn
        </a>
        .
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <FloatingIconLink
          href={site.links.email}
          label="Get in touch"
          icon="mail"
          look="filled"
        />
        <FloatingIconLink
          href={site.links.resume}
          label="Resume"
          icon="resume"
          look="outlined"
        />
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className="pb-10 text-center text-xs text-white/40">
      © {site.name} · {site.location}
    </footer>
  );
}
