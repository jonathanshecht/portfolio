import type { Metadata } from "next";
import { Mynerve } from "next/font/google";
import Image from "next/image";
import { ContactSection, HomeFooter } from "@/components/home/contact-section";
import { Portrait } from "@/components/home/portrait";
import { GlowName } from "@/components/home/glow-name";
import { PillNav } from "@/components/home/pill-nav";
import { Rich } from "@/components/rich";
import { about } from "@/data/site";

// The same handwriting as "psst… play me" and the ghost's line on the portrait.
const handwriting = Mynerve({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "About",
};

// Highlighted phrases in the copy: on the dark page they stand out as full-strength white
// against the dimmer body text, instead of the light marker used on the old light pages. (The
// global mark rule sits outside Tailwind's layers, so these overrides need "!".)
const copy =
  "space-y-4 text-lg leading-8 text-white/70 [&_mark]:bg-transparent! [&_mark]:p-0! [&_mark]:text-white! [&_a]:transition-colors [&_a]:outline-none [&_a:hover]:text-[#E5484D] [&_a:focus-visible]:text-[#E5484D] [&_a]:whitespace-nowrap [&_a_svg]:ml-0.5 [&_a_svg]:inline [&_a_svg]:size-4 [&_a_svg]:align-[-1px]";

// Same dark look as the home page: the floating pill nav, 24px from a heading to its text (like
// the project cards), and the "Let's work together" section to close. The two sections sit a bit
// closer than the home page's (96px apart), since the intro is short.
export default function AboutPage() {
  return (
    <div className="home-page relative isolate min-h-dvh overflow-hidden bg-[#080808] text-white">
      <PillNav />

      <main className="flex flex-col items-center px-4">
        <div className="w-full max-w-[846px] pt-[136px] sm:px-4 sm:pt-[200px]">
          {/* Intro: the greeting beside a portrait (on phones, the portrait comes first, centered,
              with the greeting under it), then a bit about me at full width. */}
          <section>
            <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="font-heading text-[32px] font-bold sm:text-4xl">
                Hello, I&rsquo;m <GlowName>Jonathan</GlowName>
              </h1>
              {/* The portrait, with the little ghost on my shoulder. Giving the ghost the
                  earbud makes my name glow. */}
              <div className="order-first w-full max-w-[312px] shrink-0 self-center sm:order-none sm:self-auto">
                <Portrait />
              </div>
            </div>
            <div className={`mt-12 sm:mt-20 ${copy}`}>
              {about.intro.map((html) => (
                <Rich key={html} as="p" html={html} />
              ))}
              {/* Where I've worked, as a separate line under the intro. */}
              <Rich as="p" html={about.previously} className="pt-2" />
            </div>
          </section>

          {/* Hobbies: a photo of me playing on the left (balancing the portrait on the right above), framed like the portrait
              (the same 312px square, a faint gray outline and rounded corners), with the text beside it on the right. On phones the photo sits on top,
              with the text below. */}
          <section className="relative mt-20 pb-32 sm:mt-24">
                {/* A small handwritten note with a doodled arrow pointing at me. On wide screens it hangs past the card's left edge
                    with the arrow; otherwise it sits on the photo, where it needs no arrow. It's outside the card so it isn't clipped. */}
                <div
                  aria-hidden
                  className={`${handwriting.className} pointer-events-none absolute top-8 left-[5%] z-10 sm:top-16 xl:left-[-76px] flex items-start gap-0.5 text-[15px] leading-none text-white/90 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.7))]`}
                >
                  <span className="-rotate-6 whitespace-nowrap">my first performance!</span>
                  <svg
                    viewBox="0 0 34 30"
                    className="mt-2 hidden h-7 w-8 xl:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 4 C 13 2, 24 8, 28 23" />
                    <path d="M23 18.5 L28.2 23.6 L31 17" />
                  </svg>
                </div>
            <div className="relative flex flex-col sm:flex-row sm:items-center">
              <div className="relative aspect-square shrink-0 overflow-hidden rounded-2xl border border-white/15 sm:w-[312px]">
                <Image
                  src={about.hobbies.photo}
                  alt="Jonathan playing keys at a show, in black and white"
                  fill
                  quality={90}
                  sizes="(min-width: 640px) 312px, 100vw"
                  className="origin-[50%_40%] scale-[1.12] object-cover object-[50%_45%]" // zoomed in a little to crop the keyboard's edges
                />
              </div>
              <div className="relative pt-8 sm:flex-1 sm:pt-0 sm:pl-12">
                <h2 className="font-heading text-[28px] font-bold sm:text-[30px]">
                  {about.hobbies.title}
                </h2>
                <div className={`mt-6 ${copy}`}>
                  {about.hobbies.paragraphs.map((html) => (
                    <Rich key={html} as="p" html={html} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <ContactSection />
      </main>

      <HomeFooter />
    </div>
  );
}
