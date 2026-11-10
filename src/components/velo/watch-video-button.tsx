"use client";

import { FloatingIconLink } from "@/components/home/floating-icon-link";

// The event the product video listens for, to start over with the sound on.
export const PLAY_PRODUCT_VIDEO = "velo:play-product-video";

// "Watch product video" near the top of the case study, in the site's secondary (outlined) button
// style, like "Resume" in the contact section. The video itself sits at the end, as the payoff;
// this scrolls down to it and plays it from the start with sound (the click counts as the
// visitor's go-ahead for audio).
export function WatchVideoButton({ target }: { target: string }) {
  return (
    <div className="flex">
      <FloatingIconLink
        href={`#${target}`}
        label="Watch product video"
        icon="play"
        look="outlined"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(target);
          const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          el?.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "center",
          });
          window.dispatchEvent(new Event(PLAY_PRODUCT_VIDEO));
        }}
      />
    </div>
  );
}
