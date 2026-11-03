import type { Metadata } from "next";
import { LogoLab } from "@/components/concepts/logo-lab";

export const metadata: Metadata = { title: "Concept: Logo" };

export default function Page() {
  return <LogoLab />;
}
