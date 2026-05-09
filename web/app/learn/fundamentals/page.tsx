import type { Metadata } from "next";

import LearnFundamentalsClient from "@/components/fundamentals/LearnFundamentalsClient";

export const metadata: Metadata = {
  title: "ফান্ডামেন্টালস · আরবি বর্ণ ও কুইজ",
  description:
    "আরবি বর্ণ অন্বেষণ, মাইক্রো কুইজ, মোশন ও পুরস্কার — কুরআনী পাঠের ভিত্তি শেখা ল্যাব ।",
};

export default function LearnFundamentalsPage() {
  return <LearnFundamentalsClient />;
}
