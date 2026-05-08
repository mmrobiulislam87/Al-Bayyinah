"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { toBengaliDigits } from "@/lib/numberBn";
import {
  addPoints,
  donatePoints,
  pointsToGiftUnits,
  readWallet,
  redeemPoints,
  type WalletPersist,
} from "@/lib/walletLocal";

const WALLET_EMPTY: WalletPersist = { points: 0, charityTransferred: 0 };

export default function WalletClient() {
  const [w, setW] = useState<WalletPersist>(WALLET_EMPTY);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setW(readWallet());
  }, []);

  const giftUnits = useMemo(() => pointsToGiftUnits(w.points), [w.points]);

  const refresh = useCallback(() => setW(readWallet()), []);

  const onQuizWin = useCallback(() => {
    setW(addPoints(25));
    setNote("কুইজ জয়ের জন্য +২৫ হিকমাহ পয়েন্ট (ডেমো)।");
  }, []);

  const onClaim = useCallback(async () => {
    const amt = Math.min(w.points, 50);
    if (amt < 10) {
      setNote("কমপক্ষে ১০ পয়েন্ট লাগবে রিডিমের জন্য।");
      return;
    }
    const res = await fetch("/api/wallet/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: amt }),
    });
    const j = (await res.json()) as { ok?: boolean };
    if (!j.ok) {
      setNote("রিডিম ব্যর্থ।");
      return;
    }
    const next = redeemPoints(amt);
    if (next) setW(next);
    setNote(`গিফট ক্লেইম (ডেমো): ${toBengaliDigits(amt)} পয়েন্ট কাটা হয়েছে।`);
  }, [w.points]);

  const onDonate = useCallback(async () => {
    if (w.points < 1) {
      setNote("দান করার মতো পয়েন্ট নেই।");
      return;
    }
    const amt = w.points;
    const res = await fetch("/api/wallet/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: amt }),
    });
    const j = (await res.json()) as { ok?: boolean };
    if (!j.ok) {
      setNote("দান রেকর্ড ব্যর্থ।");
      return;
    }
    const next = donatePoints(amt);
    if (next) setW(next);
    setNote(`সাদাকাহ ফান্ডে ${toBengaliDigits(amt)} পয়েন্ট স্থানান্তর (ডেমো)।`);
  }, [w.points]);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="mb-8 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          হিকমাহ ওয়ালেট
        </h1>
        <p className="mt-1 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
          ডেমো: ডাটা ব্রাউজারে সংরক্ষিত। পরবর্তীতে সাপাবেস ও পেমেন্ট গেটওয়ে যুক্ত করুন।
        </p>
      </header>

      <section className="mb-6 grid gap-4 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/85 p-6 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/50 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--islamic-teal)]/80 dark:text-teal-400/90">
            অর্জিত পয়েন্ট
          </p>
          <p className="mt-1 font-[family-name:var(--font-bn)] text-3xl font-bold text-[var(--islamic-teal-deep)] dark:text-amber-200">
            {toBengaliDigits(w.points)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--islamic-teal)]/80 dark:text-teal-400/90">
            সমতুল্য হাদিয়া (ডেমো স্কেল)
          </p>
          <p className="mt-1 font-[family-name:var(--font-bn)] text-3xl font-bold text-[var(--islamic-teal-deep)] dark:text-teal-100">
            {toBengaliDigits(giftUnits)} একক
          </p>
          <p className="mt-1 text-xs text-[var(--islamic-ink-soft)] dark:text-teal-500/90">
            নিয়ম: ১০ পয়েন্ট = ১ একক (পরিবর্তনযোগ্য)
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
            মোট সাদাকাহয় স্থানান্তরিত (ডেমো):{" "}
            <span className="font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-200">
              {toBengaliDigits(w.charityTransferred)}
            </span>
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onQuizWin}
          className="rounded-lg border border-[var(--islamic-teal)]/30 bg-white px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold dark:bg-teal-900/40"
        >
          কুইজ জিতলাম (ডেমো +২৫)
        </button>
        <button
          type="button"
          onClick={() => {
            void onClaim();
          }}
          className="rounded-lg bg-[var(--islamic-gold)] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] shadow hover:brightness-105"
        >
          Claim Gift
        </button>
        <button
          type="button"
          onClick={() => {
            void onDonate();
          }}
          className="rounded-lg bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow hover:brightness-110 dark:bg-teal-800"
        >
          Donate to Charity
        </button>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg px-4 py-2 text-sm text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-300"
        >
          রিফ্রেশ
        </button>
      </div>

      {note ? (
        <p className="mt-6 rounded-lg border border-[var(--islamic-teal)]/20 bg-[var(--islamic-parchment)]/60 px-4 py-3 font-[family-name:var(--font-bn)] text-sm dark:border-teal-800/40 dark:bg-teal-950/50">
          {note}
        </p>
      ) : null}
    </div>
  );
}
