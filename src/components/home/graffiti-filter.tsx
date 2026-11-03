// The sprayed-on look of the graffiti JS mark (same recipe as its "spray" filter in
// js-mark.tsx, scaled up a little): solid paint with slightly rough, wobbly edges, plus a fine
// speckle of overspray just around them. Render this once on a page, then use it on anything
// with [filter:url(#graffiti-spray)].
export function GraffitiFilter() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id="graffiti-spray" x="-5%" y="-15%" width="110%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed="4"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="1.1"
          xChannelSelector="R"
          yChannelSelector="G"
          result="rough"
        />
        <feGaussianBlur in="rough" stdDeviation="1.1" result="halo" />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="2.6"
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
        <feComposite in="halo" in2="dots" operator="in" result="overspray" />
        <feMerge>
          <feMergeNode in="overspray" />
          <feMergeNode in="rough" />
        </feMerge>
      </filter>
    </svg>
  );
}
