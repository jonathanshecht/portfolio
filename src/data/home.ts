// Home page project list: the projects shown in the work section, in order.
// Blurbs and tags for Stacey Ryan, Shure and QR Menu are drafts; rewrite them in your own words.
import type { Img } from "./site";
import { getProject } from "./projects";

export type Release = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  // Still shown at rest.
  image: Img;
  // Preview that plays on hover.
  video: string;
  // Small icon that floats out of the card while it is hovered.
  hoverIcon?: "camera" | "clef" | "mic";
  // "cover" fills the card (full-bleed renders); "contain" fits mockups with transparent backgrounds.
  fit: "cover" | "contain";
};

const cover = (slug: string) => getProject(slug)!.cover;

// Placeholder hover video for projects that don't have their own preview yet.
const PLACEHOLDER_VIDEO = "/home/velo-card.mp4";

export const releases: Release[] = [
  {
    slug: "velo",
    hoverIcon: "camera",
    title: "Velo Academy",
    blurb: "An interactive photography learning platform.",
    tags: ["Desktop App", "End to End", "UX/UI"],
    image: { src: "/home/velo-poster.jpg", width: 960, height: 540 },
    video: "/home/velo-card.mp4",
    fit: "cover",
  },
  {
    slug: "stacey-ryan",
    hoverIcon: "clef",
    title: "Stacey Ryan",
    blurb: "A cinematic, magazine-style artist website.",
    tags: ["Website", "Client", "UX/UI"],
    image: cover("stacey-ryan"),
    video: PLACEHOLDER_VIDEO,
    fit: "contain",
  },
  {
    slug: "shure",
    hoverIcon: "mic",
    title: "Shure",
    blurb: "Audio components and a beginner error-handling flow.",
    tags: ["Design System", "Internship", "UX"],
    image: cover("shure"),
    video: PLACEHOLDER_VIDEO,
    fit: "contain",
  },
  {
    slug: "qr-menu",
    title: "QR Menu",
    blurb: "An onboarding flow that publishes your menu on sign-up.",
    tags: ["Web App", "Startup", "UX/UI"],
    image: cover("qr-menu"),
    video: PLACEHOLDER_VIDEO,
    fit: "contain",
  },
];
