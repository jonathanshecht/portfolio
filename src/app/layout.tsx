import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/data/site";
import "./globals.css";

// Body text.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Titles and headings. TeX Gyre Adventor ships in regular and bold only.
const adventor = localFont({
  variable: "--font-adventor",
  src: [
    { path: "../fonts/texgyreadventor-regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/texgyreadventor-italic.otf", weight: "400", style: "italic" },
    { path: "../fonts/texgyreadventor-bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/texgyreadventor-bolditalic.otf", weight: "700", style: "italic" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${adventor.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
