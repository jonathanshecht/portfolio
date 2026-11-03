import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

// True when the visitor asked their OS to reduce motion; concepts then start paused.
export function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
