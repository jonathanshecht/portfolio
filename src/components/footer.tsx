import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-8">
        <p>
          Designed by {site.name} · {site.location}
        </p>
        <div className="flex gap-6 font-medium">
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">
            LinkedIn
          </a>
          <a href={site.links.resume} target="_blank" rel="noreferrer" className="hover:text-ink">
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
