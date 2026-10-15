// All portfolio content lives here. Edit this file to update the site.

export const site = {
  name: "Jonathan Shechtman",
  role: "Software Developer",
  tagline:
    "I build fast, thoughtful web apps. Replace this line with a sentence about what you do and what you care about.",
  location: "Your City",
  email: "you@example.com",
  // Set this once you connect a custom domain in Vercel.
  url: "https://example.com",
  links: {
    github: "https://github.com/jonathanshecht",
    linkedin: "https://www.linkedin.com/in/your-handle",
  },
  about: [
    "Write two or three short paragraphs about yourself: what you work on, what you're learning, and what kind of role or projects you're looking for.",
    "Keep it personal and specific. Recruiters skim, so lead with the most important thing.",
  ],
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "SQL",
    "Git",
  ],
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  repo?: string;
  live?: string;
};

// Replace these placeholders with your real projects.
export const projects: Project[] = [
  {
    title: "Portfolio",
    description:
      "This site. Built with the Next.js App Router and Tailwind CSS, deployed on Vercel.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    repo: "https://github.com/jonathanshecht/portfolio",
  },
  {
    title: "Project Two",
    description:
      "One or two sentences on the problem it solves, what you built, and anything notable (users, performance, a hard technical piece).",
    tech: ["React", "Node.js"],
  },
  {
    title: "Project Three",
    description:
      "Describe another project. Link the code and a live demo if you have one; working demos stand out.",
    tech: ["Python", "PostgreSQL"],
  },
];
