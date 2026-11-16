import type { Metadata } from "next";
import { Check, Focus, Minus, Plus, Users, X } from "lucide-react";
import { Caveat, Mynerve, Outfit } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";
import { ContactSection, HomeFooter } from "@/components/home/contact-section";
import { HandDivider } from "@/components/hand-divider";
import { PillNav } from "@/components/home/pill-nav";
import { ProductVideo } from "@/components/velo/product-video";
import { Annotated } from "@/components/velo/annotations";
import { VersionViewer } from "@/components/velo/version-viewer";
import { DesignFoundations } from "@/components/velo/design-foundations";
import { NoteStack, type Note } from "@/components/velo/note-stack";
import { CourseSidebar } from "@/components/velo/course-sidebar";
import { DemoVideo } from "@/components/velo/demo-video";
import { SectionNav } from "@/components/velo/section-nav";
import { WatchVideoButton } from "@/components/velo/watch-video-button";
import { ZoomImage } from "@/components/velo/zoom-image";
import { releases } from "@/data/home";
import { cdn, type Img } from "@/data/site";

// The Velo case study (still being refined), opened from the home page card. The original
// version is kept at /velo-old. Same dark look as the home and about pages.

export const metadata: Metadata = {
  title: "Velo",
  description:
    "Velo: an online photography course built around learning by doing.",
};

// The page's accent color is Velo's brand yellow, set as --accent on the page wrapper, so the
// nav, the flying icons, hovers and the "Let's work together" graffiti all turn yellow here.
const VELO_YELLOW =
  releases.find((r) => r.slug === "velo")?.accent ?? "#FBFA9D";
const ACCENT = "text-(--accent)";

// Visuals reused from the original case study.
const img = {
  quiz: {
    src: cdn(
      "6a88d97e0c3e2766747a8e02_Screenshot%202026-08-21%20at%204.04.24%E2%80%AFPM.png",
    ),
    width: 846,
    height: 529,
  },
  sidebar: {
    src: cdn("6a88dacc7527519f120baf77_ezgif-73a480ece5ced031.gif"),
    width: 1280,
    height: 827,
  },
  // Name and logo explorations (dimmed, left) and the final Velo Academy mark (right).
  instructor: {
    src: "/velo/instructor-work.png",
    width: 1281,
    height: 465,
  },
  trial: {
    src: "/velo/free-trial-home-2.webp",
    width: 2000,
    height: 1257,
  },
  logos: { src: "/velo/logo-explorations-7.png", width: 1700, height: 440 },
} satisfies Record<string, Img>;

// The handwriting used for little notes on the site (as on the About page).
const handwriting = Mynerve({ subsets: ["latin"], weight: "400" });
// A neater hand for the research notes, where there are full sentences to read.
const noteHand = Caveat({ subsets: ["latin"], weight: "500" });
// Velo's own UI font, for the working copy of the course sidebar.
const veloUi = Outfit({ subsets: ["latin"] });

// ---- Small building blocks ----

// A section with an optional small gray label above its heading (styled like the Role / Team
// labels), for when the heading states the point and the label names the part of the story.
function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-20 scroll-mt-32 sm:mt-24">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
          {eyebrow}
        </p>
      )}
      {/* Smaller than the page title (and the same size as the About page's section heading). */}
      <h2 className="font-heading text-[28px] font-bold sm:text-[30px]">
        {title}
      </h2>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

// A key phrase in full white against the dimmer body text, so someone skimming can read just the
// highlights (as on the About page).
function H({ children }: { children: ReactNode }) {
  return <span className="text-white">{children}</span>;
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-lg leading-8 text-white/70 [&_strong]:font-semibold [&_strong]:text-white">
      {children}
    </p>
  );
}

function Decision({
  n,
  title,
  children,
  media,
  wide = false,
}: {
  n: number;
  title: string;
  children?: ReactNode;
  media?: ReactNode;
  // A wide visual (like the simulator demo) goes full width under the text instead of beside it.
  wide?: boolean;
}) {
  return (
    <div
      className={`relative mt-14 gap-10 pt-14 before:absolute before:top-0 before:left-1/2 before:h-px before:w-60 before:-translate-x-1/2 before:bg-white/20 [h3+&]:mt-0 [h3+&]:pt-8 [h3+&]:before:hidden ${wide ? "" : "sm:grid sm:grid-cols-2 sm:items-start"}`}
    >
      <div>
        <h4 className="flex items-baseline gap-3 text-xl font-bold">
          <span className={`font-heading tabular-nums ${ACCENT}`}>
            {String(n).padStart(2, "0")}
          </span>
          {title}
        </h4>
        {/* One spacing rule for every decision: text leading into a visual sits 24px above it,
            and the text after a visual gets 48px, so each paragraph stays attached to the visual
            it introduces. */}
        <div className="mt-4 space-y-6 [&>figure]:mb-12">{children}</div>
      </div>
      {media && <div className={wide ? "mt-6" : "mt-6 sm:mt-1"}>{media}</div>}
    </div>
  );
}

// The simulator demo with handwritten notes pointing at its parts. On phones the notes are hidden;
// the text above covers the same points.
// Marks the final design in a decision, after any earlier versions or competitors shown above it.
function FinalLabel() {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
      <span aria-hidden className="size-1.5 rounded-full bg-(--accent)" />
      Final design
    </p>
  );
}

