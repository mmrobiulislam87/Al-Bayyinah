import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "শেখা",
  description: "ফান্ডামেন্টালস ল্যাবে আরবি বর্ণ শেখার প্রবেশ দ্বার ।",
};

export default function LearnPage() {
  redirect("/learn/fundamentals");
}
