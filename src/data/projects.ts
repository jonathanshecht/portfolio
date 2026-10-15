import { cdn, type Img } from "./site";

export type Project = {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  logo: Img;
  cover: Img;
  // "live" shows on the home page; "hidden" has a page but no card; "soon" shows a locked card.
  status: "live" | "hidden" | "soon";
};

// Order here is the order on the home page.
export const projects: Project[] = [
  {
    slug: "velo",
    name: "Velo",
    kind: "Full Product",
    summary: "A Learning Platform Built From the Ground Up",
    logo: { src: cdn("6a88eb4e5ab4953e908bf9a5_velologo.png"), width: 43, height: 40 },
    cover: { src: cdn("6a88efb84f6f8da00c9fc7bc_Group%201000004641.png"), width: 511, height: 269 },
    status: "live",
  },
  {
    slug: "stacey-ryan",
    name: "Stacey Ryan",
    kind: "Client",
    summary: "Artist Website Redesign",
    logo: { src: cdn("68f3f6d5f990d5665e9b98ff_Frame%201321318801.png"), width: 74, height: 41 },
    cover: { src: cdn("68f3fbbe277abd049e8904d2_stacey.png"), width: 1021, height: 537 },
    status: "live",
  },
  {
    slug: "kit-plugins",
    name: "Kit Plugins",
    kind: "Client",
    summary: "Shopify Website Redesign",
    logo: { src: cdn("68f43d4896a067679f24d57d_kitlogo.png"), width: 40, height: 46 },
    cover: { src: cdn("68f4232f741147671464d2df_pics.png"), width: 766, height: 403 },
    status: "hidden",
  },
  {
    slug: "shure",
    name: "Shure",
    kind: "Internship",
    summary: "Design system & Beginner Workflow",
    logo: { src: cdn("6754ca4d969ac796cf1f1cca_Shure_Logo.svg.png"), width: 1200, height: 286 },
    cover: { src: cdn("6756a1f90a8e8fc8214eebf2_shure_banner.png"), width: 1532, height: 805 },
    status: "live",
  },
  {
    slug: "qr-menu",
    name: "QR Menu",
    kind: "Startup",
    summary: "Onboarding Redesign",
    logo: { src: cdn("67575cca22fb981b41910d5e_qrmeny_logo.png"), width: 1011, height: 256 },
    cover: { src: cdn("675caece8f06478341b60ef4_qrqrqr%201.png"), width: 1519, height: 801 },
    status: "live",
  },
  {
    slug: "moments",
    name: "Moments",
    kind: "Beta Startup",
    summary: "Location-Based Music Sharing App Redesign",
    logo: { src: cdn("6754d5815af65477ffc612a8_mmnts.png"), width: 991, height: 1152 },
    cover: { src: cdn("6754d8a8b4f499e680c01341_phonesssssssss%201.png"), width: 695, height: 621 },
    status: "soon",
  },
  {
    slug: "sizzle",
    name: "Sizzle",
    kind: "Startup",
    summary: "Early Dashboard, Onboarding & Notifications",
    logo: { src: cdn("6757639e82c7013ac4916b96_sizzlelog000o.png"), width: 203, height: 33 },
    cover: { src: cdn("675caf29b25c3db777465981_sizzle_illustration%201.png"), width: 1000, height: 671 },
    status: "soon",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

// The case study to suggest after this one, cycling through the visible ones.
export function nextProject(slug: string) {
  const live = projects.filter((p) => p.status === "live");
  const i = live.findIndex((p) => p.slug === slug);
  return live[(i + 1) % live.length];
}
