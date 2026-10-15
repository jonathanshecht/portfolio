import { projects, site } from "@/data/site";

const navItems = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <a href="#" className="font-semibold tracking-tight">
            {site.name}
          </a>
          <ul className="flex gap-5 text-sm text-muted">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6">
        <section className="py-24 sm:py-32">
          <p className="font-mono text-sm text-accent">{site.role}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, I&apos;m {site.name.split(" ")[0]}.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              See my work
            </a>
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-card"
            >
              GitHub
            </a>
          </div>
        </section>

        <section id="projects" className="scroll-mt-20 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <li
                key={project.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {project.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-background px-2.5 py-1 font-mono text-xs text-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                {(project.repo || project.live) && (
                  <div className="mt-4 flex gap-4 text-sm font-medium">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                        Live demo ↗
                      </a>
                    )}
                    {project.repo && (
                      <a href={project.repo} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                        Code ↗
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="scroll-mt-20 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">About</h2>
          <div className="mt-6 space-y-4 text-muted">
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {site.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-border px-3 py-1 text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="scroll-mt-20 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-4 max-w-xl text-muted">
            I&apos;m open to new opportunities. The best way to reach me is by
            email.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block text-lg font-medium text-accent hover:underline"
          >
            {site.email}
          </a>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted">
          <p>
            © {site.name}
          </p>
          <div className="flex gap-5">
            <a href={site.links.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
