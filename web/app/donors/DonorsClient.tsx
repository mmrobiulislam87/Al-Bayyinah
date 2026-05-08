"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import BkashDonateButton from "@/components/BkashDonateButton";

function BkashStatusBanner() {
  const sp = useSearchParams();
  const msg = useMemo(() => {
    const bk = sp.get("bkash");
    const trx = sp.get("trx");
    if (bk === "ok")
      return {
        tone: "ok" as const,
        text:
          trx != null && trx !== ""
            ? `অনুদান সম্পন্ন। ট্রানজেকশন আইডি: ${trx}`
            : "অনুদান সম্পন্ন। ধন্যবাদ।",
      };
    if (bk === "cancel") return { tone: "warn" as const, text: "লেনদেন বাতিল করা হয়েছে।" };
    if (bk === "failure") return { tone: "warn" as const, text: "লেনদেন ব্যর্থ। আবার চেষ্টা করুন।" };
    if (bk === "execute_error")
      return {
        tone: "warn" as const,
        text: "বিকাশ থেকে ফিরে এসেছেন, কিন্তু সার্ভারে নিশ্চিতকরণ (execute) সম্পন্ন হয়নি। সাপোর্টে জানান।",
      };
    if (bk === "missing") return { tone: "warn" as const, text: "পেমেন্ট তথ্য পাওয়া যায়নি।" };
    if (bk) return { tone: "warn" as const, text: `স্ট্যাটাস: ${bk}` };
    return null;
  }, [sp]);

  if (!msg) return null;
  const cls =
    msg.tone === "ok"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
      : "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100";
  return (
    <p
      className={`mb-6 rounded-lg border px-4 py-3 font-[family-name:var(--font-bn)] text-sm ${cls}`}
      role="status"
    >
      {msg.text}
    </p>
  );
}

export default function DonorsClient() {
  return (
    <>
      <Suspense fallback={null}>
        <BkashStatusBanner />
      </Suspense>
      <BkashDonateButton defaultAmount={100} />
    </>
  );
}
