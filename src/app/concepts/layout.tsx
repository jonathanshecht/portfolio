import type { Metadata } from "next";

// Design explorations for the music-app redesign; kept out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ConceptsLayout({ children }: LayoutProps<"/concepts">) {
  return children;
}
