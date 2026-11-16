// Velo's design foundations at a glance, from the style guide in Figma: one strip of the main colors
// and the two typefaces. Kept short on purpose; the components below show the system in use.

type Group = { label: string; colors: string[]; grow?: number };

const groups: Group[] = [
  {
    label: "Neutrals",
    colors: ["#0B0B0E", "#22222B", "#70708F", "#D4D4DD", "#F1F1F4"],
  },
  { label: "Primary", colors: ["#F9FF8A"], grow: 2 },
  { label: "Feedback", colors: ["#10B77F", "#EF4343"] },
];

export function DesignFoundations({ headingFont }: { headingFont: string }) {
  return (
    <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto] sm:gap-12">
      <div
        className="flex gap-3"
        role="img"
        aria-label="Colors: five neutrals from near-black to near-white, a pale yellow primary, and green and red for feedback"
      >
        {groups.map((g) => (
          <div
            key={g.label}
            style={{ flexGrow: g.grow ?? g.colors.length }}
            className="basis-0"
          >
            <div className="flex h-14 overflow-hidden rounded-md border border-white/10">
              {g.colors.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <p className="mt-2 text-xs text-white/50">{g.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        <div>
          <p className={`${headingFont} text-4xl leading-none font-semibold`}>
            Aa
          </p>
          <p className="mt-2 text-xs text-white/50">Outfit · headings</p>
        </div>
        <div>
          <p className="font-sans text-4xl leading-none">Aa</p>
          <p className="mt-2 text-xs text-white/50">Inter · body</p>
        </div>
      </div>
    </div>
  );
}
