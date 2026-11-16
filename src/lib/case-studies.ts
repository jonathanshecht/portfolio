import type { Annotation } from "@/components/velo/annotations";
import type { Img } from "@/data/site";
import kitPlugins from "@/content/case-studies/kit-plugins.json";
// QR Menu is off the site for now; its content stays in content/case-studies/qr-menu.json.
import shure from "@/content/case-studies/shure.json";
import staceyRyan from "@/content/case-studies/stacey-ryan.json";
// The original Velo case study, kept at /velo-old (the new one lives at app/velo).
import veloOld from "@/content/case-studies/velo-old.json";

// Text fields named `html` (and list items) may contain inline <mark>, <strong>, <em>, <br> and <a>.
export type Block =
  | { type: "section"; id: string; label: string }
  | { type: "part"; id: string; label: string; title: string }
  | { type: "eyebrow"; text: string; id?: string }
  | { type: "title"; html: string }
  | { type: "heading"; html: string }
  | { type: "label"; text: string }
  | { type: "p"; html: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "chips"; items: string[] }
  | { type: "pairs"; items: { problem: string; solution: string }[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "figure"; image: Img; caption?: string }
  | { type: "gallery"; images: Img[]; caption?: string }
  | { type: "caption"; text: string }
  | { type: "button"; label: string; href: string }
  | {
      type: "quote";
      text: string;
      who: string;
      // Shown under the name, like "Artist".
      role?: string;
      // A small round portrait beside the name.
      photo?: Img;
    }
  // A visual that still needs to be added: a dashed box saying what goes there.
  | { type: "placeholder"; text: string }
  // A takeaway written by hand, with a hand-drawn loop around it.
  | { type: "handNote"; text: string }
  // Two screens side by side, each with a small label and handwritten notes.
  | {
      type: "pair";
      items: { image: Img; alt: string; label: string; notes: Annotation[] }[];
    }
  // Earlier versions of a screen, stepped through one at a time with handwritten notes, like
  // Velo's home page iterations.
  | {
      type: "versions";
      aspect: string;
      noun?: string;
      versions: (Img & { label: string; alt: string; notes: Annotation[] })[];
    }
  // The project's measurable goal, set apart so the result can be read against it.
  | { type: "goal"; title: string; text?: string; label?: string }
  // A full-page screenshot with handwritten notes in the margins that appear as you scroll.
  | {
      type: "screenshotNotes";
      image: Img;
      alt: string;
      notes: {
        text: string;
        x: number;
        y: number;
        side: "left" | "right";
        inside?: boolean;
      }[];
    }
  // Reference photos laid out like prints pinned to a board, each a little tilted.
  | { type: "moodboard"; images: (Img & { alt: string })[]; note?: string }
  | {
      type: "links";
      items: { label: string; text: string; href: string }[];
    }
  | {
      type: "video";
      src: string;
      label?: string;
      aspect?: string;
      // No sound track, so no sound controls.
      silent?: boolean;
    }
  | { type: "embed"; src: string };

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  // [project type, timeline, role, team]
  meta: string[];
  hero: Img[];
  // Optional, shown like on Velo: a short intro under the title, and an Impact list under the
  // Role / Timeline grid. Both may contain inline <mark> and <strong>.
  intro?: string;
  // A video shown as the hero instead of the images, like Velo's.
  heroVideo?: string;
  impact?: string[];
  toc: { id: string; label: string }[];
  blocks: Block[];
};

const studies = [
  staceyRyan,
  kitPlugins,
  shure,
  veloOld,
] as unknown as CaseStudy[];

export const caseStudySlugs = studies.map((s) => s.slug);

export const getCaseStudy = (slug: string) =>
  studies.find((s) => s.slug === slug);
