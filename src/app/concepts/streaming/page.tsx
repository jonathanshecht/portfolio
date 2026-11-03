import type { Metadata } from "next";
import { StreamingConcept } from "@/components/concepts/streaming";

export const metadata: Metadata = { title: "Concept: Streaming" };

export default function Page() {
  return <StreamingConcept />;
}
