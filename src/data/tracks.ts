// Projects described as "tracks" for the music-app design concepts.
import { projects, type Project } from "./projects";

export type Track = Project & {
  role: string;
  released: string; // display date
  length: string; // display duration
  // Position on a 2021-01 → 2027-01 timeline, in months from Jan 2021.
  start: number;
  months: number;
  color: string;
};

const extra: Record<string, Omit<Track, keyof Project>> = {
  velo: { role: "Lead Product Designer", released: "Aug 2026", length: "5 mo", start: 62, months: 5, color: "#b5e86a" },
  "stacey-ryan": { role: "Lead UX Designer", released: "Apr 2025", length: "1 mo", start: 51, months: 1, color: "#f2a65a" },
  shure: { role: "UX Design Intern", released: "Jun 2023", length: "2.5 mo", start: 29, months: 2.5, color: "#6ab7ff" },
  "qr-menu": { role: "UX Designer", released: "Nov 2021", length: "2 wk", start: 10, months: 0.5, color: "#4fd1a5" },
  moments: { role: "Product Designer", released: "Unreleased", length: "—", start: 66, months: 4, color: "#ff7eb6" },
  sizzle: { role: "Product Designer", released: "Unreleased", length: "—", start: 66, months: 4, color: "#ffd166" },
};

// Most recent first, like an album tracklist.
const order = ["velo", "stacey-ryan", "shure", "qr-menu", "moments", "sizzle"];

export const tracks: Track[] = order.map((slug) => {
  const project = projects.find((p) => p.slug === slug)!;
  return { ...project, ...extra[slug] };
});

export const skills = [
  { name: "Research", level: 0.85 },
  { name: "Interaction", level: 0.92 },
  { name: "Visual", level: 0.8 },
  { name: "Prototyping", level: 0.88 },
  { name: "Systems", level: 0.78 },
  { name: "Front-end", level: 0.6 },
  { name: "Audio", level: 0.95 },
];
