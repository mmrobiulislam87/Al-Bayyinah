import type { Metadata } from "next";

import LearnGamesHubClient from "@/components/LearnGamesHubClient";

export const metadata: Metadata = {
  title: "শেখার খেলা ও অনুশীলন",
};

export default function LearnGamesPage() {
  return <LearnGamesHubClient />;
}
