// My name as a neon sign: at rest it's plain white, like the rest of the heading, and when it's
// switched on, a red copy flickers on over it and glows like neon. The red copy is drawn by CSS
// from data-text, so the name is only in the page once. The About portrait switches it on
// (data-on) while the ghost has the earbud. Styles are .glow-name in globals.css.
export function GlowName({ children }: { children: string }) {
  return (
    <span data-glow-name data-text={children} className="glow-name">
      <span className="glow-name-paint">{children}</span>
    </span>
  );
}
