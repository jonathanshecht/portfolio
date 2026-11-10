// Turns a list of points into a hand-drawn line for SVG: each segment bows slightly, alternating
// sides, so a zigzag reads as a doodle rather than a precise lightning bolt. The wobble is fixed,
// so the same points always draw the same line. Used for the piano's cracks.
export type Pt = [number, number];

export function doodle(points: Pt[]) {
  return points
    .map(([x, y], i) => {
      if (i === 0) return `M${x} ${y}`;
      const [px, py] = points[i - 1];
      const len = Math.hypot(x - px, y - py) || 1;
      const bow = (i % 2 ? 1 : -1) * Math.min(1.4, len * 0.12);
      const cx = (px + x) / 2 + (-(y - py) / len) * bow;
      const cy = (py + y) / 2 + ((x - px) / len) * bow;
      return `Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x} ${y}`;
    })
    .join(" ");
}
