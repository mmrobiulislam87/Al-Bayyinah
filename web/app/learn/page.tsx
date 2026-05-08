import type { Metadata } from "next";

import LearnModuleClient from "@/components/LearnModuleClient";

export const metadata: Metadata = {
  title: "শেখা — সহজে ধাপে ধাপে",
};

export default function LearnPage() {
  return <LearnModuleClient />;
}
