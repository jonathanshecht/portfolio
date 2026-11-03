import type { Metadata } from "next";
import { NowPlayingConcept } from "@/components/concepts/now-playing";
import { tracks } from "@/data/tracks";
import { getCaseStudy, type Block } from "@/lib/case-studies";

export const metadata: Metadata = { title: "Concept: Now Playing" };

const plain = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// "Lyrics" are the headline beats of each case study: the problem, the solution and the results.
function lyricsFor(blocks: Block[]) {
  const lines: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "eyebrow" && /^(problem|solution)$/i.test(b.text) && blocks[i + 1]?.type === "title") {
      lines.push(plain((blocks[i + 1] as { html: string }).html));
    }
    if (b.type === "stats" && lines.length < 6) {
      for (const s of b.items.slice(0, 2)) lines.push(`${s.value} ${s.label}`);
      break;
    }
  }
  return lines.slice(0, 5);
}

export default function Page() {
  const lyrics: Record<string, string[]> = {};
  for (const t of tracks) {
    const study = getCaseStudy(t.slug);
    if (study) lyrics[t.slug] = lyricsFor(study.blocks);
  }
  return <NowPlayingConcept lyrics={lyrics} />;
}
