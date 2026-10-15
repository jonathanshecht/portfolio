import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { site } from "@/data/site";

export function ProjectCard({ project }: { project: Project }) {
  const soon = project.status === "soon";

  const body = (
    <div className="relative flex h-[340px] flex-col items-center gap-3 overflow-hidden rounded-[32px] bg-night px-6 pt-8 sm:h-[420px]">
      <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-ink">
        <Image
          src={project.logo.src}
          alt=""
          width={project.logo.width}
          height={project.logo.height}
          className="h-5 w-auto max-w-16 object-contain"
        />
        {project.name} · {project.kind}
        {soon && <Image src={site.icons.lock} alt="" width={16} height={16} className="size-4" />}
      </span>
      <p className="text-center text-sm text-white">{project.summary}</p>
      <Image
        src={project.cover.src}
        alt={`${project.name} designs`}
        width={project.cover.width}
        height={project.cover.height}
        sizes="(min-width: 640px) 520px, 90vw"
        className={`mt-auto w-full max-w-[520px] object-contain object-bottom transition duration-500 ${
          soon ? "opacity-40 blur-[2px]" : "group-hover:-translate-y-2 group-hover:scale-[1.02]"
        }`}
      />
      {soon && (
        <p className="absolute inset-x-0 bottom-[38%] text-center text-[32px] font-semibold text-white">Coming Soon</p>
      )}
    </div>
  );

  if (soon) return <div aria-label={`${project.name}, coming soon`}>{body}</div>;
  return (
    <Link href={`/${project.slug}`} className="group block rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-4">
      {body}
    </Link>
  );
}
