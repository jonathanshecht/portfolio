import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaseStudyBlocks } from "@/components/case-study-blocks";
import { HandDivider } from "@/components/hand-divider";
import { ContactSection, HomeFooter } from "@/components/home/contact-section";
import { PillNav } from "@/components/home/pill-nav";
import { SectionNav } from "@/components/velo/section-nav";
import { releases } from "@/data/home";
import { caseStudySlugs, getCaseStudy } from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  return study
    ? { title: study.title, description: `${study.title}: ${study.subtitle}` }
    : {};
}

// The meta line in the content files is [project type, timeline, role, team]; the role starts
// with "Role: ". Shown with labels in the same 3-column grid as Velo.

// A study can use its own brand color for the accent (dots, the active item in the side nav, the
// nav logo), the way Velo uses its yellow. Studies not listed keep the site's red.
const accents: Record<string, string> = {
  shure: "#B2FF33",
};

export default function CaseStudyPage(props: PageProps<"/[slug]">) {
  return (
    // The slug is URL data, so the whole page resolves inside Suspense to keep navigation instant.
    <Suspense fallback={<div className="home-page min-h-dvh bg-[#080808]" />}>
      <CaseStudy params={props.params} />
    </Suspense>
  );
}

async function CaseStudy({
  params,
}: {
  params: PageProps<"/[slug]">["params"];
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const [back, front] = study.hero;
  const collage = back && front && back.width >= 600 && front.width >= 600;
  const hero = [...study.hero].sort((a, b) => b.width - a.width)[0];
  const tags = releases.find((r) => r.slug === slug)?.tags ?? [];
  // The toolkit moves out of the body into the row at the top, like on Velo: every "Toolkit"
  // label and the tags after it, combined into one list.
  const toolkit: string[] = [];
  const blocks = study.blocks.filter((block, i) => {
    const prev = study.blocks[i - 1];
    if (block.type === "label" && block.text === "Toolkit") return false;
    if (
      block.type === "chips" &&
      prev?.type === "label" &&
      prev.text === "Toolkit"
    ) {
      block.items.forEach((t) => toolkit.includes(t) || toolkit.push(t));
      return false;
    }
    return true;
  });
  const [project, timeline, role, team] = study.meta;
  const meta = [
    ["Role", role?.replace(/^Role:\s*/, "")],
    ["Timeline", timeline],
    ["Project", project],
    ["Team", team],
    ["Toolkit", toolkit.join(", ")],
  ].filter(([, value]) => value);

  const accent = accents[slug];
  return (
    <div
      className="home-page relative isolate min-h-dvh overflow-hidden bg-[#080808] text-white"
      style={
        accent
          ? {
              ["--accent" as string]: accent,
              ["--accent-lit" as string]: accent,
            }
          : undefined
      }
    >
      <PillNav />
      {study.toc.length > 1 && <SectionNav items={study.toc} />}

      <main className="flex flex-col items-center px-4">
        <article className="case-study-dark w-full max-w-[846px] pt-[136px] pb-32 sm:px-4 sm:pt-[200px]">
          {/* The hero: the study's two images overlapping, like the previous design, when both
              are big enough; otherwise the larger one on its own, framed like Velo's hero. */}
          {collage ? (
            <div className="relative h-[240px] sm:h-[420px]">
              <Image
                src={back.src}
                alt=""
                width={back.width}
                height={back.height}
                sizes="(min-width: 900px) 580px, 70vw"
                unoptimized={back.src.includes(".gif")}
                priority
                className="absolute top-0 right-0 w-[68%] rounded-xl border border-white/10 shadow-2xl"
              />
              <Image
                src={front.src}
                alt=""
                width={front.width}
                height={front.height}
                sizes="(min-width: 900px) 580px, 70vw"
                unoptimized={front.src.includes(".gif")}
                priority
                className="absolute top-[22%] left-0 w-[68%] rounded-xl border border-white/10 shadow-2xl"
              />
            </div>
          ) : (
            hero && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141417]">
                <Image
                  src={hero.src}
                  alt=""
                  width={hero.width}
                  height={hero.height}
                  sizes="(min-width: 900px) 846px, 100vw"
                  unoptimized={hero.src.includes(".gif")}
                  priority
                  className="block h-auto w-full"
                />
              </div>
            )
          )}

          <header id="overview" className="mt-12 scroll-mt-32 sm:mt-16">
            <h1 className="font-heading text-[34px] font-bold sm:text-[40px]">
              {study.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
              {study.subtitle}
            </p>
            {tags.length > 0 && (
              <ul
                className="mt-4 flex flex-wrap gap-2 text-sm"
                aria-label="Tags"
              >
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-lg bg-white/12 p-2 leading-none"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <HandDivider className="mt-12" />
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 py-8 sm:grid-cols-3">
            {meta.map(([label, value]) => (
              <div
                key={label}
                className={
                  label === "Team"
                    ? "col-span-2 sm:col-span-1"
                    : label === "Toolkit"
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

          <CaseStudyBlocks blocks={blocks} />
        </article>

        <ContactSection />
      </main>
      <HomeFooter />
    </div>
  );
}
