import type { Metadata } from "next";

import VoiceTutorClient from "@/components/VoiceTutorClient";

export const metadata: Metadata = {
  title: "ভয়েস টিউটর",
};

export default function TutorPage() {
  return <VoiceTutorClient />;
}
