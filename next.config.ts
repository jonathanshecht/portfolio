import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Portfolio images are still hosted on the Webflow CDN.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com", pathname: "/6753cd4e812cbecd7d5d52d9/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/media/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