function SimulatorDemo() {
  return (
    <div>
      <FinalLabel />
      <Annotated
        hand={handwriting.className}
        phoneList={false}
        notes={[
          {
            x: 11,
            side: "above",
            text: "tells you if the exposure is right",
          },
          {
            x: 67,
            side: "above",
            text: "sun, clouds or indoors",
          },
          { x: 25, side: "below", text: "the photo changes in real time" },
          {
            x: 75,
            side: "below",
            text: "on a tripod or handheld",
          },
        ]}
      >
        <DemoVideo
          src="/velo/exposure-demo-2.mp4"
          poster="/velo/exposure-demo-2-poster.jpg"
          label="The exposure simulator: an indoor portrait that changes as the aperture, shutter speed and ISO are adjusted, with a label saying whether the exposure is right"
        />
      </Annotated>
      <p className="mt-12 text-lg leading-8 text-white/70">
        In the beta, it was the part testers asked for more of.
      </p>
      <p className="mt-6 text-lg leading-8 text-white/70">
        With more time, I&rsquo;d make it look more like a real camera, and let
        learners take a photo and see how it turns out.
      </p>
    </div>
  );
}

// A goal from the challenge, heading the decisions that answer it. Styled like the challenge's
// numbered goals: a thin line on top and a small gray label.
function Goal({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="mt-12 border-t border-white/15 pt-5 first:mt-6">
      <span className="block text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
        Goal {String(n).padStart(2, "0")}
      </span>
      <span className="mt-2 block font-heading text-2xl font-bold">
        {title}
      </span>
    </h3>
  );
}

