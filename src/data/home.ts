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
  // Preview that plays on hover. Projects without their own preview yet leave it out and just
  // show the still image.
  video?: string;
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
  // For now, a case study that lives on the old portfolio: the card opens it in a new tab instead
  // of this site's page.
  external?: string;
};

// A screenshot and where it sits in the card's layout: left (x) and top (y) edges and width, as
// percentages.
export type Screen = Img & { x: number; y: number; w: number };

const cover = (slug: string) => getProject(slug)!.cover;

export const releases: Release[] = [
  {
    slug: "velo",
    accent: "#FBFA9D",
    hoverIcon: "camera",
    title: "Velo Academy",
    blurb: "A photography platform where 13% of trial users upgraded.",
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
    blurb: "An artist website that tripled ticket click-throughs.",
    video: "/home/stacey-card-10.mp4",
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
    fit: "contain",
  },
  {
    slug: "shure",
    external: "https://jnthndesign.webflow.io/shure",
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
    fit: "contain",
  },
];
