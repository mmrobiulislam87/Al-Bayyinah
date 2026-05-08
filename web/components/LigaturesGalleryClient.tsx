"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { toBengaliDigits } from "@/lib/numberBn";
import {
  awardLearnStepIfFirstToday,
  learnRewardAmounts,
} from "@/lib/learnRewards";

const AMOUNTS = learnRewardAmounts();

type Combo = {
  id: string;
  left: string;
  right: string;
  fusion: string;
  titleBn: string;
};

const COMBOS: Combo[] = [
  {
    id: "lam-alif",
    left: "ل",
    right: "ا",
    fusion: "لا",
    titleBn: "লাম ও আলিফ মিলে যুক্ত রূপ لا",
  },
  {
    id: "ya-alif",
    left: "ي",
    right: "ا",
    fusion: "يا",
    titleBn: "ইয়া‘ ও আলিফ মিলে যুক্ত ইয়া রূপ",
  },
  {
    id: "waw-ha",
    left: "و",
    right: "ه",
    fusion: "وه",
    titleBn: "ওয়াও ও হা‘ মিলে অনুশীলনী যুক্ত রূপ",
  },
];

const motionStageVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.08 },
  },
};

const motionGlyphVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 24 },
  },
};

const motionFusionVariants = {
  hidden: { opacity: 0, scale: 0.75, rotate: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

export default function LigaturesGalleryClient() {
  const [index, setIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const combo = COMBOS[index] ?? COMBOS[0]!;

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [toast]);

  /** শেষ স্লাইডে প্রথম আগমনে দৈনিক পুরস্কার */
  useEffect(() => {
    if (index !== COMBOS.length - 1) return;
    const gained = awardLearnStepIfFirstToday("ligatures_round");
    if (gained > 0) {
      setToast(
        `+${toBengaliDigits(gained)} হিকমাহ পয়েন্ট · যুক্তবর্ণ গ্যালারি`,
      );
    }
  }, [index]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? COMBOS.length - 1 : i - 1));
    setReplayKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= COMBOS.length - 1 ? 0 : i + 1));
    setReplayKey((k) => k + 1);
  }, []);

  const replay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <nav className="mb-6 font-[family-name:var(--font-bn)] text-sm">
        <Link
          href="/learn/games"
          className="text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-400"
        >
          ← খেলার তালিকা
        </Link>
        <span className="mx-2 text-[var(--islamic-ink-soft)] dark:text-teal-600">
          /
        </span>
        <Link
          href="/learn"
          className="text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-400"
        >
          দৈনিক শেখা
        </Link>
      </nav>

      <header className="mb-6 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          যুক্তবর্ণ গ্যালারি
        </h1>
        <p className="mt-2 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
          একাধিক উদাহরণ দেখুন। শেষ উদাহরণ পর্যন্ত গেলে আজ প্রথমবার{" "}
          <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/95">
            +{toBengaliDigits(AMOUNTS.ligatures_round)} হিকমাহ পয়েন্ট
          </strong>{" "}
          যোগ হতে পারে। স্লাইড পরিবর্তনের সাথে অ্যানিমেশন নতুন করে চলবে।
        </p>
      </header>

      {toast ? (
        <p
          role="status"
          className="mb-6 rounded-xl border border-[var(--islamic-gold)]/55 bg-[var(--islamic-gold)]/25 px-4 py-3 text-center font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:border-amber-600/45 dark:bg-amber-900/35 dark:text-amber-100"
        >
          {toast}{" "}
          <span className="mt-1 block text-xs font-normal opacity-90">
            ওয়ালেট মেনু থেকে ব্যালেন্স দেখুন।
          </span>
        </p>
      ) : null}

      <section className="rounded-2xl border-2 border-[var(--islamic-gold)]/45 bg-gradient-to-b from-white/95 to-[var(--islamic-parchment)]/80 p-6 shadow-lg dark:border-amber-700/45 dark:from-teal-950/90 dark:to-teal-950/60 sm:p-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-bn)] text-xs font-medium text-[var(--islamic-teal)]/80 dark:text-teal-400">
              {index + 1} / {COMBOS.length}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
              {combo.titleBn}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-xl border border-[var(--islamic-teal)]/35 bg-white px-4 py-2 font-[family-name:var(--font-bn)] text-sm dark:border-teal-700/50 dark:bg-teal-900/80 dark:text-teal-50"
            >
              ← পূর্ববর্তী যুক্তবর্ণ
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-xl bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white dark:bg-teal-800"
            >
              পরবর্তী যুক্তবর্ণ →
            </button>
            <button
              type="button"
              onClick={replay}
              className="rounded-xl border-2 border-[var(--islamic-teal)]/35 bg-white px-4 py-2 font-[family-name:var(--font-bn)] text-sm dark:border-teal-700/50 dark:bg-teal-900/80 dark:text-teal-50"
            >
              আবার চালান
            </button>
          </div>
        </div>

        <div
          key={`${combo.id}-${replayKey}`}
          className="relative overflow-hidden rounded-2xl border border-[var(--islamic-teal)]/20 bg-white/90 py-10 dark:border-teal-800/50 dark:bg-teal-950/70"
        >
          <p className="absolute left-4 top-3 font-[family-name:var(--font-bn)] text-[10px] font-medium uppercase tracking-widest text-[var(--islamic-teal)]/55 dark:text-teal-500">
            Framer Motion · stagger + spring
          </p>
          <motion.div
            className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 px-4 pt-6 sm:gap-10"
            variants={motionStageVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={motionGlyphVariants}
              className="rounded-2xl bg-teal-800/12 px-8 py-6 text-7xl shadow-inner dark:bg-teal-500/15 sm:text-8xl"
              dir="rtl"
            >
              {combo.left}
            </motion.span>
            <motion.span
              variants={motionGlyphVariants}
              className="select-none text-4xl text-[var(--islamic-gold)] sm:text-5xl"
            >
              +
            </motion.span>
            <motion.span
              variants={motionGlyphVariants}
              className="rounded-2xl bg-teal-800/12 px-8 py-6 text-7xl shadow-inner dark:bg-teal-500/15 sm:text-8xl"
              dir="rtl"
            >
              {combo.right}
            </motion.span>
            <motion.span
              variants={motionGlyphVariants}
              className="select-none text-4xl text-[var(--islamic-gold)] sm:text-5xl"
            >
              →
            </motion.span>
            <motion.div
              variants={motionFusionVariants}
              layoutId={`fusion-${combo.id}`}
              className="rounded-2xl border-4 border-[var(--islamic-gold)]/70 bg-[var(--islamic-parchment)] px-10 py-7 text-8xl shadow-2xl dark:border-amber-400/50 dark:bg-teal-950/90 sm:px-14 sm:py-10 sm:text-9xl"
              dir="rtl"
            >
              {combo.fusion}
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Link
            href="/learn/games/extra-alphabet"
            className="rounded-lg border border-[var(--islamic-teal)]/30 px-4 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal-deep)] hover:bg-white/80 dark:border-teal-700/50 dark:text-teal-200"
          >
            ← আরও হরফ মিল
          </Link>
          <Link
            href="/learn"
            className="rounded-lg font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-300"
          >
            দৈনিক তিন ধাপে ফিরুন
          </Link>
        </div>
      </section>
    </div>
  );
}
