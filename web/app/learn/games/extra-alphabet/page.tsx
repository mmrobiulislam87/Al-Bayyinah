import type { Metadata } from "next";

import ExtraAlphabetClient from "@/components/ExtraAlphabetClient";

export const metadata: Metadata = {
  title: "সম্পূর্ণ হরফ অনুশীলন — চার রাউন্ড",
};

export default function ExtraAlphabetPage() {
  return <ExtraAlphabetClient />;
}
