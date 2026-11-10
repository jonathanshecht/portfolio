// A faint divider line with a gentle hand-drawn wobble, used on the dark pages. `flip` mirrors
// it, so two dividers close together don't look identical.
export function HandDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 576 6"
      preserveAspectRatio="none"
      className={`h-1.5 w-full overflow-visible ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <path
        d="M0 3 C 48 1.6, 96 4.4, 150 3.1 S 250 1.5, 310 3.2 S 420 4.6, 470 2.9 S 550 1.8, 576 3"
        fill="none"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth={1}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
