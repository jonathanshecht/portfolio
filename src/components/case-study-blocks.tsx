import type { Img } from "@/data/site";
import type { Block } from "@/lib/case-studies";
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
      light
    />
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
      return <p className={`pt-12 ${label}`}>{block.text}</p>;
    case "title":
      return (
        <Rich
          as="h3"
          html={block.html}
          className="mt-2 font-heading text-[28px] leading-tight font-bold text-white sm:text-[32px] sm:leading-10"
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
      return <Rich as="p" html={block.html} className={`mt-4 ${body}`} />;
    // A small status tag, like Velo's "Launched".
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
    case "figure":
      return (
        <figure className="mt-8">
          <Picture
            image={block.image}
            caption={block.caption}
            sizes="(min-width: 900px) 846px, 100vw"
          />
          {block.caption && <Caption text={block.caption} />}
        </figure>
      );
    case "gallery":
      return (
        <figure className="mt-8">
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
          {block.caption && <Caption text={block.caption} />}
        </figure>
      );
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
    case "video":
      return (
        <video
          className="mt-8 w-full rounded-lg border border-white/15 bg-black"
          src={block.src}
          autoPlay
          muted
          loop
          playsInline
          controls
        />
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
