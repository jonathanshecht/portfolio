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
  // Two flat screenshots, one behind at the top right and one in front at the bottom left, drawn
  // in code (with a thin frame) instead of as a single image. Positions are
  // percentages of a layout box with the given width-to-height ratio.
  screens?: { aspect: number; back: Screen; front: Screen };
  // The project's brand color, used for the card's hover accents and across its case study.
  // Without one, the site's red is used.
  accent?: string;
};

// A screenshot and where it sits in the card's layout: left (x) and top (y) edges and width, as
// percentages.
export type Screen = Img & { x: number; y: number; w: number };

const cover = (slug: string) => getProject(slug)!.cover;

// Placeholder hover video for projects that don't have their own preview yet.
const PLACEHOLDER_VIDEO = "/home/velo-card.mp4";

export const releases: Release[] = [
  {
    slug: "velo",
    accent: "#FBFA9D",
    hoverIcon: "camera",
    title: "Velo Academy",
    blurb: "An interactive photography learning platform.",
    tags: ["EdTech", "Web App", "0 to 1"],
    image: cover("velo"), // used where the screens aren't
    // The camera simulator in front (the product’s most distinctive screen), the dashboard behind.
    screens: {
      aspect: 1021 / 537,
      back: {
        src: "/home/velo-dashboard-2.jpg",
        width: 1200,
        height: 750,
        x: 38.59,
        y: 0,
        w: 61.41,
      },
      front: {
        src: "/home/velo-sim-edge.jpg",
        width: 1200,
        height: 750,
        x: 0,
        y: 27,
        w: 61.41,
      },
    },
    video: "/home/velo-card.mp4",
    fit: "contain",
  },
  {
    slug: "stacey-ryan",
    accent: "#F85910",
    hoverIcon: "clef",
    title: "Stacey Ryan",
    blurb: "A cinematic, magazine-style artist website.",
    tags: ["Website", "Client", "UX/UI"],
    image: cover("stacey-ryan"),
    // Split from the original cover image, in the same layout.
    screens: {
      aspect: 1021 / 537,
      back: {
        src: "/home/stacey-back-2.jpg",
        width: 601,
        height: 387,
        x: 38.59,
        y: 0,
        w: 61.41,
      },
      front: {
        src: "/home/stacey-front-2.jpg",
        width: 601,
        height: 388,
        x: 0,
        y: 22.72,
        w: 61.41,
      },
    },
    video: PLACEHOLDER_VIDEO,
    fit: "contain",
  },
  {
    slug: "shure",
    accent: "#B8F23A",
    hoverIcon: "mic",
    title: "Shure",
    blurb: "Audio components and a beginner error-handling flow.",
    tags: ["Design System", "Internship", "UX"],
    image: cover("shure"),
    screens: {
      aspect: 1532 / 805,
      back: {
        src: "/home/shure-back-2.jpg",
        width: 909,
        height: 587,
        x: 38.64,
        y: 0,
        w: 61.29,
      },
      front: {
        src: "/home/shure-front-2.jpg",
        width: 909,
        height: 589,
        x: 0,
        y: 22.98,
        w: 61.29,
      },
    },
    video: PLACEHOLDER_VIDEO,
    fit: "contain",
  },
  {
    slug: "qr-menu",
    title: "QR Menu",
    blurb: "An onboarding flow that publishes your menu on sign-up.",
    tags: ["Web App", "Startup", "UX/UI"],
    image: cover("qr-menu"),
    screens: {
      aspect: 1519 / 801,
      back: {
        src: "/home/qr-back-2.jpg",
        width: 970,
        height: 564,
        x: 34.43,
        y: 0.62,
        w: 65.57,
      },
      front: {
        src: "/home/qr-front-2.jpg",
        width: 971,
        height: 564,
        x: 0.13,
        y: 25.84,
        w: 65.64,
      },
    },
    video: PLACEHOLDER_VIDEO,
    fit: "contain",
  },
];
