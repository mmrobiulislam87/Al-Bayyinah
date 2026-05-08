"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import AlphabetDragExercise from "@/components/AlphabetDragExercise";
import { toBengaliDigits } from "@/lib/numberBn";
import {
  ALPHABET_GAME_ROUNDS,
  ALPHABET_ROUND_TITLES_BN,
} from "@/lib/learnAlphabetSets";
import {
  awardLearnStepIfFirstToday,
  learnRewardAmounts,
  type LearnRewardStep,
} from "@/lib/learnRewards";

const AMOUNTS = learnRewardAmounts();

const ROUND_KEYS: LearnRewardStep[] = [
  "alphabet_round_1",
  "alphabet_round_2",
  "alphabet_round_3",
  "alphabet_round_4",
];

export default function ExtraAlphabetClient() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const pairs = ALPHABET_GAME_ROUNDS[roundIdx] ?? ALPHABET_GAME_ROUNDS[0]!;
  const roundTitle = ALPHABET_ROUND_TITLES_BN[roundIdx] ?? ALPHABET_ROUND_TITLES_BN[0];

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const onRoundSolved = useCallback(() => {
    const key = ROUND_KEYS[roundIdx];
    if (!key) return;
    const gained = awardLearnStepIfFirstToday(key);
    if (gained > 0) {
      setToast(
        `+${toBengaliDigits(gained)} হিকমাহ পয়েন্ট · ${roundTitle}`,
      );
    }
  }, [roundIdx, roundTitle]);

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

      <header className="mb-8 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          সম্পূর্ণ হিজাই হরফ — চার রাউন্ড
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
          মোট{" "}
          <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/95">
            ২৮টি
          </strong>{" "}
          আলাদা হরফ হিজাই ক্রমে। প্রতিটি ছবি ও আরবি শব্দ একই হরফ দিয়ে শুরু — মিলিয়ে
          মনে রাখা সহজ। প্রত্যেক রাউন্ড আজ প্রথমবার শেষ করলে সর্বোচ্চ{" "}
          <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/95">
            +{toBengaliDigits(AMOUNTS.alphabet_round_1)} হিকমাহ (প্রতি রাউন্ড)
          </strong>{" "}
          ওয়ালেটে যোগ হতে পারে।
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

      <div className="mb-6 flex flex-wrap gap-2">
        {ALPHABET_ROUND_TITLES_BN.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setRoundIdx(i)}
            aria-pressed={roundIdx === i}
            className={`rounded-xl px-3 py-2 font-[family-name:var(--font-bn)] text-xs font-semibold transition sm:text-sm ${
              roundIdx === i
                ? "bg-[var(--islamic-teal-deep)] text-white shadow-md dark:bg-teal-800"
                : "border border-[var(--islamic-teal)]/25 bg-white/80 hover:bg-[var(--islamic-parchment)]/70 dark:border-teal-700/45 dark:bg-teal-950/50 dark:hover:bg-teal-900/70"
            }`}
          >
            রাউন্ড {toBengaliDigits(i + 1)}
          </button>
        ))}
      </div>

      <section className="mb-10 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/85 p-5 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/50">
        <h2 className="mb-4 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
          {roundTitle}
        </h2>
        <AlphabetDragExercise
          key={roundIdx}
          pairs={pairs}
          onSolved={onRoundSolved}
        />
      </section>

      <div className="flex flex-wrap justify-between gap-3 border-t border-[var(--islamic-teal)]/15 pt-6 dark:border-teal-800/35">
        <Link
          href="/learn/games/ligatures"
          className="rounded-xl bg-[var(--islamic-teal-deep)] px-5 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-white hover:brightness-110 dark:bg-teal-800"
        >
          যুক্তবর্ণ গ্যালারি →
        </Link>
        <Link
          href="/learn/games"
          className="rounded-lg border border-[var(--islamic-teal)]/30 px-4 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal-deep)] hover:bg-[var(--islamic-parchment)]/60 dark:border-teal-700/50 dark:text-teal-200"
        >
          তালিকায় ফিরুন
        </Link>
      </div>
    </div>
  );
}
