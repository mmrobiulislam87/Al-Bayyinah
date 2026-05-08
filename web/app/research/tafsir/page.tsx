import type { Metadata } from "next";

import ResearchTafsirClient from "@/components/ResearchTafsirClient";

export const metadata: Metadata = {
  title: "তাফসীর হাব",
  description:
    "আয়াত ও বহিরাগত তাফসীর/গবেষণা সম্পদের লিঙ্ক — Al-Bayyinah",
};

export default function ResearchTafsirPage() {
  return <ResearchTafsirClient />;
}
