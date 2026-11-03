import type { Metadata } from "next";
import { DawConcept } from "@/components/concepts/daw";

export const metadata: Metadata = { title: "Concept: DAW" };

export default function Page() {
  return <DawConcept />;
}
