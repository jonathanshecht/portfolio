import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/nav";
import { Rich } from "@/components/rich";
import { about } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[846px] px-4 pb-24 sm:px-8">
        <section className="pt-10 sm:pt-16">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-muted uppercase">{about.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">{about.title}</h1>
          <div className="mt-6 space-y-4 text-lg leading-8">
            {about.intro.map((html) => (
              <Rich key={html} as="p" html={html} />
            ))}
          </div>
        </section>

        <div className="mt-12 grid grid-cols-2 gap-4">
          {about.photos.map((photo, i) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={i === 0 ? "Jonathan" : "Jonathan making music"}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 768px) 400px, 50vw"
              className="h-auto w-full rounded-3xl"
            />
          ))}
        </div>

        <section className="mt-16">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-muted uppercase">{about.hobbies.eyebrow}</p>
          <h2 className="mt-2 text-[28px] font-bold text-ink sm:text-[32px]">{about.hobbies.title}</h2>
          <div className="mt-5 space-y-4 text-lg leading-8">
            {about.hobbies.paragraphs.map((html) => (
              <Rich key={html} as="p" html={html} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
