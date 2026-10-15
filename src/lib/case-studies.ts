import type { Img } from "@/data/site";
import kitPlugins from "@/content/case-studies/kit-plugins.json";
import qrMenu from "@/content/case-studies/qr-menu.json";
import shure from "@/content/case-studies/shure.json";
import staceyRyan from "@/content/case-studies/stacey-ryan.json";
import velo from "@/content/case-studies/velo.json";

// Text fields named `html` (and list items) may contain inline <mark>, <strong>, <em>, <br> and <a>.
export type Block =
  | { type: "section"; id: string; label: string }
  | { type: "part"; id: string; label: string; title: string }
  | { type: "eyebrow"; text: string }
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
  | { type: "video"; src: string }
  | { type: "embed"; src: string };

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  // [project type, timeline, role, team]
  meta: string[];
  hero: Img[];
  toc: { id: string; label: string }[];
  blocks: Block[];
};

const studies = [velo, staceyRyan, kitPlugins, shure, qrMenu] as unknown as CaseStudy[];

export const caseStudySlugs = studies.map((s) => s.slug);

export const getCaseStudy = (slug: string) => studies.find((s) => s.slug === slug);
