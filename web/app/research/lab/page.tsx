import type { Metadata } from "next";

import ResearchLabClient from "@/components/research-lab/ResearchLabClient";

export const metadata: Metadata = {
  title: "কোরআন গবেষণাগার",
  description:
    "Al-Bayyinah — ভাষাবিজ্ঞান, অন্টোলজি, সিমান্টিক সার্চ, মুনাসাবাহ, কালানুক্রম, কিরাআত, তাফসীর ও গবেষকের ওয়ার্কস্পেসের মডিউল হাব।",
};

export default function ResearchLabPage() {
  return <ResearchLabClient />;
}
