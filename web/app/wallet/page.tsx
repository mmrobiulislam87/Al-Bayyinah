import type { Metadata } from "next";

import WalletClient from "@/components/WalletClient";

export const metadata: Metadata = {
  title: "হিকমাহ ওয়ালেট",
};

export default function WalletPage() {
  return <WalletClient />;
}
