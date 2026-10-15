import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { CaseStudyBlocks } from "@/components/case-study-blocks";
import { Nav } from "@/components/nav";
import { ProjectCard } from "@/components/project-card";
import { nextProject } from "@/data/projects";
import { caseStudySlugs, getCaseStudy } from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  return study ? { title: study.title, description: `${study.title}: ${study.subtitle}` } : {};
}

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0 text-[#b5e86a]" aria-hidden>
    {path}
  </svg>
);
const metaIcons = [
  icon(<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  icon(<><circle cx="9" cy="8" r="3.5" /><path d="M2 20a7 7 0 0 1 14 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a7 7 0 0 1 4 6.5" /></>),
];

export default function CaseStudyPage(props: PageProps<"/[slug]">) {
  return (
    <>
      <Nav tone="dark" />
      {/* The slug is URL data, so it resolves inside Suspense to keep navigation instant. */}
      <Suspense fallback={<div className="h-[640px] bg-night" />}>
        <CaseStudy params={props.params} />
      </Suspense>
    </>
  );
}

async function CaseStudy({ params }: { params: PageProps<"/[slug]">["params"] }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const next = nextProject(slug);
  const [back, front] = study.hero;

  return (
    <>
      <header
        id="overview"
        className="relative overflow-hidden bg-night px-4 pt-32 text-white sm:px-8"
        style={{ backgroundImage: "radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.12), transparent)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold sm:text-6xl">{study.title}</h1>
          <p className="mt-3 text-lg text-white/85">{study.subtitle}</p>
          <ul className="mx-auto mt-10 grid max-w-2xl gap-x-10 gap-y-5 text-left text-sm sm:grid-cols-2">
            {study.meta.map((item, i) => (
              <li key={item} className="flex items-start gap-3">
                {metaIcons[i]}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto mt-14 h-[220px] max-w-3xl sm:h-[360px]">
          {back && (
            <Image src={back.src} alt="" width={back.width} height={back.height} sizes="(min-width: 640px) 480px, 70vw" priority
              className="absolute top-0 right-0 w-[68%] rounded-xl shadow-2xl" />
          )}
          {front && (
            <Image src={front.src} alt="" width={front.width} height={front.height} sizes="(min-width: 640px) 480px, 70vw" priority
              className="absolute top-[22%] left-0 w-[68%] rounded-xl shadow-2xl" />
          )}
        </div>
      </header>

      <div className="bg-canvas">
        <div className="mx-auto flex max-w-6xl gap-12 px-4 pb-24 sm:px-8">
          <article className="mx-auto w-full max-w-[760px] pt-4">
            <CaseStudyBlocks blocks={study.blocks} />
          </article>
          {study.toc.length > 1 && (
            <aside className="hidden w-36 shrink-0 xl:block">
              <nav aria-label="On this page" className="sticky top-10 mt-16 grid gap-2 text-sm font-semibold text-ink">
                {study.toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="text-muted hover:text-ink">
                    {item.label}
                  </a>
                ))}
                <a href="#overview" className="text-muted hover:text-ink" aria-label="Back to top">↑</a>
              </nav>
            </aside>
          )}
        </div>
        {next && next.slug !== slug && (
          <section className="mx-auto max-w-[846px] px-4 pb-24 sm:px-8">
            <p className="mb-4 text-center text-[13px] font-semibold tracking-[0.2em] text-muted uppercase">Read next</p>
            <ProjectCard project={next} />
          </section>
        )}
      </div>
    </>
  );
}
