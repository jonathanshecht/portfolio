import Image from "next/image";
import type { Img } from "@/data/site";
import type { Block } from "@/lib/case-studies";
import { Rich } from "./rich";

function Caption({ text }: { text: string }) {
  return <figcaption className="mt-3 text-center text-xs font-medium tracking-[0.15em] text-muted uppercase">{text}</figcaption>;
}

function Picture({ image, sizes }: { image: Img; sizes: string }) {
  return (
    <Image
      src={image.src}
      alt=""
      width={image.width}
      height={image.height}
      sizes={sizes}
      className="h-auto w-full rounded-2xl"
    />
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "section":
      return (
        <div id={block.id} className="flex scroll-mt-8 items-center gap-6 pt-20 pb-4">
          <span className="h-px flex-1 bg-line" />
          <h2 className="text-sm font-semibold tracking-[0.2em] text-muted uppercase">{block.label}</h2>
          <span className="h-px flex-1 bg-line" />
        </div>
      );
    case "part":
      return (
        <div id={block.id} className="scroll-mt-8 border-t border-line pt-20 mt-16">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted uppercase">{block.label}</p>
          <h2 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">{block.title}</h2>
        </div>
      );
    case "eyebrow":
      return <p className="pt-12 text-[13px] font-semibold tracking-[0.2em] text-muted uppercase">{block.text}</p>;
    case "title":
      return <Rich as="h3" html={block.html} className="mt-2 text-[28px] leading-tight font-bold text-ink sm:text-[32px] sm:leading-10" />;
    case "heading":
      return <Rich as="h4" html={block.html} className="pt-6 text-xl font-semibold text-ink" />;
    case "label":
      return <h4 className="pt-8 text-lg font-semibold text-ink">{block.text}</h4>;
    case "p":
      return <Rich as="p" html={block.html} className="mt-4 text-base leading-7" />;
    case "note":
      return (
        <p className="mt-12 inline-block rounded-full bg-line/70 px-4 py-2 text-xs font-medium tracking-[0.12em] text-muted uppercase">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 marker:text-muted">
          {block.items.map((item) => (
            <Rich as="li" key={item} html={item} />
          ))}
        </ul>
      );
    case "bullets":
      return (
        <ul className="mt-5 grid gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 rounded-2xl bg-white px-5 py-4 leading-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <span className="mt-2.5 size-2 shrink-0 rounded-full bg-[#b5e86a]" aria-hidden />
              <Rich html={item} />
            </li>
          ))}
        </ul>
      );
    case "chips":
      return (
        <ul className="mt-3 flex flex-wrap gap-2">
          {block.items.map((item) => (
            <li key={item} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-ink">
              {item}
            </li>
          ))}
        </ul>
      );
    case "pairs":
      return (
        <div className="mt-6 grid gap-3">
          <div className="hidden grid-cols-[1fr_auto_1fr] gap-4 px-1 text-xs font-semibold tracking-[0.15em] text-muted uppercase sm:grid">
            <span>Pain point</span>
            <span className="w-5" />
            <span>Solution</span>
          </div>
          {block.items.map(({ problem, solution }) => (
            <div key={problem} className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
              <p className="rounded-2xl bg-white px-5 py-4 text-sm leading-6">{problem}</p>
              <span className="text-center text-muted" aria-hidden>
                <span className="hidden sm:inline">→</span>
                <span className="sm:hidden">↓</span>
              </span>
              <p className="rounded-2xl bg-night px-5 py-4 text-sm leading-6 text-white">{solution}</p>
            </div>
          ))}
        </div>
      );
    case "stats":
      return (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {block.items.map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-white px-6 py-7 text-center">
              <dt className="text-4xl font-bold text-ink">{stat.value}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      );
    case "figure":
      return (
        <figure className="mt-8">
          <Picture image={block.image} sizes="(min-width: 768px) 760px, 100vw" />
          {block.caption && <Caption text={block.caption} />}
        </figure>
      );
    case "gallery":
      return (
        <figure className="mt-8">
          <div className={`grid gap-4 ${block.images.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} items-start`}>
            {block.images.map((image) => (
              <Picture key={image.src} image={image} sizes="(min-width: 768px) 380px, 100vw" />
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
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-night px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          {block.label} <span aria-hidden>{external ? "↗" : "↓"}</span>
        </a>
      );
    }
    case "video":
      return (
        <video
          className="mt-8 w-full rounded-2xl bg-black"
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
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-black">
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
