"use client";

import { useCallback, useState } from "react";

import { toBengaliDigits } from "@/lib/numberBn";

type Props = {
  defaultAmount?: number;
  payerReference?: string;
};

/**
 * bKash Checkout (URL) — সার্ভারে create, তারপর bKash পেজে রিডিরেক্ট।
 */
export default function BkashDonateButton({ defaultAmount = 100, payerReference }: Props) {
  const [amount, setAmount] = useState(String(defaultAmount));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pay = useCallback(async () => {
    const n = Number.parseFloat(amount);
    if (!Number.isFinite(n) || n < 1) {
      setErr("সঠিক টাকার পরিমাণ লিখুন।");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/payments/bkash/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: n,
          ...(payerReference?.trim() ? { payerReference: payerReference.trim() } : {}),
        }),
      });
      const text = await res.text();
      let j: {
        ok?: boolean;
        bkashURL?: string;
        error?: string;
        message?: string;
        detail?: string;
      } = {};
      try {
        j = text ? (JSON.parse(text) as typeof j) : {};
      } catch {
        setErr(
          res.ok
            ? "সার্ভারের উত্তর পড়া যায়নি। কনসোল/নেটওয়ার্ক ট্যাব দেখুন।"
            : `সার্ভার ত্রুটি (${res.status})। ডেভ সার্ভার চালু আছে কিনা দেখুন।`,
        );
        return;
      }
      if (!res.ok || !j.ok || !j.bkashURL) {
        setErr(j.message ?? j.error ?? "পেমেন্ট শুরু করা যায়নি।");
        return;
      }
      window.location.assign(j.bkashURL);
    } catch (cause) {
      const name = cause instanceof TypeError ? cause.message : "";
      if (name.includes("Failed to fetch") || name.includes("NetworkError")) {
        setErr("সার্ভারে যোগাযোগ ব্যর্থ। `npm run dev` চলছে এবং ঠিক পোর্টে সাইট খোলা আছে কিনা দেখুন।");
        return;
      }
      setErr("অপ্রত্যাশিত ত্রুটি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }, [amount, payerReference]);

  return (
    <div className="rounded-xl border border-[var(--islamic-teal)]/20 bg-[var(--islamic-parchment)]/50 p-4 dark:border-teal-800/40 dark:bg-teal-950/40">
      <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
        bKash দিয়ে অনুদান (Checkout URL)
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
          পরিমাণ (BDT)
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 rounded border border-[var(--islamic-teal)]/25 bg-white px-2 py-1.5 text-[var(--islamic-ink)] dark:border-teal-700/50 dark:bg-teal-900/30 dark:text-teal-50"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void pay()}
          className="rounded-lg bg-[#E2136E] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow hover:brightness-105 disabled:opacity-60"
        >
          {busy ? "অপেক্ষা…" : `bKash — ${toBengaliDigits(Number.parseFloat(amount) || 0)} ৳`}
        </button>
      </div>
      <p className="mt-2 text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
        লেনদেন নিরাপদে bKash পেজে সম্পন্ন হয়। সফল হলে আপনি ডোনার পেজে ফিরে আসবেন।
      </p>
      {err ? (
        <p className="mt-2 font-[family-name:var(--font-bn)] text-sm text-red-700 dark:text-red-300">
          {err}
        </p>
      ) : null}
    </div>
  );
}
