"use client";

import dynamic from "next/dynamic";

const ResearchDashboardClient = dynamic(
  () => import("@/components/ResearchDashboardClient"),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 font-[family-name:var(--font-bn)] text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
        রিসার্চ চার্ট লোড হচ্ছে…
      </div>
    ),
  },
);

export default function ResearchDashboardLazy() {
  return <ResearchDashboardClient />;
}
