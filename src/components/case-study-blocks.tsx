import type { Img } from "@/data/site";
import type { Block } from "@/lib/case-studies";
import { handwriting } from "@/lib/fonts";
import Image from "next/image";
import { HandNote } from "./hand-note";
import { PeekVersions } from "./peek-versions";
import { ScreenshotNotes } from "./screenshot-notes";
import { Annotated } from "./velo/annotations";
import { ProductVideo } from "./velo/product-video";
import { ZoomImage } from "./velo/zoom-image";
import { Rich } from "./rich";

// The building blocks of the case studies written as content files, styled like the Velo case
// study: dark page, small uppercase labels, Adventor headings, gray body text with the key words
// in white (marks and bold in the content), accent-colored dots, and images that open full size.

const label = "text-xs font-semibold tracking-[0.2em] text-white/50 uppercase";
const body =
  "text-lg leading-8 text-white/70 [&_strong]:font-semibold [&_strong]:text-white";

function Caption({ text }: { text: string }) {
  return (
    <figcaption className="mt-3 text-center text-sm text-white/50">
      {text}
    </figcaption>
  );
}

function Picture({
  image,
  caption,
  sizes,
}: {
  image: Img;
  caption?: string;
  sizes: string;
}) {
  return (
    <ZoomImage
      src={image.src}
      width={image.width}
      height={image.height}
      alt={caption ?? ""}
      sizes={sizes}
      light={image.light}
    />
  );
}

// Where each print sits on the board (percent of the board), how wide it is, and its tilt.
// Made for six photos in the order tall, wide, wide, square, wide, tall.
const PRINTS = [
  { x: 0, y: 3, w: 24, r: -5 },
  { x: 23, y: 0, w: 39, r: 3 },
  { x: 61, y: 5, w: 38, r: -3 },
  { x: 5, y: 55, w: 25, r: 4 },
  { x: 32, y: 45, w: 36, r: -2 },
  { x: 73, y: 44, w: 24, r: 5 },
];

function Print({
  image,
  sizes,
}: {
  image: Img & { alt: string };
  sizes: string;
}) {
  return (
    <div className="bg-[#f4f1ea] p-1 pb-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:p-1.5 sm:pb-5">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="block h-auto w-full"
      />
    </div>
  );
}

