import { MapPin } from "lucide-react";
import { ContactSection, HomeFooter } from "@/components/home/contact-section";
import { PianoLogo } from "@/components/home/piano-logo";
import { PillNav } from "@/components/home/pill-nav";
import { ProjectGrid } from "@/components/home/project-grid";
import { releases } from "@/data/home";
import { site } from "@/data/site";

export default function Home() {
  return (
    <div className="home-page relative isolate min-h-dvh overflow-hidden bg-[#010101] text-white">
      <PillNav />

      <main className="flex flex-col items-center px-4">
        {/* Hero takes ~70% of the screen; its group (piano, subtitle, location, scroll cue) is
            stacked and centered on the vertical middle of the screen. */}
        <section className="relative h-[70svh] min-h-[480px] w-full">
          <div className="absolute top-[max(50svh,320px)] left-1/2 z-20 flex w-max max-w-[calc(100vw-32px)] -translate-1/2 flex-col items-center gap-16 text-center">
            <div className="flex flex-col items-center">
              <h1 className="sr-only">{site.name}</h1>
              <PianoLogo />
              <p className="relative z-50 mt-4 font-heading text-xl [text-shadow:0_0_2px_#010101,0_0_6px_#010101,0_0_14px_#010101] sm:text-2xl">
                A Product Designer &amp; Musician
              </p>
              <p className="relative z-50 mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1f1f1f] py-1.5 pr-3.5 pl-2.5 text-sm">
                <MapPin aria-hidden className="size-4" strokeWidth={2} />
                {site.location}
              </p>
            </div>
            {/* A quiet invitation: slightly dimmed at rest, full strength on hover or focus. */}
            <a
              href="#playlist"
              className="group relative z-50 [text-shadow:0_0_2px_#010101,0_0_6px_#010101,0_0_14px_#010101] flex flex-col items-center gap-4 text-base outline-none"
            >
              <span className="opacity-85 transition-opacity duration-250 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                Scroll to see my projects
              </span>
              {/* Scroll cue: a circle with two chevrons. */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6 animate-[nudge_1.8s_ease-in-out_infinite] opacity-75 transition-[opacity,color] duration-250 ease-out group-hover:text-[#E5484D] group-hover:opacity-100 group-focus-visible:text-[#E5484D] group-focus-visible:opacity-100"
              >
                <path d="M9 14l3 3 3-3M9 8l3 3 3-3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
          </div>
        </section>

        {/* Project grid, anchored just below the floating nav: the hero's scroll cue lands here,
            and with the hero at 70% the first row peeks into the first screen. */}
        <section
          id="playlist"
          aria-labelledby="work-title"
          className="w-full max-w-[1200px] pt-[max(104px,14svh)] pb-32 sm:px-4 sm:pt-[max(136px,14svh)]"
        >
          <h2 id="work-title" className="sr-only">
            Selected work
          </h2>
          <ProjectGrid releases={releases} />
        </section>

        <ContactSection />
      </main>

      <HomeFooter />
    </div>
  );
}
