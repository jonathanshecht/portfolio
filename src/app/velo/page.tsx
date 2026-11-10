import type { Metadata } from "next";
import { Caveat, Mynerve } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";
import { ContactSection, HomeFooter } from "@/components/home/contact-section";
import { HandDivider } from "@/components/hand-divider";
import { PillNav } from "@/components/home/pill-nav";
import { ProductVideo } from "@/components/velo/product-video";
import { NoteStack, type Note } from "@/components/velo/note-stack";
import { WatchVideoButton } from "@/components/velo/watch-video-button";
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
  logos: { src: "/velo/logo-explorations-4.png", width: 1700, height: 440 },
} satisfies Record<string, Img>;
const SIMULATOR_VIDEO = "https://player.vimeo.com/video/1220329766";

// The handwriting used for little notes on the site (as on the About page).
const handwriting = Mynerve({ subsets: ["latin"], weight: "400" });
// A neater hand for the research notes, where there are full sentences to read.
const noteHand = Caveat({ subsets: ["latin"], weight: "500" });

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
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-10">
      <h3 className="flex items-baseline gap-3 text-2xl font-bold">
        <span className={`font-heading text-base ${ACCENT}`}>
          {String(n).padStart(2, "0")}
        </span>
        {title}
      </h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
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

function Video({ src, title }: { src: string; title: string }) {
  return (
    <Frame>
      <div className="aspect-video">
        <iframe
          src={src}
          title={title}
          className="size-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Frame>
  );
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

function Quote({ children, by }: { children: ReactNode; by?: string }) {
  return (
    <blockquote className="rounded-2xl border border-white/10 bg-[#141417] p-6">
      <p className="text-lg leading-8 text-white">{children}</p>
      {by && <footer className="mt-3 text-sm text-white/50">{by}</footer>}
    </blockquote>
  );
}

function TodoText({ children }: { children: ReactNode }) {
  return <span className={`${ACCENT} italic`}>{children}</span>;
}

// ---- Page ----

// Results from the moderated beta, shown in the Beta section. (That every tester preferred the
// redesigned lesson is said in the Redesign section.)
const betaResults = [
  {
    value: "5/5",
    label: "moderated beta testers loved the course’s interactive parts",
  },
  {
    value: "4/5",
    label: "moderated beta testers finished the first lesson with no friction",
  },
];

// The headline results, shown under the outcome near the top.
// Same tags as the home page card.
const tags = releases.find((r) => r.slug === "velo")?.tags ?? [];

const meta: [string, ReactNode][] = [
  ["Role", "Lead Designer"],
  ["Team", "Instructor/founder, PM, developer"],
  ["Timeline", "March 2026 – June 2026"],
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
              In open beta
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
              <div key={label}>
                <dt className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                  {label}
                </dt>
                <dd className="mt-2 text-base">{value}</dd>
              </div>
            ))}
          </dl>
          <HandDivider flip />

          <Section
            id="challenge"
            eyebrow="The challenge"
            title="Getting beginners to stay, and to pay"
          >
            <P>
              <H>Beginners give up on photography courses.</H> And a paid course
              has to <H>compete with free YouTube tutorials</H> and well-known
              instructors. That left Velo with two problems to solve:
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
            id="brand"
            eyebrow="Brand"
            title="A brand built on photography"
          >
            <P>
              Before any screens, I explored several names and marks and landed
              on Velo Academy. <H>Velo means veil</H> in Spanish and Italian, a
              nod to the diffusion photographers use to soften light, and it
              hints at <H>velocity</H>, for quick learning.
            </P>
            <LogoExplorations />
          </Section>

          <Section
            id="research"
            eyebrow="Research"
            title="Beginners want to do, not watch"
          >
            <P>
              I <H>audited Duolingo, MasterClass, and Udemy</H>, read through
              Reddit&rsquo;s photography communities, then{" "}
              <H>interviewed four very different beginners</H>.
            </P>
            <Insights
              items={[
                {
                  claim: "Learning happens by doing",
                  quotes: [
                    {
                      text: "Projects are the only way to make that make sense. You begin with the end in mind and then you have to struggle to get there.",
                      who: "Photographer",
                    },
                    {
                      text: "Teach 2-3 chords and have them start playing immediately, the rest will come.",
                      who: "r/photography",
                      reddit: true,
                    },
                    {
                      text: "Me actually doing it is extremely important\u2026 it\u2019s one thing to watch something\u2026 but then when you\u2019re thrust into the situation\u2026",
                      who: "Musician",
                    },
                  ],
                },
                {
                  claim: "Short, structured, and explained",
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
                  claim: "Clean, but nothing hidden",
                  quotes: [
                    {
                      text: "It looks like Windows XP. Am I working in an office?",
                      who: "Musician",
                    },
                    {
                      text: "(Udemy is) prioritizing sleekness over core functionality.",
                      who: "r/Udemy",
                      reddit: true,
                    },
                    {
                      text: "It just kind of feels a bit cluttered and just really busy. I\u2019m a little bit distracted by all the other things going on.",
                      who: "Hobbyist",
                    },
                  ],
                },
                {
                  claim: "Trust comes from the teacher",
                  quotes: [
                    {
                      text: "I\u2019d google whoever is teaching the course before I paid for it.",
                      who: "Phone-only shooter",
                    },
                    {
                      text: "Top advice for choosing a course: find a working photographer.",
                      who: "r/photography",
                      reddit: true,
                      quote: false,
                    },
                  ],
                },
              ]}
            />
          </Section>

          <Section id="audience" title="Choosing the audience">
            <P>
              A broad beginner course competes with everything free online. As
              one interviewee put it: &ldquo;There&rsquo;s so much free stuff on
              YouTube.&rdquo;
            </P>
            <P>
              <H>I recommended a sharper focus:</H> small business owners and
              creators who need professional-looking product photos. It matched
              the instructor&rsquo;s background as a product and marketing
              photographer, which would give him a clear edge over better-known
              names.
            </P>
            <P>
              <H>We went with a broad beginner audience</H> to reach more
              people, and I designed the experience to work for any beginner,
              whatever they shoot.
            </P>
          </Section>

          <Section id="decisions" title="Key decisions">
            <P>
              After a brainstorm with the team, I{" "}
              <H>turned the research into a feature map</H>, then worked with
              the PM to map the full product: lessons, knowledge checks,
              assignments, and the free-to-paid path.
            </P>
            <Needed what="Feature board with my notes" />
            <Picture
              image={img.flow}
              alt="Product flowchart covering lessons, knowledge checks, assignments and the free-to-paid path"
              caption="Product flowchart"
            />

            <Decision n={1} title="A camera simulator instead of another video">
              <P>
                The exposure triangle (aperture, shutter speed, ISO) is where
                most beginners give up. Rather than explain it,{" "}
                <H>
                  I designed a simulator where you change each setting and see
                  the photo respond
                </H>
                , across lighting conditions like sun, clouds, and indoor. I
                studied existing exposure tools, then stripped the controls down
                to <H>three clear panels</H>. The developer built the image
                logic.
              </P>
              <Needed what="Early simulator version → final" />
              <Video
                src={SIMULATOR_VIDEO}
                title="The Velo camera simulator in action"
              />
            </Decision>

            <Decision
              n={2}
              title="Navigation that’s always there, but out of the way"
            >
              <P>
                Research pulled in two directions: show everything, but
                don&rsquo;t clutter. I designed a <H>collapsible sidebar</H>{" "}
                that keeps the course outline and progress <H>one click away</H>
                , and folds away when you want to focus on the lesson. The
                lesson structure went through several rounds, from lessons with
                steps (reading, quiz, assignment) to an added chapter layer, and
                my job was keeping that hierarchy easy to scan.
              </P>
              <Picture
                image={img.sidebar}
                alt="The course sidebar collapsing and expanding beside a lesson"
                caption="Collapsible sidebar"
              />
            </Decision>

            <Decision n={3} title="Knowledge checks, not tests">
              <P>
                Interviewees wanted quizzes that &ldquo;keep you honest&rdquo;
                without grade pressure, and one suggested calling them knowledge
                checks. They <H>give feedback without revealing the answer</H>,
                aren&rsquo;t timed, and bring missed vocabulary back later.
                Gamification felt condescending to some interviewees, so
                motivation features like streaks stay <H>light and optional</H>.
              </P>
              <Picture
                image={img.quiz}
                alt="A knowledge check question with feedback on the chosen answer"
                caption="Knowledge check"
              />
            </Decision>

            <Decision n={4} title="Earning trust by letting people try first">
              <P>
                Without a famous name to lean on, we let the product prove
                itself.{" "}
                <H>
                  The simulator is free with no account needed, and the first
                  lesson is free
                </H>
                , so learners experience the teaching before they pay. An
                instructor section on the landing page highlights his
                professional background.
              </P>
              <Needed what="Landing page with the free simulator" />
              <Needed what="Instructor section" ratio="aspect-[2/1]" />
            </Decision>

            <Decision
              n={5}
              title="A design system the developer could build from"
            >
              <P>
                The team built on Bricks Builder, so I created the{" "}
                <H>component library and tokens in Figma</H> to match ACSS, and{" "}
                <H>worked directly with the developer</H> to make sure the build
                matched the design. That kept the platform consistent while
                content and scope kept changing.
              </P>
            </Decision>
          </Section>

          <Section id="beta" title="Beta: finding the next opportunity">
            <P>The beta confirmed the platform worked:</P>
            {/* The test results, as counts (5 is the usual size for moderated testing). */}
            <ul className="grid gap-6 py-4 sm:grid-cols-2">
              {betaResults.map((item) => (
                <li key={item.label}>
                  <p className="font-heading text-4xl font-bold">
                    {item.value}
                  </p>
                  <p className="mt-2 text-base text-white/70">{item.label}</p>
                </li>
              ))}
            </ul>
            <P>
              It also showed where to go next. Testers enjoyed the course, but{" "}
              <H>none said they&rsquo;d pay for it as it was</H>, while{" "}
              <H>4 of 5 said they&rsquo;d pay for a more interactive version</H>
              . They wanted the rest of the course to feel like those
              interactive moments:
            </P>
            <Bullets
              items={[
                "Too text-heavy, with long videos",
                "Not enough visual examples",
                "Assignment pages felt flat compared to the interactive moments",
              ]}
            />
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <Quote by="Beta tester">
                <TodoText>[Quote on ease of use]</TodoText>
              </Quote>
              <Quote by="Beta tester">
                <TodoText>[Quote on the content]</TodoText>
              </Quote>
            </div>
            <P>
              The direction was clear:{" "}
              <H>make every lesson interactive and simple.</H>
            </P>
          </Section>

          <Section id="redesign" title="Redesigning the lesson">
            <P>
              I redesigned the first lesson around interactivity and simplicity:
              visual, hands-on, one idea at a time.{" "}
              <H>Every beta tester preferred it to the original.</H>
            </P>
            <Bullets
              items={[
                <>
                  <strong>One idea per screen.</strong> The lesson builds step
                  by step: three controls → the exposure triangle → how each one
                  brightens the image → each one&rsquo;s unique effect.
                </>,
                <>
                  <strong>Show, then explain.</strong> Each concept is a visual
                  first, with a short line of text beside it.
                </>,
                <>
                  <strong>Practice inside the lesson.</strong> The simulator is
                  built into the lesson, so learners try the concept right after
                  reading about it.
                </>,
                <>
                  <strong>A clear rhythm.</strong> A Reading → Field Test →
                  Knowledge Check stepper turns the short lesson, task, review
                  structure from research into the UI.
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
              My work on Velo ended at the first beta, just as I was about to
              bring every lesson up to the new format, page by page. I
              documented the new lesson format and the beta fixes and handed
              them off to development for the next iteration. Velo is now in
              open beta, so this story isn&rsquo;t finished yet.
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
          </Section>
        </article>

        <ContactSection />
      </main>

      <HomeFooter />
    </div>
  );
}