// The brief's reference photos, scattered like prints on a small board. On phones, a tilted 3-column grid.
function Moodboard({
  images,
  note,
}: {
  images: (Img & { alt: string })[];
  note?: string;
}) {
  return (
    <figure className="mx-auto mt-10 max-w-[560px]">
      <div className="relative hidden aspect-[846/600] sm:block">
        {images.slice(0, PRINTS.length).map((image, i) => {
          const p = PRINTS[i];
          return (
            <div
              key={image.src}
              className="absolute transition-transform duration-300 hover:z-10 hover:scale-[1.04]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.w}%`,
                rotate: `${p.r}deg`,
              }}
            >
              <Print image={image} sizes="(min-width: 640px) 220px, 30vw" />
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 items-center gap-3 sm:hidden">
        {images.map((image, i) => (
          <div key={image.src} style={{ rotate: `${i % 2 ? 3 : -3}deg` }}>
            <Print image={image} sizes="33vw" />
          </div>
        ))}
      </div>
      {note && (
        <figcaption
          className={`${handwriting.className} mt-4 -rotate-2 text-right text-base text-white/80 sm:-mt-2`}
        >
          {note}
        </figcaption>
      )}
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    // A divider between the big chunks of a study: the label centered between two lines.
    case "section":
      return (
        <div
          id={block.id}
          className="flex scroll-mt-32 items-center gap-6 pt-20 pb-4"
        >
          <span className="h-px flex-1 bg-white/15" />
          <h2 className={label}>{block.label}</h2>
          <span className="h-px flex-1 bg-white/15" />
        </div>
      );
    // A big part of a study (like Project 1), the top of the hierarchy: a line, a label and a
    // large title.
    case "part":
      return (
        <div
          id={block.id}
          className="mt-16 scroll-mt-32 border-t border-white/15 pt-20"
        >
          <p className={label}>{block.label}</p>
          <h2 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
            {block.title}
          </h2>
        </div>
      );
    case "eyebrow":
      return (
        <p id={block.id} className={`scroll-mt-32 pt-20 sm:pt-24 ${label}`}>
          {block.text}
        </p>
      );
    case "title":
      return (
        <Rich
          as="h3"
          html={block.html}
          className="mt-3 font-heading text-[28px] leading-tight font-bold text-white sm:text-[32px] sm:leading-10"
        />
      );
    case "heading":
      return (
        <Rich
          as="h4"
          html={block.html}
          className="pt-6 text-xl font-semibold text-white"
        />
      );
    case "label":
      return (
        <h4 className="pt-8 text-lg font-semibold text-white">{block.text}</h4>
      );
    case "p":
      // 24px between text blocks; text right after a visual gets 48px, like on Velo.
      return (
        <Rich
          as="p"
          html={block.html}
          className={`mt-6 [figure+&]:mt-12 ${body}`}
        />
      );
    // A small status tag.
    case "note":
      return (
        <p className="mt-12 inline-flex items-center gap-1.5 rounded-lg border border-white/12 p-2 text-sm leading-none text-white/85">
          <span aria-hidden className="size-1.5 rounded-full bg-(--accent)" />
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul
          className={`mt-4 list-disc space-y-2 pl-5 marker:text-white/40 ${body}`}
        >
          {block.items.map((item) => (
            <Rich as="li" key={item} html={item} />
          ))}
        </ul>
      );
    case "bullets":
      return (
        <ul className="mt-5 grid gap-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base leading-7 text-white/70 [&_strong]:font-semibold [&_strong]:text-white"
            >
              <span
                aria-hidden
                className="mt-2.5 size-2 shrink-0 rounded-full bg-(--accent)"
              />
              <Rich html={item} />
            </li>
          ))}
        </ul>
      );
    case "chips":
      return (
        <ul className="mt-4 flex flex-wrap gap-2 text-sm text-white/85">
          {block.items.map((item) => (
            <li key={item} className="rounded-lg bg-white/12 p-2 leading-none">
              {item}
            </li>
          ))}
        </ul>
      );
    case "pairs":
      return (
        <div className="mt-6 grid gap-3">
          <div
            className={`hidden grid-cols-[1fr_auto_1fr] gap-4 sm:grid ${label}`}
          >
            <span>Pain point</span>
            <span className="w-5" />
            <span>Solution</span>
          </div>
          {block.items.map(({ problem, solution }) => (
            <div
              key={problem}
              className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4"
            >
              <p className="rounded-lg border border-white/15 px-5 py-4 text-base leading-7 text-white/70">
                {problem}
              </p>
              <span className="text-center text-white/40" aria-hidden>
                <span className="hidden sm:inline">→</span>
                <span className="sm:hidden">↓</span>
              </span>
              <p className="rounded-lg border border-white/15 bg-white/[0.06] px-5 py-4 text-base leading-7 text-white">
                {solution}
              </p>
            </div>
          ))}
        </div>
      );
    // Big numbers, each on its own card.
    case "stats":
      return (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {block.items.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-7 text-center"
            >
              <dt className="font-heading text-4xl font-bold text-white">
                {stat.value}
              </dt>
              <dd className="mt-2 text-sm leading-6 text-white/60">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "figure": {
      const picture = (
        <Picture
          image={block.image}
          caption={block.caption}
          sizes="(min-width: 900px) 846px, 100vw"
        />
      );
      // A full-page screenshot scrolls inside its frame, so a note points out that it does.
      const tall = block.image.height > block.image.width * 1.4;
      return (
        <figure className="mt-8">
          {tall ? (
            <Annotated
              hand={handwriting.className}
              phoneList={false}
              notes={[
                {
                  x: 88,
                  side: "above",
                  align: "end",
                  text: "scroll to see the whole page",
                },
              ]}
            >
              {picture}
            </Annotated>
          ) : (
            picture
          )}
          {block.caption && <Caption text={block.caption} />}
        </figure>
      );
    }
    case "gallery": {
      const grid = (
        <div
          className={`grid items-start gap-4 ${block.images.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
        >
          {block.images.map((image) => (
            <Picture
              key={image.src}
              image={image}
              caption={block.caption}
              sizes="(min-width: 640px) 420px, 100vw"
            />
          ))}
        </div>
      );
      // Full-page screenshots scroll inside their frames: a note above says so.
      const tall = block.images.some((im) => im.height > im.width * 1.4);
      return (
        <figure className="mt-8">
          {tall ? (
            <Annotated
              hand={handwriting.className}
              phoneList={false}
              notes={[
                {
                  x: 50 / block.images.length,
                  side: "above",
                  text: "scroll inside each to see the whole page",
                },
              ]}
            >
              {grid}
            </Annotated>
          ) : (
            grid
          )}
          {block.caption && <Caption text={block.caption} />}
        </figure>
      );
    }
    case "caption":
      return <Caption text={block.text} />;
    case "button": {
      const external = block.href.startsWith("http");
      return (
        <a
          href={block.href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/60"
        >
          {block.label} <span aria-hidden>{external ? "↗" : "↓"}</span>
        </a>
      );
    }
    // Buttons that jump to parts of the study, each with a line about what's there.
    case "links":
      return (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group flex h-full items-start justify-between gap-4 rounded-lg border border-white/15 px-5 py-4 transition-colors hover:border-white/40"
              >
                <span>
                  <span className="block font-heading text-lg font-bold text-white">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-base leading-6 text-white/70">
                    {item.text}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-1 text-white/50 transition-colors group-hover:text-(--accent)"
                >
                  ↓
                </span>
              </a>
            </li>
          ))}
        </ul>
      );
    // A client quote, set large, signed with a small round portrait, the name and their role.
    case "quote":
      return (
        <figure className="mt-12 [h3+&]:mt-6">
          <blockquote className="font-heading text-2xl leading-snug font-normal text-white/90 italic sm:text-[26px]">
            &ldquo;{block.text}&rdquo;
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            {block.photo && (
              <Image
                src={block.photo.src}
                alt=""
                width={block.photo.width}
                height={block.photo.height}
                sizes="48px"
                quality={90}
                className="size-12 shrink-0 rounded-full object-cover object-[50%_30%] ring-1 ring-white/25 ring-offset-2 ring-offset-[#080808] grayscale"
              />
            )}
            <span className="leading-tight">
              <span className="block text-base font-semibold text-white">
                {block.who}
              </span>
              {block.role && (
                <span className="mt-0.5 block text-sm text-white/50">
                  {block.role}
                </span>
              )}
            </span>
          </figcaption>
        </figure>
      );
    // Styled like Velo's goals in its challenge: a thin line on top, a small gray label, a title in
    // the heading font and a short line under it. Plain text, no box.
    case "goal":
      return (
        <div className="mt-6 border-t border-white/15 pt-5 sm:max-w-[calc(50%-20px)]">
          <p className={label}>{block.label ?? "Goal"}</p>
          <p className="mt-2 font-heading text-xl font-bold text-white">
            {block.title}
          </p>
          {block.text && (
            <p className="mt-2 text-base leading-7 text-white/70">
              {block.text}
            </p>
          )}
        </div>
      );
    case "screenshotNotes":
      return (
        <ScreenshotNotes
          image={block.image}
          alt={block.alt}
          notes={block.notes}
          hand={handwriting.className}
        />
      );
    case "moodboard":
      return <Moodboard images={block.images} note={block.note} />;
    case "handNote":
      return <HandNote text={block.text} hand={handwriting.className} />;
    case "versions":
      return (
        <div className="mt-8">
          <PeekVersions
            versions={block.versions}
            hand={handwriting.className}
            aspect={block.aspect}
          />
        </div>
      );
    // Two screens side by side, the same size, each with notes and a small label. Note rows keep
    // their height even when empty, so the two labels line up.
    case "pair":
      return (
        <div className="mt-8 grid items-start gap-10 sm:grid-cols-2 sm:gap-6">
          {block.items.map((item) => (
            <figure key={item.image.src}>
              <Annotated
                notes={item.notes}
                hand={handwriting.className}
                phoneList={false}
                steady
              >
                <ZoomImage
                  src={item.image.src}
                  width={item.image.width}
                  height={item.image.height}
                  alt={item.alt}
                  sizes="(min-width: 640px) 400px, 100vw"
                />
              </Annotated>
              <figcaption className="mt-3 text-sm text-white/50">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      );
    case "placeholder":
      return (
        <div className="mt-8 grid aspect-video place-items-center rounded-lg border border-dashed border-white/25 px-6 text-center text-sm text-white/50">
          Placeholder: {block.text}
        </div>
      );
    // The same player as Velo's product video, in the study's accent color.
    case "video":
      return (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#141417]">
          <ProductVideo
            src={block.src}
            label={block.label ?? "Video walkthrough"}
            aspect={block.aspect}
            silent={block.silent}
          />
        </figure>
      );
    case "embed":
      return (
        <div className="mt-8 aspect-video overflow-hidden rounded-lg border border-white/15 bg-black">
          <iframe
            src={block.src}
            title="Embedded video"
            className="size-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    default: {
      // Every block type needs a case above; a missing one fails the type check here.
      const unhandled: never = block;
      return unhandled;
    }
  }
}

export function CaseStudyBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </>
  );
}
