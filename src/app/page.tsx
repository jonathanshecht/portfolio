import Image from "next/image";
import { Nav } from "@/components/nav";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function Home() {
  const [first] = site.name.split(" ");
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[846px] px-4 pb-24 sm:px-8">
        <section className="relative isolate overflow-hidden rounded-[32px] bg-night px-6 py-16 text-center text-white sm:py-20">
          <video
            className="absolute inset-0 -z-10 size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={site.heroVideo.poster}
          >
            <source src={site.heroVideo.mp4} type="video/mp4" />
            <source src={site.heroVideo.webm} type="video/webm" />
          </video>
          <h1 className="text-4xl sm:text-[50px] sm:leading-[70px]">
            Hello, I&rsquo;m <strong className="font-bold">{first}</strong>
          </h1>
          <p className="mt-3 text-base sm:text-lg">{site.tagline}</p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Image src={site.icons.location} alt="" width={24} height={24} className="size-6" />
              {site.location}
            </li>
            <li className="flex items-center gap-2">
              <Image src={site.icons.work} alt="" width={24} height={24} className="size-6" />
              {site.job}
            </li>
          </ul>
          <iframe
            src={site.playlist.embed}
            title={site.playlist.label}
            className="mx-auto mt-8 block h-[152px] w-full max-w-[380px] rounded-xl"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <p className="mt-5 inline-flex items-center gap-3 rounded-lg bg-white/15 px-4 py-2 text-sm backdrop-blur">
            <Image src={site.icons.waveform} alt="" width={1920} height={1080} unoptimized className="h-5 w-10 object-cover mix-blend-screen" />
            {site.playlist.label}
          </p>
        </section>

        <section id="work" aria-label="Work" className="mt-8 grid scroll-mt-6 gap-8">
          {projects
            .filter((p) => p.status !== "hidden")
            .map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
        </section>
      </main>
    </>
  );
}
