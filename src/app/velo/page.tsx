import type { Metadata } from "next";
import { Check, Focus, Minus, Plus, Users, X } from "lucide-react";
import { Caveat, Mynerve, Outfit } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";
import { ContactSection, HomeFooter } from "@/components/home/contact-section";
import { HandDivider } from "@/components/hand-divider";
import { PillNav } from "@/components/home/pill-nav";
import { ProductVideo } from "@/components/velo/product-video";
import { NoteStack, type Note } from "@/components/velo/note-stack";
import { CourseSidebar } from "@/components/velo/course-sidebar";
import { DemoVideo } from "@/components/velo/demo-video";
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
  flow: {
    src: cdn("6a88cf5c50c9f0fdf157f944_UF.png"),
    width: 846,
    height: 402,
  },
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
  lessonBefore: {
    src: cdn("6a88de69d6836c4d7b11bc6c_VP.png"),
    width: 846,
    height: 546,
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
  children: ReactNode;
  media?: ReactNode;
  // A wide visual (like the simulator demo) goes full width under the text instead of beside it.
  wide?: boolean;
}) {
  return (
    <div
      className={`gap-10 pt-8 ${wide ? "" : "sm:grid sm:grid-cols-2 sm:items-start"}`}
    >
      <div>
        <h4 className="flex items-baseline gap-3 text-xl font-bold">
          <span className={`font-heading tabular-nums ${ACCENT}`}>
            {String(n).padStart(2, "0")}
          </span>
          {title}
        </h4>
        <div className="mt-3 space-y-4">{children}</div>
      </div>
      {media && <div className={wide ? "mt-6" : "mt-6 sm:mt-1"}>{media}</div>}
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
  items: {
    name: string;
    image: { src: string; width: number; height: number };
    alt: string;
    icon: string;
    took: string;
    left: string;
  }[];
}) {
  return (
    <ul className="grid gap-10 pt-6 pb-8 sm:grid-cols-3 sm:gap-6 sm:pb-10">
      {items.map((item) => (
        <li key={item.name}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-white/20 bg-[#0b0b0d]">
            <Image
              src={item.image.src}
              alt={item.alt}
              fill
              sizes="(min-width: 640px) 270px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 flex items-center gap-2 font-heading text-base font-bold text-white">
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

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-4 text-lg leading-8 text-white/70 [&_strong]:font-semibold [&_strong]:text-white"
        >
          <span
            aria-hidden
            className="mt-[13px] size-1.5 shrink-0 rounded-full bg-(--accent)"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
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

// An image in a frame, or "bare" (no frame) for one made on the page's own background, like the
// logo explorations, so it sits directly on the page.
function Picture({
  image,
  alt,
  caption,
  bare = false,
}: {
  image: Img;
  alt: string;
  caption?: string;
  bare?: boolean;
}) {
  const picture = (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes="(min-width: 880px) 846px, 100vw"
      // A bare image is served as is, so its background stays exactly the page's color.
      unoptimized={bare || image.src.endsWith(".gif")}
      className="w-full"
    />
  );
  if (bare)
    return (
      <figure className="pt-12">
        {picture}
        {caption && (
          <figcaption className="mt-6 text-center text-sm text-white/50">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  return <Frame caption={caption}>{picture}</Frame>;
}

// An empty slot for a visual that's still needed.
function Needed({
  what,
  ratio = "aspect-[16/9]",
}: {
  what: string;
  ratio?: string;
}) {
  return (
    <figure className="pt-4">
      <div
        className={`flex ${ratio} flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/25 bg-white/[0.02] p-6 text-center`}
      >
        <span
          className={`text-xs font-semibold tracking-[0.2em] uppercase ${ACCENT}`}
        >
          Visual needed
        </span>
        <span className="text-white/60">{what}</span>
      </div>
    </figure>
  );
}

// ---- Page ----

// The "Redesigning the lesson" section is hidden for now.
const SHOW_REDESIGN = false;

// Same tags as the home page card.
const tags = releases.find((r) => r.slug === "velo")?.tags ?? [];

const meta: [string, ReactNode][] = [
  ["Role", "Lead Designer"],
  [
    "Team",
    // Breaks after "founder/" so "course content provider" stays together.
    <>
      Instructor/founder/
      <wbr />
      <span className="sm:whitespace-nowrap">course content provider</span>, PM,
      developer
    </>,
  ],
  ["Timeline", "March 2026 – September 2026"],
  ["Scope", "Brand, research, UX/UI, design system"],
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
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 py-8 sm:grid-cols-4">
            {meta.map(([label, value]) => (
              <div
                key={label}
                className={
                  label === "Team"
                    ? "order-last col-span-2 sm:order-none sm:col-span-1"
                    : label === "Scope"
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

          {/* The key results as big numbers for anyone skimming, labeled like Role / Team:  the
              launch results; the beta's results are in the Beta section. */}
          <div className="mt-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                Initial launch results &middot; first two weeks
              </p>
              <ul className="mt-3 grid gap-6 sm:grid-cols-3">
                {[
                  {
                    value: "45",
                    label: "trial users",
                  },
                  { value: "13.3%", label: "free-to-paid conversion" },
                ].map((item) => (
                  <li key={item.label}>
                    <p className="font-heading text-4xl font-bold">
                      {item.value}
                    </p>
                    <p className="mt-2 text-base text-white/70">{item.label}</p>
                  </li>
                ))}
              </ul>
            </div>
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
                  text: "Learners check out the instructor before they buy.",
                },
              ]}
            />
          </Section>

          <Section
            id="audit"
            eyebrow="Desk research"
            title="Each platform got one thing right"
          >
            <P>
              I started by <H>auditing Duolingo, MasterClass, and Udemy</H> and
              reading through Reddit&rsquo;s photography communities.
            </P>
            <Audit
              items={[
                {
                  name: "Duolingo",
                  icon: "/velo/icon-duolingo.png",
                  image: {
                    src: "/velo/audit-duolingo-2.jpg",
                    width: 1200,
                    height: 750,
                  },
                  alt: "Two Duolingo screens: a first lesson and the course roadmap",
                  took: "A quick first lesson before any setup, and clear progress.",
                  left: "The cartoon look. Velo needed to feel serious.",
                },
                {
                  name: "MasterClass",
                  icon: "/velo/icon-masterclass.png",
                  image: {
                    src: "/velo/audit-masterclass-2.jpg",
                    width: 1200,
                    height: 750,
                  },
                  alt: "Jimmy Chin's MasterClass page, with a video and a list of locked lessons",
                  took: "A premium, dark, minimal feel.",
                  left: "Passive video with nothing to do.",
                },
                {
                  name: "Udemy",
                  icon: "/velo/icon-udemy.png",
                  image: {
                    src: "/velo/audit-udemy-2.jpg",
                    width: 1200,
                    height: 750,
                  },
                  alt: "A Udemy lesson with the video beside a long list of lessons and resources",
                  took: "Lessons, resources, and Q&A always in view.",
                  left: "The clutter.",
                },
              ]}
            />
            <P>Reddit filled in what the apps couldn&rsquo;t show:</P>
            <NoteRow
              notes={[
                {
                  text: "The internet already has everything a beginner course covers.",
                  who: "r/photography",
                  reddit: true,
                  quote: false,
                },
                {
                  text: "Many don\u2019t trust that course creators are even qualified.",
                  who: "r/photography",
                  reddit: true,
                  quote: false,
                },
                {
                  text: "Prioritizing sleekness over core functionality.",
                  about: "On Udemy\u2019s redesign",
                  who: "r/Udemy",
                  reddit: true,
                },
              ]}
            />
          </Section>

          <Section
            id="audience"
            eyebrow="Audience"
            title="Focused vs. broad audience"
          >
            <P>The audit and Reddit left two ways to position the course:</P>
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
          </Section>

          <Section
            id="research"
            eyebrow="User interviews"
            title="Beginners want to do, not watch"
          >
            <P>
              To learn what those beginners needed, I{" "}
              <H>interviewed four very different ones</H>. Four insights stood
              out:
            </P>
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

          <Section id="mapping" eyebrow="Structure" title="Mapping the product">
            {/* Big to small: the whole product first, then how a single lesson is built. */}
            <P>
              Before designing screens, I <H>mapped the full product</H> with
              the PM: how lessons, knowledge checks, assignments and the
              free-to-paid path connect.
            </P>
            <Picture
              image={img.flow}
              alt="Product flowchart covering lessons, chapters, knowledge checks, assignments and the free-to-paid path"
              caption="Product flow"
            />
            <div className="pt-12 sm:pt-16">
              <P>
                Interviewees tuned out of long videos and learned best by doing,
                so <H>every chapter is short and hands-on</H>. It took a few
                rounds: lessons started as a single list of steps, and we added
                chapters once lessons grew too long to scan.
                {/* On phones the sidebar's notes are hidden, so the text says it instead. */}
                <span className="sm:hidden">
                  {" "}
                  Learn (video, interactive reading), practice (field test),
                  review (knowledge check). Premium adds an assignment with
                  personal feedback from the instructor.
                </span>
              </P>
            </div>
            <figure className="pt-8">
              <CourseSidebar
                font={veloUi.className}
                hand={handwriting.className}
              />
              <figcaption className="mx-auto mt-3 max-w-[300px] text-sm text-white/50">
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
              media={
                <DemoVideo
                  src="/velo/exposure-demo-2.mp4"
                  poster="/velo/exposure-demo-2-poster.jpg"
                  label="The exposure simulator: changing aperture and shutter speed, with the photo responding"
                />
              }
            >
              <P>
                Interviewees learned by doing, and the exposure triangle is
                where most beginners give up. So I designed a{" "}
                <H>camera settings simulator</H>: learners adjust aperture,
                shutter speed and ISO and <H>watch the photo respond</H>, in
                conditions like sun, clouds or indoors. It&rsquo;s the
                course&rsquo;s main practice tool:{" "}
                <H>
                  many exercises use it before students ever pick up a camera
                </H>
                .
              </P>
            </Decision>
            <Decision
              n={2}
              title="A home page that doesn’t overwhelm"
              media={
                <ZoomImage
                  {...img.sidebar}
                  alt="The home page with the course sidebar collapsing and expanding"
                />
              }
            >
              <P>
                Interviewees found cluttered platforms distracting, but hated
                hunting for things. The home page shows only{" "}
                <H>where you left off and what&rsquo;s next</H>, and the course
                outline lives in a <H>sidebar you can hide</H> when you want to
                focus.
              </P>
            </Decision>

            <Goal n={2} title="Earn trust, so they pay" />
            <Decision
              n={3}
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
            <Decision
              n={4}
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

            <h3 className="mt-14 border-t border-white/15 pt-5 text-xl font-bold">
              Smaller decisions
            </h3>
            <Bullets
              items={[
                <>
                  <strong>Definitions on hover.</strong> Key terms show their
                  meaning when you hover them, so beginners never leave the
                  lesson.
                </>,
                <>
                  <strong>Knowledge checks that never block progress.</strong>{" "}
                  Learners see a grade, but a low score never locks the next
                  lesson. No streaks or points, just progress.
                </>,
                <>
                  <strong>
                    A design system the developer could build from.
                  </strong>{" "}
                  I built the component library and tokens in Figma to match the
                  developer&rsquo;s framework, and worked with him directly so
                  the build matched the design.
                </>,
              ]}
            />
          </Section>

          <Section id="beta" title="Beta: finding the next opportunity">
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

          {/* Hidden for now; flip SHOW_REDESIGN to bring it back. */}
          {SHOW_REDESIGN && (
            <>
              <Section id="redesign" title="Redesigning the lesson">
                <P>
                  The course material was the instructor&rsquo;s, but the beta
                  showed the platform alone couldn&rsquo;t fix it. So I went
                  beyond my scope and{" "}
                  <H>proposed a rewrite of the first lesson</H>, built around
                  interactivity and simplicity: visual, hands-on, one idea at a
                  time. <H>Every beta tester preferred it to the original.</H>
                </P>
                <Bullets
                  items={[
                    <>
                      <strong>One idea per screen.</strong> The lesson builds
                      step by step: three controls → the exposure triangle → how
                      each one brightens the image → each one&rsquo;s unique
                      effect.
                    </>,
                    <>
                      <strong>Show, then explain.</strong> Each concept is a
                      visual first, with a short line of text beside it.
                    </>,
                    <>
                      <strong>Practice inside the lesson.</strong> The simulator
                      is built into the lesson, so learners try the concept
                      right after reading about it.
                    </>,
                    <>
                      <strong>A clear rhythm.</strong> A Reading → Field Test →
                      Knowledge Check stepper turns the short lesson, task,
                      review structure from research into the UI.
                    </>,
                  ]}
                />
                <Picture
                  image={img.lessonBefore}
                  alt="The shipped lesson page, with a long video above the lesson text"
                  caption="Before: the shipped lesson page"
                />
                <Needed what="After: Lesson 1, pages 1–4" />
                <P>
                  I documented the new lesson format and the beta fixes and
                  handed them off to the team, and Velo launched shortly after.
                </P>
              </Section>
            </>
          )}

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
              <strong>For a course, the content is the product.</strong> A
              strong platform can only carry lessons so far. Next time I&rsquo;d
              design one finished lesson end to end before building out the
              rest, so structure and content shape each other from the start.
            </P>
            <P>
              <strong>Test with users earlier.</strong> The beta aligned the
              team faster than any internal discussion had. Next time I&rsquo;d
              ask to put real users in front of key decisions sooner, starting
              with a single prototype lesson.
            </P>
            <P>
              <strong>Commit to one end of the audience.</strong> In hindsight,
              Velo sits in the middle: broad enough to compete with everything
              free online, but it still requires a camera, which shut out the
              one beta tester who wouldn&rsquo;t pay. Next time I&rsquo;d push
              for one end: a focused course for people who already own a camera,
              like small businesses, or a truly broad one built for phones.
            </P>
          </Section>
        </article>

        <ContactSection />
      </main>

      <HomeFooter />
    </div>
  );
}
