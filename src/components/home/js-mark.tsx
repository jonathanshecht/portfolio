"use client";

import { useId } from "react";

// The JS mark. The SVG's shape is used as a mask, so it can take any fill color.
export function JsMark({
  className = "size-7",
  color = "#E5484D",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={`block ${className}`}
      style={{
        backgroundColor: color,
        maskImage: "url(/home/js-mark.svg)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: "url(/home/js-mark.svg)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// The mark's three shapes (J, S and the bar across the top), in the logo's own units (21.4 wide).
// J and S are drawn with a 1.56 stroke on top of their fill, as in the original logo.
const STROKE = 1.55672;
const J_PATH =
  "M9.30063 13.4203C9.30063 13.9762 9.19401 14.4979 8.98076 14.9854C8.77513 15.4728 8.48953 15.8993 8.12396 16.2648C7.7584 16.6304 7.3319 16.9198 6.84448 17.1331C6.35706 17.3387 5.83536 17.4415 5.2794 17.4415H4.81102C4.25505 17.4415 3.72955 17.3387 3.23451 17.1331C2.74709 16.9198 2.3206 16.6304 1.95503 16.2648C1.58946 15.8993 1.30006 15.4728 1.08681 14.9854C0.881177 14.4979 0.778361 13.9762 0.778361 13.4203V13.3957C0.778361 13.0345 1.04026 12.7265 1.39681 12.6684C1.84511 12.5955 2.25205 12.9415 2.25205 13.3957V13.4203C2.25205 13.7859 2.3206 14.1286 2.45768 14.4484C2.59477 14.7607 2.78136 15.0387 3.01746 15.2824C3.26117 15.5185 3.53915 15.7051 3.85141 15.8422C4.17128 15.9792 4.51399 16.0478 4.87956 16.0478H5.21086C5.56881 16.0478 5.90772 15.9792 6.22759 15.8422C6.54746 15.7051 6.82544 15.5185 7.06154 15.2824C7.29763 15.0387 7.48422 14.7607 7.62131 14.4484C7.7584 14.1286 7.82694 13.7859 7.82694 13.4203V1.56793C7.82694 1.16098 8.15684 0.831086 8.56379 0.831086C8.97073 0.831086 9.30063 1.16098 9.30063 1.56793V13.4203Z";
const S_PATH =
  "M20.6154 16.6494C20.6154 17.1314 20.5145 17.5837 20.3128 18.0063C20.1178 18.4288 19.8522 18.7986 19.5159 19.1155C19.1864 19.4324 18.7998 19.6833 18.3559 19.8682C17.9188 20.0465 17.4548 20.1356 16.9639 20.1356H15.925C15.4341 20.1356 14.9667 20.0465 14.5229 19.8682C14.0858 19.6833 13.6991 19.4324 13.3629 19.1155C13.0334 18.7986 12.7678 18.4288 12.566 18.0063C12.371 17.5837 12.2735 17.1314 12.2735 16.6494V16.6398C12.2735 16.3201 12.5058 16.0478 12.8214 15.9973C13.2167 15.9342 13.5747 16.2395 13.5747 16.6398V16.6494C13.5747 16.9664 13.6386 17.2635 13.7664 17.5408C13.9009 17.8115 14.0791 18.0525 14.301 18.2638C14.5229 18.4685 14.7784 18.6302 15.0676 18.7491C15.3635 18.8679 15.6728 18.9273 15.9956 18.9273H16.9034C17.2262 18.9273 17.5322 18.8679 17.8213 18.7491C18.1105 18.6302 18.366 18.4685 18.5879 18.2638C18.8098 18.0525 18.9847 17.8115 19.1125 17.5408C19.2469 17.2635 19.3142 16.9664 19.3142 16.6494V16.2236C19.3142 15.735 19.2167 15.3289 19.0217 15.0054C18.8267 14.6819 18.5678 14.4079 18.245 14.1834C17.9222 13.9523 17.5557 13.7575 17.1455 13.5991C16.742 13.4406 16.3251 13.2821 15.8947 13.1237C15.4644 12.9652 15.0441 12.7902 14.6339 12.5988C14.2304 12.4073 13.8673 12.1696 13.5445 11.8857C13.2217 11.5952 12.9628 11.2419 12.7678 10.826C12.5728 10.41 12.4753 9.89831 12.4753 9.29088V9.02347C12.4753 8.54148 12.566 8.08921 12.7476 7.66664C12.9359 7.24408 13.1914 6.87433 13.5142 6.55741C13.837 6.24049 14.2136 5.99289 14.644 5.81462C15.0811 5.62975 15.545 5.53731 16.0359 5.53731H16.9639C17.4548 5.53731 17.9155 5.62975 18.3459 5.81462C18.7762 5.99289 19.1528 6.24049 19.4756 6.55741C19.7984 6.87433 20.0505 7.24408 20.2321 7.66664C20.4204 8.08921 20.5145 8.54148 20.5145 9.02347C20.5145 9.23459 20.3612 9.41443 20.1527 9.44775L19.7805 9.50723C19.4829 9.55481 19.2133 9.32488 19.2133 9.02347C19.2133 8.70655 19.1528 8.41273 19.0318 8.14203C18.9107 7.86472 18.746 7.62373 18.5375 7.41905C18.329 7.21437 18.0836 7.0526 17.8012 6.93376C17.5254 6.81491 17.2262 6.75549 16.9034 6.75549H16.0965C15.7737 6.75549 15.4711 6.81491 15.1886 6.93376C14.9129 7.0526 14.6675 7.21437 14.4523 7.41905C14.2438 7.62373 14.0791 7.86472 13.958 8.14203C13.837 8.41273 13.7765 8.70655 13.7765 9.02347V9.29088C13.7765 9.74645 13.874 10.1294 14.069 10.4397C14.264 10.75 14.5229 11.0174 14.8457 11.2419C15.1685 11.4598 15.5316 11.6513 15.9351 11.8164C16.3453 11.9748 16.7656 12.1399 17.1959 12.3116C17.6263 12.4766 18.0432 12.6615 18.4467 12.8662C18.8569 13.0642 19.2234 13.3118 19.5462 13.609C19.869 13.8995 20.1279 14.256 20.3229 14.6786C20.5179 15.1011 20.6154 15.6161 20.6154 16.2236V16.6494Z";
const BAR_PATH =
  "M8.45848 0L14.4514 0C15.3224 0 16.0285 0.706083 16.0285 1.57708V1.57708C16.0285 2.44808 15.3224 3.15416 14.4514 3.15416H8.45848V0Z";
// Paint drips running down from the letters: [x, top, length], each ending in a small round bead.
// Each hangs from real paint on the J or S, and sits directly above a solid stroke of the heading
// below ("Let's work together", centered under the mark): the r, the k's stem and leg, and the t.
// That way the drops fall straight down and always land on a letter, never in a gap.
export const DRIPS: [number, number, number][] = [
  [0.9, 13.8, 1.6], // J's hook, above the r
  [5.5, 17.7, 2.2], // bottom of the J, above the k's stem
  [8.9, 15.7, 1.4], // J's curve, above the k's leg
  [20.2, 18.3, 1.5], // S's lower curve, above the t
];

// The painted shapes: both letters and the bar, plus the drips unless `drips` is "none". With
// "dripping", the drips are tagged so CSS can make them run (.drip-line and .drip-bead).
export const DRIP_DELAY = (i: number) => `${i * -0.53}s`;
function Paint({
  color,
  drips = "static",
}: {
  color: string;
  drips?: "none" | "static" | "dripping";
}) {
  const dripping = drips === "dripping";
  return (
    <g fill={color} stroke={color} strokeLinejoin="round" strokeLinecap="round">
      <path d={J_PATH} strokeWidth={STROKE} />
      <path d={S_PATH} strokeWidth={STROKE} />
      <path d={BAR_PATH} strokeWidth={0} />
      {drips !== "none" &&
        DRIPS.map(([x, top, length], i) => (
          <g
            key={`${x}-${top}`}
            style={
              dripping
                ? ({
                    "--len": length,
                    "--delay": DRIP_DELAY(i),
                  } as React.CSSProperties)
                : undefined
            }
          >
            <path
              d={`M${x} ${top} v${length}`}
              fill="none"
              strokeWidth={0.7}
              className={dripping ? "drip-line" : undefined}
            />
            <circle
              cx={x}
              cy={top + length}
              r={0.55}
              stroke="none"
              className={dripping ? "drip-bead" : undefined}
            />
          </g>
        ))}
    </g>
  );
}

// The JS mark as spray-painted graffiti, in the same hand-made indie spirit as the piano: rough
// sprayed edges, a speckle of overspray and a few drips.
// "glow" (contact section): at rest the paint is a dull dark gray, barely visible in the dark.
// When a ".glow-trigger" inside the surrounding ".glow-zone" is hovered or focused, the
// glow-in-the-dark layer (".glow-lit") fades in: the same graffiti in red, glowing softly. On
// touch screens it stays lit. While lit, the red paint keeps dripping: each drip slowly runs down,
// a drop falls off (see GraffitiHeading, which adds the falling drops and paint), and it starts
// again. At rest there are no drips at all. Styles live in globals.css.
// "static" (navbar): red graffiti texture only, with no drips and no glow.
export function GraffitiJsMark({
  className = "size-10",
  mode = "glow",
}: {
  className?: string;
  mode?: "glow" | "static";
}) {
  const id = useId().replace(/:/g, "");
  const spray = `spray-${id}`;
  const glow = `glow-${id}`;
  // The SVG is drawn larger than the box (letters at the box's size) to leave room for the
  // overspray, drips and glow without changing the layout.
  const pad = 4;
  const w = 21.3938 + pad * 2;
  const h = 20.914 + pad * 2;
  return (
    <span aria-hidden className={`relative block ${className}`}>
      <svg
        viewBox={`${-pad} ${-pad} ${w} ${h}`}
        className="absolute overflow-visible"
        style={{
          left: `${(-pad / 21.3938) * 100}%`,
          top: `${(-pad / 20.914) * 100}%`,
          width: `${(w / 21.3938) * 100}%`,
          height: `${(h / 20.914) * 100}%`,
        }}
      >
        <defs>
          {/* Spray paint: wobbly, slightly rough edges plus a fine speckle of overspray around them. */}
          <filter
            id={spray}
            x={-pad}
            y={-pad}
            width={w}
            height={h}
            filterUnits="userSpaceOnUse"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.4"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0.55"
              xChannelSelector="R"
              yChannelSelector="G"
              result="rough"
            />
            <feGaussianBlur in="rough" stdDeviation="0.55" result="halo" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="4.5"
              numOctaves="1"
              seed="9"
              result="grain"
            />
            <feColorMatrix
              in="grain"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 14 -8.4"
              result="dots"
            />
            <feComposite
              in="halo"
              in2="dots"
              operator="in"
              result="overspray"
            />
            <feMerge>
              <feMergeNode in="overspray" />
              <feMergeNode in="rough" />
            </feMerge>
          </filter>
          {/* Glow-in-the-dark: the painted shape plus a soft, faint red light around it. */}
          <filter
            id={glow}
            x={-pad}
            y={-pad}
            width={w}
            height={h}
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="1.3"
              result="wideBlur"
            />
            <feComponentTransfer in="wideBlur" result="wide">
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0.5"
              result="nearBlur"
            />
            <feComponentTransfer in="nearBlur" result="near">
              <feFuncA type="linear" slope="0.55" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="wide" />
              <feMergeNode in="near" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {mode === "static" ? (
          <g filter={`url(#${spray})`}>
            <Paint color="#E5484D" drips="none" />
          </g>
        ) : (
          <>
            {/* At rest: dark paint on a dark wall. */}
            <g filter={`url(#${spray})`}>
              <Paint color="#2b2b2b" drips="none" />
            </g>
            {/* Lit: the same graffiti glowing red. */}
            <g className="glow-lit" filter={`url(#${glow})`}>
              <g filter={`url(#${spray})`}>
                <Paint color="#ff3d48" drips="dripping" />
              </g>
            </g>
          </>
        )}
      </svg>
    </span>
  );
}
