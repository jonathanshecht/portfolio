import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Dev only: lets a phone or tablet on the same Wi-Fi open the dev server by its local network
  // address (e.g. http://192.168.2.30:3000) with everything working. Doesn't affect the live site.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  images: {
    // 75 is the default; 90 is for photos that need it (the About portrait).
    qualities: [75, 90],
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
