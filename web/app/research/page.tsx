import type { Metadata } from "next";

import ResearchDashboardLazy from "@/components/ResearchDashboardLazy";

export const metadata: Metadata = {
  title: "রিসার্চ ড্যাশবোর্ড",
};

export default function ResearchPage() {
  return <ResearchDashboardLazy />;
}
