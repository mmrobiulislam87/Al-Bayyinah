"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import Level1VisualAlphabet from "@/components/fundamentals/Level1VisualAlphabet";
import WritingTracePlaceholder from "@/components/fundamentals/WritingTracePlaceholder";
import { useSpeechRecognitionFundamentals } from "@/hooks/useSpeechRecognitionFundamentals";
import { hijaiLettersWithNames } from "@/lib/learnAlphabetSets";
import { awardLearnStepIfFirstToday, learnRewardAmounts } from "@/lib/learnRewards";
import { toBengaliDigits } from "@/lib/numberBn";
import { useLearnFundamentalsStore } from "@/stores/learnFundamentalsStore";

type SectionId = "L1" | "L2" | "L3" | "trace" | "speech";

export default function LearnFundamentalsClient() {
  const pool = useMemo(() => hijaiLettersWithNames(), []);
  const rehydrated = useRef(false);
  const gateRewarded = useRef(false);

  const xp = useLearnFundamentalsStore((s) => s.xp);
  const gates = useLearnFundamentalsStore((s) => s.gates);
  const hearBest = useLearnFundamentalsStore((s) => s.hearPickStreakBest);
  const totalCorrect = useLearnFundamentalsStore((s) => s.totalQuizCorrect);
  const resetProgress = useLearnFundamentalsStore((s) => s.resetProgress);

  const [section, setSection] = useState<SectionId>("L1");
  const [toast, setToast] = useState<string | null>(null);
  const speech = useSpeechRecognitionFundamentals();

  useEffect(() => {
    if (rehydrated.current) return;
    rehydrated.current = true;
    void useLearnFundamentalsStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!gates.L2 || gateRewarded.current) return;
    gateRewarded.current = true;
    const gained = awardLearnStepIfFirstToday("fundamentals_l1_gate");
    if (gained > 0) {
      setToast(
        `লেভেল ১ গেট খুলেছে · +${toBengaliDigits(gained)} হিকমাহ (আজ প্রথমবার)`,
      );
    }
  }, [gates.L2]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const rewardHint = learnRewardAmounts().fundamentals_l1_gate;

  const nav: { id: SectionId; label: string; blurb: string }[] = [
      {
        id: "L1",
        label: "লেভেল ১ · দৃশ্য বর্ণ",
        blurb: "২৯ হরফ, মাইক্রো কুইজ, মোশন।",
      },
      {
        id: "L2",
        label: "লেভেল ২ · মখরজ",
        blurb: gates.L2
          ? "পরবর্তী অ্যানিম মানচিত্র।"
          : "গেট খোলার শর্ত: অন্বেষণ টাচ ও শুনে বাছুন।",
      },
      {
        id: "L3",
        label: "লেভেল ৩ · হরকত",
        blurb: "ফাতহা/কাসরা/ডাম্ম শীঘ্রই।",
      },
      {
        id: "trace",
        label: "ট্রেস ল্যাব",
        blurb: "হাতের স্মৃতি।",
      },
      {
        id: "speech",
        label: "স্পিচ আর্কিটেকচার",
        blurb: "মাইক API প্রস্তুতি।",
      },
    ];

  function goSection(id: SectionId) {
    setSection(id);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95 lg:flex-row lg:px-6">
      <aside className="hidden w-[min(260px,32%)] shrink-0 flex-col rounded-3xl border border-[var(--islamic-teal)]/15 bg-white/65 p-4 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/40 lg:flex">
        <h2 className="font-[family-name:var(--font-bn)] text-sm font-bold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          কোর্স খোলাসমূহ
        </h2>
        <p className="mt-2 font-[family-name:var(--font-bn)] text-[11px] leading-snug text-[var(--islamic-ink-soft)] dark:text-teal-400/88">
          মাইক্রো সেশন — প্রতি ব্লক ~৫ মিনিটের মেন্টাল ফ্যাটিগ টার্গেট।
        </p>
        <nav className="mt-4 flex flex-col gap-2" aria-label="শেখার স্তর">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goSection(item.id)}
              className={`rounded-2xl border px-3 py-2.5 text-left font-[family-name:var(--font-bn)] text-xs transition ${
                section === item.id
                  ? "border-[var(--islamic-gold)]/60 bg-[var(--islamic-teal-deep)]/92 text-white shadow dark:bg-teal-800"
                  : item.id === "L2" && !gates.L2 && section !== item.id
                    ? "border-amber-300/55 bg-amber-50/30 dark:border-amber-800/40 dark:bg-amber-950/20"
                    : "border-[var(--islamic-teal)]/18 bg-white/80 hover:brightness-95 dark:border-teal-800/40 dark:bg-teal-950/50"
              }`}
            >
              <span className="block font-semibold">{item.label}</span>
              <span className="mt-0.5 block text-[10px] font-normal opacity-90">{item.blurb}</span>
            </button>
          ))}
        </nav>
        <div className="mt-4 space-y-2 border-t border-[var(--islamic-teal)]/10 pt-4 dark:border-teal-800/35">
          <p className="font-[family-name:var(--font-bn)] text-[11px] text-[var(--islamic-ink-soft)] dark:text-teal-400">
            XP: {toBengaliDigits(xp)} · শুনে বাছুন সেরা ধারা:{" "}
            {toBengaliDigits(hearBest)} · মোট সঠিক কুইজ: {toBengaliDigits(totalCorrect)}
          </p>
          <p className="font-[family-name:var(--font-bn)] text-[10px] text-[var(--islamic-ink-soft)] dark:text-teal-500">
            লেভেল ১ গেট খুললে প্রথমবার +{toBengaliDigits(rewardHint)} হিকমাহ (দিনে একবার)।
          </p>
          <Link
            href="/learn/games"
            className="inline-flex font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal-deep)] underline-offset-4 hover:underline dark:text-amber-200/95"
          >
            আরও খেলা ও অনুশীলন →
          </Link>
        </div>
      </aside>

      <div className="mb-4 flex w-full gap-1 overflow-x-auto pb-1 lg:hidden">
        {nav.map((item) => (
          <button
            key={`m-${item.id}`}
            type="button"
            onClick={() => goSection(item.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 font-[family-name:var(--font-bn)] text-[10px] font-semibold ${
              section === item.id
                ? "bg-[var(--islamic-teal-deep)] text-white"
                : "border border-[var(--islamic-teal)]/25 bg-white/80 dark:bg-teal-950/50"
            } ${item.id === "L2" && !gates.L2 ? "ring-2 ring-amber-400/50" : ""}`}
          >
            {item.label.split("·")[0]?.trim()}
          </button>
        ))}
      </div>

      <main className="order-3 min-w-0 flex-1 space-y-6 lg:order-none">
        <header className="rounded-3xl border border-[var(--islamic-teal)]/12 bg-gradient-to-br from-white/90 via-white/80 to-[var(--islamic-parchment)]/70 p-5 shadow-sm dark:border-teal-800/40 dark:from-teal-950/80 dark:via-teal-950/70 dark:to-teal-950/50 sm:p-7">
          <h1 className="font-[family-name:var(--font-bn)] text-xl font-bold text-[var(--islamic-teal-deep)] dark:text-teal-50 sm:text-2xl">
            নিউ-জেন আরবি ফান্ডামেন্টালস
          </h1>
          <p className="mt-2 max-w-2xl font-[family-name:var(--font-bn)] text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
            শিখুন → শুনুন → বোঝান → তৈরি করুন → পরীক্ষা → পুরস্কার। একবারে এক ধারণা ও তাৎক্ষণিক প্রতিক্রিয়া —
            মোশন-জোর স্মৃতির জন্য ডিজাইন করা ল্যাব ।
          </p>
          {toast ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-[var(--islamic-gold)]/45 bg-[var(--islamic-gold)]/20 px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-50"
            >
              {toast}
            </motion.p>
          ) : null}
        </header>

        {section === "L1" ? <Level1VisualAlphabet pool={pool} /> : null}

        {section === "L2" ? (
          <section className="rounded-3xl border border-[var(--islamic-gold)]/35 bg-white/82 p-5 dark:border-amber-800/35 dark:bg-teal-950/45">
            {!gates.L2 ? (
              <p className="mb-4 rounded-xl border border-amber-400/45 bg-amber-50/50 px-4 py-2 font-[family-name:var(--font-bn)] text-sm dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-100">
                এই স্তরের গেট খোলেনি · লেভেল ১-এ আরও কিছুটা অন্বেষণ করুন ও শুনে বাছুন কুইজ চালিয়ে সাফল্যের সংখ্যা বাড়ান ।
              </p>
            ) : null}
            <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
              মখরজ ও উচ্চারণ ল্যাব
            </h2>
            <p className="mt-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400">
              জিভ ও বাতাসের অ্যানিম, ধীর অডিও ও তুলনামূলক সূত্র এই স্তরে যুক্ত হবে । মৌখিক মডেলের খোদকার্ট SVG
              আগেই উপাদানগুলোয় বসেছে — লেভেল ১ এ হরফ বেছে মুখের কার্ড দেখুন ।
            </p>
          </section>
        ) : null}

        {section === "L3" ? (
          <section className="rounded-3xl border border-[var(--islamic-teal)]/15 bg-white/75 p-5 dark:bg-teal-950/35">
            <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold dark:text-teal-200">
              হরকত ইঞ্জিন
            </h2>
            <p className="mt-2 font-[family-name:var(--font-bn)] text-sm dark:text-teal-400">
              শীঘ্রই — ডাইনামিক ফাতহা, কাসরা, ডাম্ম ।
            </p>
          </section>
        ) : null}

        {section === "trace" ? <WritingTracePlaceholder /> : null}

        {section === "speech" ? (
          <section className="rounded-3xl border border-[var(--islamic-teal)]/15 bg-white/85 p-5 dark:bg-teal-950/45">
            <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold dark:text-teal-100">
              ভবিষ্যৎ স্পিচ স্কোরিং আর্কিটেকচার
            </h2>
            <p className="mt-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400">
              ব্রাউজার মাইক স্ট্রিম এখানে শুধু প্রস্তাবমূলক । টেন্সরফ্লো বা ফোনেটিক স্তর ছাড়াই হুক সংরক্ষণ ।
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!speech.supported || speech.isListening}
                onClick={() => speech.start("ar-SA")}
                className="rounded-xl bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white disabled:opacity-40 dark:bg-teal-800"
              >
                {speech.isListening ? "শোনা হচ্ছে…" : "আরবিতে শুনতে শুরু"}
              </button>
              <button
                type="button"
                disabled={!speech.isListening}
                onClick={() => speech.stop()}
                className="rounded-xl border px-4 py-2 font-[family-name:var(--font-bn)] text-sm dark:border-teal-700 dark:text-teal-100"
              >
                থামান
              </button>
            </div>
            {speech.error ? (
              <p className="mt-3 font-[family-name:var(--font-bn)] text-xs text-red-700 dark:text-red-300">
                {speech.error}
              </p>
            ) : null}
            {speech.transcript ? (
              <p className="mt-3 font-[family-name:var(--font-bn)] text-sm dark:text-teal-100">
                {speech.transcript}
              </p>
            ) : null}
          </section>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--islamic-teal)]/10 bg-white/55 px-4 py-3 dark:border-teal-800/40 dark:bg-teal-950/30">
          <p className="font-[family-name:var(--font-bn)] text-[11px] text-[var(--islamic-ink-soft)] dark:text-teal-500">
            অগ্রগতি এই মডিউলে ডিভাইস লোকালে জমে (localStorage) ।
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm("ফান্ডামেন্টালসের জমাটা মুছে ফেলব?")
              ) {
                resetProgress();
                gateRewarded.current = false;
              }
            }}
            className="rounded-lg border border-red-600/35 px-3 py-1.5 font-[family-name:var(--font-bn)] text-[11px] text-red-800 dark:border-red-500/40 dark:text-red-300"
          >
            মডিউল রিসেট
          </button>
        </div>
      </main>
    </div>
  );
}