// The challenge's problems, side by side: a thin line on top of each, a small gray number (styled
// like the Role / Team labels), a title and a short description (stacked on phones). Plain text
// with no boxes, like the rest of the page.
function Problems({ items }: { items: { title: string; text: ReactNode }[] }) {
  return (
    <ol className="grid gap-8 pt-4 sm:grid-cols-2 sm:gap-10">
      {items.map((item, i) => (
        <li key={item.title} className="border-t border-white/15 pt-5">
          <span className="text-xs font-semibold tracking-[0.2em] text-white/50">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-2 font-heading text-xl font-bold text-white">
            {item.title}
          </p>
          <p className="mt-2 text-base leading-7 text-white/70">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

// The logo explorations image with small handwritten notes and doodled arrows (like the note on
// the About page): above it, why yellow won over teal; below it, why the other names lost. Notes
// are placed by percent so they follow the image at any width; phones get shorter wording so
// neighbors don't run into each other. The Movi note sits a row lower, clear of "too busy".
// A hand-drawn arrow: one curve (start, two control points, tip) drawn at its own size, so each
// note's arrow has its own shape. The head is worked out from the curve's direction at the tip,
// with slightly uneven sides so it looks drawn by hand.
type Pt2 = [number, number];
function DoodleArrow({
  w,
  h,
  curve,
  className = "",
}: {
  w: number;
  h: number;
  curve: [Pt2, Pt2, Pt2, Pt2];
  className?: string;
}) {
  const [a, b, c, tip] = curve;
  const angle = Math.atan2(tip[1] - c[1], tip[0] - c[0]);
  const side = (len: number, turn: number) =>
    `${(tip[0] - len * Math.cos(angle + turn)).toFixed(1)} ${(tip[1] - len * Math.sin(angle + turn)).toFixed(1)}`;
  return (
    <svg
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={`shrink-0 overflow-visible ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={`M${a.join(" ")} C ${b.join(" ")}, ${c.join(" ")}, ${tip.join(" ")}`}
      />
      <path d={`M${side(6, 0.5)} L${tip.join(" ")} L${side(5, -0.45)}`} />
    </svg>
  );
}

function LogoExplorations() {
  const note = `${handwriting.className} pointer-events-none absolute flex flex-col text-[13px] leading-none whitespace-nowrap text-white/80 sm:text-[15px]`;
  return (
    <figure className="!mt-8 pt-14 sm:!mt-10 sm:pt-16">
      <div className="relative mb-28 sm:mb-32">
        {/* Above, on the right: where the final mark comes from. */}
        <div
          aria-hidden
          className={`${note} right-[5%] bottom-full mb-1 items-end`}
        >
          <span className="rotate-2">
            <span className="hidden sm:inline">camera&rsquo;s </span>focus
            brackets
          </span>
          {/* The arrow hangs below the note, reaching down to the bracket on the logo. */}
          <DoodleArrow
            w={28}
            h={36}
            curve={[
              [10, 1],
              [24, 8],
              [24, 22],
              [16, 34],
            ]}
            className="absolute top-full right-2 mt-1 hidden sm:block"
          />
          <DoodleArrow
            w={18}
            h={26}
            curve={[
              [6, 1],
              [16, 6],
              [16, 16],
              [11, 24],
            ]}
            className="absolute top-full right-1 mt-0.5 sm:hidden"
          />
        </div>
        {/* Above: the colors. */}
        <div aria-hidden className={`${note} bottom-full left-0 mb-1`}>
          <span className="-rotate-3">
            yellow: energizing
            <span className="hidden sm:inline">, like light</span>
          </span>
          <DoodleArrow
            w={22}
            h={26}
            curve={[
              [4, 1],
              [2, 10],
              [7, 18],
              [15, 24],
            ]}
            className="mt-1 ml-3"
          />
        </div>
        <div
          aria-hidden
          className={`${note} bottom-full left-[36%] mb-1 sm:left-[31%]`}
        >
          <span className="-rotate-2">
            <span className="hidden sm:inline">
              teal: too calm, almost sterile
            </span>
            <span className="sm:hidden">teal: too sterile</span>
          </span>
          <DoodleArrow
            w={24}
            h={28}
            curve={[
              [3, 1],
              [14, 4],
              [3, 15],
              [12, 26],
            ]}
            className="mt-1 ml-4"
          />
        </div>

        <Image
          src={img.logos.src}
          alt="Logo explorations, including Lum in yellow and teal, Shuttr, Movi and earlier Velo versions, beside the final Velo Academy mark with yellow focus brackets. Yellow felt energizing, like light; teal felt too calm, almost sterile. Shuttr was too long, Movi was misleading since it's not just a video course, and the boxed Velo was too busy. The final mark is minimal and concise, built on a camera's focus brackets."
          width={img.logos.width}
          height={img.logos.height}
          sizes="(min-width: 880px) 846px, 100vw"
          unoptimized
          className="w-full"
        />

        {/* Below: the names and the boxed mark. */}
        <div aria-hidden className={`${note} top-full left-0 mt-1`}>
          <DoodleArrow
            w={20}
            h={24}
            curve={[
              [4, 23],
              [3, 15],
              [6, 7],
              [13, 2],
            ]}
            className="mb-1 ml-2"
          />
          <span className="rotate-2">too long</span>
        </div>
        <div aria-hidden className={`${note} top-full left-[15%] mt-1`}>
          <DoodleArrow
            w={22}
            h={52}
            curve={[
              [5, 51],
              [2, 34],
              [5, 15],
              [13, 2],
            ]}
            className="mb-1 ml-3"
          />
          <span className="rotate-1">
            misleading
            <span className="hidden sm:inline">, not just a video course</span>
          </span>
        </div>
        <div aria-hidden className={`${note} top-full left-[29%] mt-1`}>
          <DoodleArrow
            w={20}
            h={24}
            curve={[
              [14, 23],
              [17, 15],
              [12, 8],
              [6, 2],
            ]}
            className="mb-1 ml-3"
          />
          <span className="relative -rotate-2">
            too busy
            {/* A second arrow, sweeping up to the right toward the other Velo version. */}
            <DoodleArrow
              w={78}
              h={34}
              curve={[
                [2, 30],
                [28, 31],
                [58, 22],
                [74, 3],
              ]}
              className="absolute bottom-1 left-full ml-1 hidden sm:block"
            />
            <DoodleArrow
              w={22}
              h={26}
              curve={[
                [2, 24],
                [12, 23],
                [17, 14],
                [18, 3],
              ]}
              className="absolute bottom-1 left-full ml-0.5 sm:hidden"
            />
          </span>
        </div>
        {/* Under the final mark: a short arrow straight up at it, then the note. */}
        <div
          aria-hidden
          className={`${note} top-full left-[80%] mt-1 -translate-x-1/2 items-center`}
        >
          <DoodleArrow
            w={24}
            h={28}
            curve={[
              [16, 27],
              [20, 17],
              [15, 8],
              [7, 2],
            ]}
            className="mb-1"
          />
          <span className="-rotate-1">minimal &amp; concise</span>
        </div>
      </div>
      <figcaption className="text-center text-sm text-white/50">
        Logo explorations → final mark
      </figcaption>
    </figure>
  );
}

// The app audit: one column per app, each a screenshot in a thin frame (like the home cards'
// screens), then what Velo took from it (check) and what it left behind (cross).
function Audit({
  items,
}: {
  items: { name: string; icon: string; took: string; left: string }[];
}) {
  return (
    <ul className="grid gap-8 pt-2 sm:grid-cols-3 sm:gap-6">
      {items.map((item) => (
        <li key={item.name}>
          <p className="flex items-center gap-2 font-heading text-base font-bold text-white">
            <Image
              src={item.icon}
              alt=""
              width={20}
              height={20}
              className="size-5 rounded-[5px]"
            />
            {item.name}
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
            <li className="flex gap-2.5">
              <Check
                aria-label="Took"
                strokeWidth={2}
                className="mt-1 size-4 shrink-0 text-white/50"
              />
              {item.took}
            </li>
            <li className="flex gap-2.5">
              <X
                aria-label="Left behind"
                strokeWidth={2}
                className="mt-1 size-4 shrink-0 text-white/50"
              />
              {item.left}
            </li>
          </ul>
        </li>
      ))}
    </ul>
  );
}

// The two audience options side by side, each with its upsides (plus) and risks (minus), styled
// like the challenge's problems: a thin line on top, a small gray label, a title. No boxes. A
// handwritten note (like the logo annotations) marks which one I recommended and which was chosen.
function TradeOff({
  options: opts,
}: {
  options: {
    label: string;
    tag: string;
    title: string;
    upsides: string[];
    risks: string[];
  }[];
}) {
  return (
    <ul className="grid gap-8 pt-4 pb-2 sm:grid-cols-2 sm:gap-10">
      {opts.map((o) => (
        <li key={o.label} className="border-t border-white/15 pt-5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
              {o.label === "Focused" ? (
                <Focus aria-hidden strokeWidth={2} className="size-3.5" />
              ) : (
                <Users aria-hidden strokeWidth={2} className="size-3.5" />
              )}
              {o.label}
            </span>
            <span
              className={`${handwriting.className} -rotate-3 text-base leading-none ${ACCENT}`}
            >
              {o.tag}
            </span>
          </div>
          <p className="mt-2 font-heading text-xl font-bold text-white">
            {o.title}
          </p>
          <ul className="mt-3 space-y-2 text-base leading-7 text-white/70">
            {o.upsides.map((t) => (
              <li key={t} className="flex gap-2.5">
                <Plus
                  aria-label="Upside"
                  strokeWidth={2}
                  className="mt-1.5 size-4 shrink-0 text-white/50"
                />
                {t}
              </li>
            ))}
            {o.risks.map((t) => (
              <li key={t} className="flex gap-2.5">
                <Minus
                  aria-label="Risk"
                  strokeWidth={2}
                  className="mt-1.5 size-4 shrink-0 text-white/50"
                />
                {t}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

// A row of single notes (the Reddit findings under the audit), in the same sticky-note style as
// the interview piles. Two across on phones, three on wider screens.
function NoteRow({ notes }: { notes: Note[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-8 pt-4 pb-8 sm:grid-cols-3 sm:gap-x-6 sm:pb-10">
      {notes.map((note, i) => (
        <li key={note.text}>
          <NoteStack
            notes={[note]}
            font={noteHand.className}
            flip={i % 2 === 1}
          />
        </li>
      ))}
    </ul>
  );
}

// The research insights as a board: each claim as a small heading over a pile of notes: interviewees'
// words (person icon) and Reddit findings (Reddit icon), which you click through. Four across on desktop, two on phones.
function Insights({ items }: { items: { claim: string; quotes: Note[] }[] }) {
  return (
    <ol className="grid grid-cols-2 gap-x-5 gap-y-10 pt-4 md:grid-cols-4 md:gap-x-6">
      {items.map((item, i) => (
        <li key={item.claim} className="flex flex-col">
          <p className="font-heading text-base leading-snug font-bold text-white">
            {item.claim}
          </p>
          <div className="mt-auto pt-4">
            <NoteStack
              notes={item.quotes}
              font={noteHand.className}
              flip={i % 2 === 1}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

function Frame({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  return (
    <figure className="pt-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141417]">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-white/50">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ---- Page ----

// The "Redesigning the lesson" section is hidden for now.

// Same tags as the home page card.
const tags = releases.find((r) => r.slug === "velo")?.tags ?? [];

// The project at a glance, in a 3-column grid: Role, Timeline and Scope on top, then Team and
// Toolkit side by side.
const meta: [string, ReactNode][] = [
  ["Role", "Lead Designer"],
  ["Timeline", "March 2026 – September 2026"],
  ["Scope", "Brand, research, UX/UI, design system"],
  ["Team", "Instructor/founder/course content provider, PM, developer"],
  ["Toolkit", "Figma, Figma Make, Automatic.css"],
];

export default function VeloCaseStudy() {
  return (
    <div
      className="home-page relative isolate min-h-dvh overflow-hidden bg-[#080808] text-white"
      style={{
        ["--accent" as string]: VELO_YELLOW,
        ["--accent-lit" as string]: VELO_YELLOW,
      }}
    >
      <PillNav />
      <SectionNav
        items={[
          { id: "challenge", label: "Challenge" },
          { id: "research", label: "Research" },
          { id: "brand", label: "Brand" },
          { id: "system", label: "Design system" },
          { id: "mapping", label: "Structure" },
          { id: "decisions", label: "Key decisions" },
          { id: "beta", label: "Beta" },
          { id: "redesign", label: "Lesson redesign" },
          { id: "product", label: "Final product" },
          { id: "learned", label: "What I learned" },
        ]}
      />

      <main className="flex flex-col items-center px-4">
        <article className="w-full max-w-[846px] pt-[136px] pb-32 sm:px-4 sm:pt-[200px]">
          {/* Hero: the same clip as the home page card, uncropped in a rounded frame like the
              cards, the same width as the text, first thing on the page. */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141417]">
            <video
              src="/velo/hero.mp4"
              poster="/velo/hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
              className="aspect-video w-full object-cover"
            />
          </div>

          {/* Intro */}
          <header className="mt-12 sm:mt-16">
            <h1 className="font-heading text-[34px] font-bold sm:text-[40px]">
              Velo Academy
            </h1>
            {/* Status, with a red dot that blinks like a "live" light. */}
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/12 p-2 text-sm leading-none text-white/85">
              <span
                aria-hidden
                className="live-dot size-1.5 rounded-full bg-(--accent)"
              />
              Launched
            </p>
            <p className="mt-6 text-lg leading-8 text-white/70">
              The idea for Velo was conceived by a working photographer: an
              online course to teach beginners his craft. As{" "}
              <H>lead designer</H>, I took it{" "}
              <H>from first logo sketch to beta</H>. Its centerpiece is an{" "}
              <H>interactive camera simulator</H> that lets beginners learn
              exposure by changing real settings and watching the photo respond.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm" aria-label="Tags">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-lg bg-white/12 p-2 leading-none"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <WatchVideoButton target="product" />
            </div>
          </header>

          <HandDivider className="mt-12" />
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 py-8 sm:grid-cols-3">
            {meta.map(([label, value]) => (
              <div
                key={label}
                className={
                  label === "Team"
                    ? "col-span-2 sm:col-span-1"
                    : label === "Scope" || label === "Toolkit"
                      ? "col-span-2 sm:col-span-1"
                      : undefined
                }
              >
                <dt className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                  {label}
                </dt>
                <dd className="mt-2 text-base">{value}</dd>
              </div>
            ))}
          </dl>
          <HandDivider flip />

          {/* The outcomes for anyone skimming, labeled like Role / Team: the same style as the paragraphs,
              a size up. */}
          <div className="mt-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
              Impact
            </p>
            <ul className="mt-4 space-y-3">
              {[
                <>
                  Launched with <H>13% of trial users upgrading to paid</H> in
                  the first two weeks
                </>,
                <>
                  <H>Every beta tester</H> finished the first lesson with no
                  friction
                </>,
                <>
                  Every screen built from <H>my design system</H>
                </>,
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-xl leading-8 text-white/70"
                >
                  <span
                    aria-hidden
                    className="mt-[13px] size-1.5 shrink-0 rounded-full bg-(--accent)"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Section
            id="challenge"
            eyebrow="The challenge"
            title="Getting beginners to stay, and to pay"
          >
            <P>
              <H>Beginners give up on photography courses.</H> And a paid course
              has to <H>compete with free YouTube tutorials</H> and well-known
              instructors. That gave Velo two goals:
            </P>
            <Problems
              items={[
                {
                  title: "Keep beginners engaged",
                  text: "Long enough to actually learn.",
                },
                {
                  title: "Earn trust without a famous name",
                  text: "Give them a reason to pay for a course from someone they don\u2019t know.",
                },
              ]}
            />
          </Section>

          <Section
            id="research"
            eyebrow="Research"
            title="Beginners want to do, not watch"
          >
            <P>
              I <H>audited Duolingo, MasterClass and Udemy</H>, read through
              Reddit&rsquo;s photography communities, and{" "}
              <H>interviewed four very different beginners</H>.
            </P>

            <h3 className="pt-8 font-heading text-lg font-bold text-white">
              What other platforms got right
            </h3>
            <Audit
              items={[
                {
                  name: "Duolingo",
                  icon: "/velo/icon-duolingo.png",
                  took: "A quick first lesson before any setup, and clear progress.",
                  left: "The cartoon look. Velo needed to feel serious.",
                },
                {
                  name: "MasterClass",
                  icon: "/velo/icon-masterclass.png",
                  took: "A premium, dark, minimal feel.",
                  left: "Passive video with nothing to do.",
                },
                {
                  name: "Udemy",
                  icon: "/velo/icon-udemy.png",
                  took: "Lessons, resources, and Q&A always in view.",
                  left: "The clutter.",
                },
              ]}
            />

            <h3 className="pt-8 font-heading text-lg font-bold text-white">
              Who it&rsquo;s for
            </h3>
            <TradeOff
              options={[
                {
                  label: "Focused",
                  tag: "recommended by me",
                  title: "Small businesses and creators",
                  upsides: [
                    "A clear edge: it matches the instructor\u2019s background in product photography.",
                    "His existing product photos already cover the examples.",
                    "They likely own a camera already, or will buy one as a business investment.",
                  ],
                  risks: ["A smaller market."],
                },
                {
                  label: "Broad",
                  tag: "chosen",
                  title: "Any beginner",
                  upsides: ["A much bigger audience."],
                  risks: [
                    "Competes with everything free online.",
                    "Requires a camera, which many beginners don\u2019t own.",
                    "More new example shoots, since most of the instructor\u2019s photos are product and marketing shots.",
                  ],
                },
              ]}
            />
            <P>
              <H>The team decided to go broad</H> to reach more people, so I{" "}
              <H>designed the experience to work for any beginner</H>, whatever
              they shoot.
            </P>

            <h3 className="pt-8 font-heading text-lg font-bold text-white">
              What beginners told us
            </h3>
            <Insights
              items={[
                {
                  claim: "Practice makes it click.",
                  quotes: [
                    {
                      text: "Projects are the only way to make that make sense. You begin with the end in mind and then you have to struggle to get there.",
                      who: "Marketer",
                    },
                    {
                      text: "Me actually doing it is extremely important\u2026 it\u2019s one thing to watch something\u2026 but then when you\u2019re thrust into the situation\u2026",
                      who: "Musician",
                    },
                  ],
                },
                {
                  claim: "Long, rushed lessons lose them.",
                  quotes: [
                    {
                      text: "If I see it\u2019s like a 20 something minute video on YouTube, I\u2019m not touching it.",
                      who: "Hobbyist",
                    },
                    {
                      text: "I just really need the why to learn.",
                      who: "Musician",
                    },
                    {
                      text: "Giving like a 10 minute video and then maybe like a task to do or some kind of reading\u2026 something to kind of review.",
                      who: "Hobbyist",
                    },
                    {
                      text: "When there\u2019s kind of like an assumption or it\u2019s like going too fast\u2026 I don\u2019t really know if I\u2019m getting good information anymore.",
                      who: "Musician",
                    },
                  ],
                },
                {
                  claim: "Clutter distracts, hiding frustrates.",
                  quotes: [
                    {
                      text: "It looks like Windows XP. Am I working in an office?",
                      who: "Musician",
                    },
                    {
                      text: "It just kind of feels a bit cluttered and just really busy. I\u2019m a little bit distracted by all the other things going on.",
                      who: "Hobbyist",
                    },
                  ],
                },
                {
                  claim: "They look up the instructor first.",
                  quotes: [
                    {
                      text: "I\u2019d google whoever is teaching the course before I paid for it.",
                      who: "Phone-only shooter",
                    },
                    {
                      text: "Many don\u2019t trust that course creators are even qualified.",
                      who: "r/photography",
                      reddit: true,
                      quote: false,
                    },
                  ],
                },
              ]}
            />
          </Section>

          <Section
            id="brand"
            eyebrow="Brand"
            title="A brand built on photography"
          >
            {/* The brand text beside a clickable pile of the interview notes behind it (like the
                interview piles). On phones the pile sits under the text. */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
              <div className="space-y-4 sm:flex-1">
                <P>
                  The research set the direction:{" "}
                  <H>dark, serious, and minimal</H>, with none of the childish
                  look or clutter learners disliked.
                </P>
                <P>
                  I explored several names and marks and landed on Velo Academy.{" "}
                  <H>Velo means veil</H> in Spanish and Italian, a nod to the
                  diffusion photographers use to soften light, and it hints at{" "}
                  <H>velocity</H>, for quick learning.
                </P>
              </div>
              <div className="w-[200px] max-w-full shrink-0 sm:pt-1">
                <NoteStack
                  notes={[
                    {
                      text: "It\u2019s condescending. It treats you like a child.",
                      who: "Marketer",
                      about: "On Duolingo\u2019s gamification",
                    },
                    {
                      text: "Super dark\u2026 less eye strain.",
                      who: "Hobbyist",
                      about: "On light or dark mode",
                    },
                  ]}
                  font={noteHand.className}
                />
              </div>
            </div>
            <LogoExplorations />
          </Section>

          <Section
            id="system"
            eyebrow="Design system"
            title="A system the developer could build from"
          >
            <P>
              I built the style guide with <H>Automatic.css</H>, which plugs
              straight into Bricks, the builder our developer used. The colors,
              type and spacing carried into the build as-is, and every screen
              was assembled from the <H>same components</H>.
            </P>
            <div className="pt-4">
              <DesignFoundations headingFont={veloUi.className} />
            </div>
            <div className="pt-6">
              <ZoomImage
                src="/velo/components-states-3.webp"
                frameless
                width={1880}
                height={880}
                alt="Components from the Velo library with their states: the resume lesson card (default and hover), lesson items in the sidebar (not started, in progress, completed, needs review, current), the simulator's tripod and hand toggle, and the sidebar header"
                caption="Components from the library, each with its states. The resume card shows the version before the beta changes."
                sizes="(min-width: 900px) 846px, 100vw"
              />
            </div>
          </Section>

          <Section id="mapping" eyebrow="Structure" title="Mapping the product">
            <P>
              Before designing screens, I <H>mapped the full product</H> with
              the PM. Interviewees tuned out of long videos and learned best by
              doing, so <H>every chapter is short and hands-on</H>. Lessons
              started as a single list of steps, and we added chapters once they
              grew too long to scan.
              {/* On phones the sidebar's notes are hidden, so the text says it instead. */}
              <span className="sm:hidden">
                {" "}
                Learn (video, interactive reading), practice (field test),
                review (knowledge check). Premium adds an assignment with
                personal feedback from the instructor.
              </span>
            </P>
            <figure className="pt-8">
              <CourseSidebar
                font={veloUi.className}
                hand={handwriting.className}
              />
              <figcaption className="mx-auto mt-3 max-w-[300px] text-center text-sm text-white/50">
                The course sidebar as I designed it. The shipped version moved
                knowledge checks to the end of each lesson.
              </figcaption>
            </figure>
          </Section>

          <Section id="decisions" title="Key decisions">
            <P>
              Each decision answers one of the two goals from the challenge.
            </P>

            <Goal n={1} title="Keep beginners engaged" />
            <Decision
              n={1}
              title="A camera settings simulator"
              wide
              media={<SimulatorDemo />}
            >
              <P>
                Interviewees learned by doing, but existing simulators are{" "}
                <H>outdated</H>. Ours is built into the exercises, so students
                practice exposure before they ever pick up a camera.
              </P>
              <VersionViewer
                hand={handwriting.className}
                noun="simulator"
                aspect="1087 / 605"
                versions={[
                  {
                    label: "Existing simulator 1",
                    src: "/velo/other-simulator-1.webp",
                    width: 1087,
                    height: 605,
                    alt: "An existing exposure simulator with a cartoon city street",
                    notes: [
                      {
                        x: 61,
                        side: "above",
                        text: "cartoon scenes, hard to read",
                      },
                    ],
                  },
                  {
                    label: "Existing simulator 2",
                    src: "/velo/other-simulator-2.webp",
                    width: 817,
                    height: 605,
                    alt: "An existing exposure simulator with a light bulb photo and a camera mode dial",
                    notes: [
                      {
                        x: 68,
                        side: "below",
                        text: "dated, cluttered controls",
                      },
                    ],
                  },
                  {
                    label: "Existing simulator 3",
                    src: "/velo/other-simulator-3.webp",
                    width: 695,
                    height: 605,
                    alt: "An existing exposure simulator with ducks over a lake and an exposure triangle diagram",
                    notes: [
                      {
                        text: "simple, but only 3 lighting conditions",
                        inside: { x: 9, y: 55, width: 96 },
                      },
                    ],
                  },
                ]}
              />
            </Decision>
            <Decision
              n={2}
              title="A home page that doesn’t overwhelm"
              wide
              media={
                <div>
                  <FinalLabel />
                  <figure>
                    <Annotated
                      hand={handwriting.className}
                      notes={[
                        {
                          text: "chapters numbered 5.1, with their steps",
                          inside: { x: 75, y: 25, width: 150 },
                          from: { x: 66, y: 24 },
                          to: { x: 50, y: 23.5 },
                        },

                        {
                          text: "progress lives in the sidebar",
                          beside: { y: 52.5 },
                          to: { x: -0.3, y: 52.5 },
                        },
                      ]}
                    >
                      <DemoVideo
                        src="/velo/home-page-launched.mp4"
                        poster="/velo/home-page-launched-poster.jpg"
                        aspect="1600 / 954"
                        label="The launched home page: the current chapter, numbered 5.1, with its steps, and the course sidebar opening and closing"
                      />
                    </Annotated>
                  </figure>
                  <p className="mt-12 text-lg leading-8 text-white/70">
                    With more time, I&rsquo;d show the minutes left in a chapter
                    instead of its total length, and bring back a next-chapter
                    card.
                  </p>
                </div>
              }
            >
              <P>
                Interviewees found cluttered platforms distracting, but hated
                hunting for things. I started with an AI draft in{" "}
                <H>Figma Make</H>, built from my design system, then iterated on
                it and turned it into components.
              </P>
              <VersionViewer
                hand={handwriting.className}
                aspect="1350 / 830"
                versions={[
                  {
                    label: "Version 1",
                    src: "/velo/home-iter-1.webp",
                    width: 1350,
                    height: 830,
                    alt: "Home page version 1: an AI draft with a general menu and a large continue-watching card",
                    notes: [
                      {
                        x: 58,
                        side: "above",
                        text: "AI first draft, from my design system",
                      },
                      {
                        text: "no course structure yet",
                        inside: { x: 9.5, y: 60, width: 100 },
                        from: { x: 9.5, y: 52 },
                        to: { x: 9.5, y: 42 },
                      },
                    ],
                  },
                  {
                    label: "Version 2",
                    src: "/velo/home-iter-2.webp",
                    width: 1347,
                    height: 824,
                    alt: "Home page version 2: the course outline in the sidebar beside a continue-learning card",
                    notes: [
                      {
                        x: 6,
                        side: "above",
                        align: "start",
                        text: "the course outline moves into the sidebar",
                      },
                    ],
                  },
                  {
                    label: "Version 3",
                    src: "/velo/home-iter-3.webp",
                    width: 1349,
                    height: 829,
                    alt: "Home page version 3: progress for each step and a lesson progress bar on the same card",
                    notes: [
                      {
                        text: "progress for each step and the lesson: too much",
                        inside: { x: 84, y: 66, width: 140 },
                        from: { x: 84, y: 58 },
                        to: { x: 84, y: 48.5 },
                      },
                      {
                        x: 22.8,
                        side: "below",
                        text: "the sidebar collapses",
                        to: { x: 22.8, y: 55 },
                      },
                    ],
                  },
                  {
                    label: "Version 4",
                    src: "/velo/home-iter-4.webp",
                    width: 1432,
                    height: 1032,
                    alt: "Home page version 4: one lesson progress bar, a chapter tag, and chapters in the sidebar",
                    notes: [
                      {
                        text: "one lesson progress bar",
                        inside: { x: 83, y: 48 },
                        from: { x: 83, y: 44 },
                        to: { x: 83, y: 35.5 },
                      },
                      {
                        text: "a chapter tag",
                        inside: { x: 68, y: 23.5, align: "start" },
                        from: { x: 67.3, y: 23.5 },
                        to: { x: 63.8, y: 23.5 },
                      },
                      {
                        text: "chapters inside lessons",
                        inside: { x: 28, y: 76, align: "start" },
                        from: { x: 27.5, y: 74 },
                        to: { x: 21.5, y: 66 },
                      },
                    ],
                  },
                ]}
              />
              <P>
                The beta showed it was still too complex. Testers checked
                progress in the sidebar and mostly cared{" "}
                <H>which chapter they were on</H>.
              </P>
            </Decision>

            <Goal n={2} title="Earn trust without a famous name" />
            <Decision
              n={3}
              title="A free trial with no card"
              media={
                <ZoomImage
                  {...img.trial}
                  alt="The free trial home page: lesson 1 ready to start, later lessons locked with an upgrade prompt"
                />
              }
            >
              <P>
                The <H>first lesson is free, with no card required</H>, so
                trying costs nothing and the teaching can sell itself. The other
                lessons <H>stay visible but locked</H>, so learners see
                what&rsquo;s ahead without hitting a wall.
              </P>
            </Decision>
            <Decision
              n={4}
              title="Credibility up front"
              media={
                <ZoomImage
                  {...img.instructor}
                  alt="The landing page's Some of Tom's Work section, led by a John Mayer shoot"
                />
              }
            >
              <P>
                Learners look up the instructor before they buy, so the landing
                page <H>leads with his work</H> for artists like John Mayer and
                brands like Guitar Center.
              </P>
            </Decision>
          </Section>

          <Section
            id="beta"
            eyebrow="Moderated beta"
            title="Finding the next opportunity"
          >
            <P>The beta confirmed the platform worked:</P>
            {/* The results as big counts (5 is the usual size for moderated testing). */}
            <ul className="grid gap-6 py-4 sm:grid-cols-3">
              {[
                {
                  value: "5/5",
                  label:
                    "moderated beta testers finished the first lesson with no friction",
                },
                {
                  value: "5/5",
                  label:
                    "moderated beta testers loved the course’s interactive parts",
                },
                {
                  value: "4/5",
                  label:
                    "moderated beta testers said they’d pay for a more interactive version",
                },
              ].map((item) => (
                <li key={item.label}>
                  <p className="font-heading text-4xl font-bold">
                    {item.value}
                  </p>
                  <p className="mt-2 text-base text-white/70">{item.label}</p>
                </li>
              ))}
            </ul>
            <P>
              It also showed where to go next: testers enjoyed it, but{" "}
              <H>none would pay for it as it was</H>, only for a more
              interactive version. (The one holdout didn&rsquo;t own a camera,
              but said she&rsquo;d pay for a similar course built for phone
              photography.)
            </P>
            <NoteRow
              notes={[
                {
                  text: "I think the value of these is so high, I just feel like they could use a little more pushing.",
                  who: "Beta tester",
                  about: "On the interactive examples",
                },
                {
                  text: "This is really great information, but\u2026 it\u2019s just a lot of scrolling and a lot of reading.",
                  who: "Beta tester",
                  about: "On the lesson readings",
                },
                {
                  text: "\u2026I would like to see a lot more interactive examples like the simulator.",
                  who: "Beta tester",
                  about: "On paying for the course",
                },
              ]}
            />
            <P>
              The direction was clear:{" "}
              <H>make every lesson interactive and simple.</H>
            </P>
          </Section>

          <Section
            id="redesign"
            eyebrow="Lesson redesign"
            title="Making lessons interactive and simple"
          >
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-white/50" />
              Partially shipped
            </p>
            <P>
              The beta&rsquo;s biggest problems were in the lessons:{" "}
              <H>content types blurred together</H>, readings were text-heavy,
              and the interactive parts were easy to miss. The team shipped some
              of my fixes. The rest, like color-coded callouts, I built into a{" "}
              <H>redesign of the first lesson</H>.
            </P>
            {/* The original lesson and the redesign side by side, with an arrow between them.
                On phones they stack, and the arrow points down. */}
            <div className="grid items-center gap-4 pt-2 pb-6 sm:grid-cols-[1fr_auto_1fr]">
              <figure>
                <Annotated
                  steady
                  tall
                  hand={handwriting.className}
                  notes={[
                    {
                      text: "dense text, yellow everywhere",
                      inside: { x: 64, y: 50 },
                      from: { x: 60, y: 47.5 },
                      to: { x: 57, y: 43 },
                    },
                  ]}
                >
                  <ZoomImage
                    src="/velo/lesson-original.webp"
                    width={1442}
                    height={900}
                    alt="The original reading page: a large paragraph with several phrases in bright yellow, and a line explaining the tabs"
                  />
                </Annotated>
                <figcaption className="mt-3 text-center text-sm text-white/50">
                  Original lesson
                </figcaption>
              </figure>
              <svg
                aria-hidden
                viewBox="0 0 40 20"
                className="mx-auto h-5 w-10 rotate-90 text-white/60 sm:rotate-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 11 C 12 6, 24 6, 36 10" />
                <path d="M30 5 L36.5 10.2 L30.5 15" />
              </svg>
              <figure>
                <Annotated
                  steady
                  tall
                  hand={handwriting.className}
                  notes={[
                    {
                      text: "softer highlights",
                      inside: { x: 70.5, y: 36.5, align: "start" },
                      from: { x: 70, y: 36.5 },
                      to: { x: 65.5, y: 36.5 },
                    },
                    {
                      text: "a title for every idea",
                      inside: { x: 56, y: 64, align: "start" },
                      from: { x: 55, y: 64 },
                      to: { x: 47.5, y: 64 },
                    },
                    {
                      x: 66,
                      side: "below",
                      text: "color-coded callouts: key terms, tips, mistakes, and what to do",
                      width: 230,
                    },
                  ]}
                >
                  <ZoomImage
                    src="/velo/lesson-redesign-3.webp"
                    width={1442}
                    height={900}
                    alt="The redesigned reading page: a page title, calmer text, a section titled ISO = Noise, and a green Interactive callout above the example tabs"
                  />
                </Annotated>
                <figcaption className="mt-3 text-center text-sm text-white/50">
                  Redesign
                </figcaption>
              </figure>
            </div>
            <P>
              In testing, it <H>performed much better than the original</H>.
              Beta testers had said they&rsquo;d only pay for a more interactive
              course. After the instructor added more interactive content and
              cut down on text, <H>13% of trial users upgraded</H> in the first
              two weeks after launch. The color-coded callouts are planned for
              the next version.
            </P>
          </Section>

          {/* The marketing video, as the payoff at the end of the story. The "Watch product video"
              button at the top jumps here and plays it with sound. */}
          <Section id="product" title="The final product">
            <Frame caption="Final product video (edited by me)">
              <ProductVideo
                src="/velo/welcome.mp4"
                poster="/velo/welcome-poster.jpg"
                captions="/velo/welcome.vtt"
                label="Velo Academy marketing video showing the final product"
              />
            </Frame>
          </Section>

          <Section id="learned" title="What I learned">
            <P>
              <strong>For a course, the content is the product.</strong> Most
              lessons were text-heavy with no clear hierarchy, so many testers
              watched the videos, skipped the readings, and only did the
              interactive parts. Next time I&rsquo;d spend less time perfecting
              the structure and more reviewing lessons with the instructor.
            </P>
            <P>
              <strong>Test with users earlier.</strong> The beta aligned the
              team faster than any internal discussion. Next time I&rsquo;d put
              a single prototype lesson in front of users first.
            </P>
            <P>
              <strong>Back recommendations with evidence.</strong> I pushed for
              a focused audience, but the team went broad, and the beta showed
              the cost: the one tester who wouldn&rsquo;t pay didn&rsquo;t own a
              camera. Next time I&rsquo;d make the case with research, like a
              quick survey or a landing-page test of both audiences.
            </P>
          </Section>
        </article>

        <ContactSection />
      </main>

      <HomeFooter />
    </div>
  );
}
