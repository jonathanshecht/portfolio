import type { Metadata } from "next";
import { Mynerve } from "next/font/google";
import { ContactSection, HomeFooter } from "@/components/home/contact-section";
import { Portrait } from "@/components/home/portrait";
import { GlowName } from "@/components/home/glow-name";
import { PillNav } from "@/components/home/pill-nav";
import { Rich } from "@/components/rich";
import { about } from "@/data/site";

// Same handwriting as the ghost's speech line, for the photo's caption.
const handwriting = Mynerve({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "About",
};

// Highlighted phrases in the copy: on the dark page they stand out as full-strength white
// against the dimmer body text, instead of the light marker used on the old light pages. (The
// global mark rule sits outside Tailwind's layers, so these overrides need "!".)
const copy =
  "space-y-4 text-lg leading-8 text-white/70 [&_mark]:bg-transparent! [&_mark]:p-0! [&_mark]:text-white!";

// Same dark look and spacing rhythm as the home page: the floating pill nav, 128px between
// sections (like the home page's sections), 24px from a heading to its text (like the project
// cards), and the "Let's work together" section to close.
export default function AboutPage() {
  return (
    <div className="home-page relative isolate min-h-dvh overflow-hidden bg-[#010101] text-white">
      <PillNav />

      <main className="flex flex-col items-center px-4">
        <div className="w-full max-w-[846px] pt-[136px] sm:px-4 sm:pt-[200px]">
          {/* Intro: the greeting beside a portrait (on phones, the portrait comes first, centered,
              with the greeting under it), then a bit about me. */}
          <section>
            <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="font-heading text-[32px] font-bold sm:text-4xl">
                Hello, I&rsquo;m <GlowName>Jonathan</GlowName>
              </h1>
              {/* The portrait, with the little ghost on my shoulder. Giving the ghost the
                  earbud makes my name glow. Under it, a little handwritten caption, like a note
                  on a polaroid. */}
              <figure className="order-first w-full max-w-[312px] shrink-0 self-center sm:order-none sm:self-auto">
                <Portrait />
                <figcaption
                  className={`${handwriting.className} mt-3 -rotate-2 text-center text-[15px] text-white/65`}
                >
                  me &amp; my best friend
                </figcaption>
              </figure>
            </div>
            <div className={`mt-12 sm:mt-20 ${copy}`}>
              {about.intro.map((html) => (
                <Rich key={html} as="p" html={html} />
              ))}
              {/* Where I've worked, as a quieter line under the intro. */}
              <Rich
                as="p"
                html={about.previously}
                className="pt-2 text-base text-white/50"
              />
            </div>
          </section>

          <section className="mt-32 pb-32">
            <h2 className="font-heading text-[32px] font-bold sm:text-4xl">
              {about.hobbies.title}
            </h2>
            <div className={`mt-6 ${copy}`}>
              {about.hobbies.paragraphs.map((html) => (
                <Rich key={html} as="p" html={html} />
              ))}
            </div>
          </section>
        </div>

        <ContactSection />
      </main>

      <HomeFooter />
    </div>
  );
}
