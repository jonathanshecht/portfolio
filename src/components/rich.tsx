import type { ElementType } from "react";

// Renders inline HTML from the portfolio content files (marks, bold, italics, links).
// Content comes from this repo only, never from visitors.
export function Rich({ html, as: Tag = "span", className }: { html: string; as?: ElementType; className?: string }) {
  return <Tag className={`rich ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
