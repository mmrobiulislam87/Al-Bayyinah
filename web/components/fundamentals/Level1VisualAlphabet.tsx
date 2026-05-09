"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import ArticulationMouthPlaceholder from "@/components/fundamentals/ArticulationMouthPlaceholder";
import LetterCard from "@/components/fundamentals/LetterCard";
import QuizHearPick from "@/components/fundamentals/QuizHearPick";
import QuizMatchPairs from "@/components/fundamentals/QuizMatchPairs";
import { encourageToneBn } from "@/lib/fundamentals/emotionFeedback";
import { fadeUpLetter, stageContainer } from "@/lib/fundamentals/fundamentalsMotion";
import { reviewOrder } from "@/lib/fundamentals/spacedRepetition";
import type { AlphabetPair } from "@/lib/learnAlphabetSets";
import { playLetterSound } from "@/lib/learnAudioEngine";
import type { QuizModeId } from "@/stores/learnFundamentalsStore";
import { useLearnFundamentalsStore } from "@/stores/learnFundamentalsStore";

type LabMode = "explore" | "flash" | "hear" | "match";

export default function Level1VisualAlphabet({ pool }: { pool: AlphabetPair[] }) {
  const reduce = useReducedMotion();
  const touchLetterExplore = useLearnFundamentalsStore((s) => s.touchLetterExplore);
  const reportQuizOutcome = useLearnFundamentalsStore((s) => s.reportQuizOutcome);
  const consecutiveWrongQuiz = useLearnFundamentalsStore((s) => s.consecutiveWrongQuiz);
  const mistakeWeight = useLearnFundamentalsStore((s) => s.mistakeWeight);
  const lastSeenMs = useLearnFundamentalsStore((s) => s.lastSeenMs);
  const totalQuizCorrect = useLearnFundamentalsStore((s) => s.totalQuizCorrect);
  const tryClearLevel1Gate = useLearnFundamentalsStore((s) => s.tryClearLevel1Gate);

  const [mode, setMode] = useState<LabMode>("explore");
  const [flashIdx, setFlashIdx] = useState(0);

  useEffect(() => {
    tryClearLevel1Gate();
  }, [mistakeWeight, lastSeenMs, totalQuizCorrect, tryClearLevel1Gate]);

  const flashOrder = useMemo(() => {
    const letters = pool.map((p) => p.letter);
    const sorted = reviewOrder(letters, mistakeWeight, lastSeenMs, Date.now());
    const byLetter: Record<string, AlphabetPair> = Object.fromEntries(
      pool.map((p) => [p.letter, p]),
    );
    return sorted.map((l) => byLetter[l]!).filter(Boolean);
  }, [pool, mistakeWeight, lastSeenMs]);

  useEffect(() => {
    setFlashIdx((i) => Math.min(i, Math.max(flashOrder.length - 1, 0)));
  }, [flashOrder.length]);

  const flashPair = flashOrder[flashIdx] ?? pool[0]!;

  const exploreTouch = useCallback(
    (letter: string) => {
      touchLetterExplore(letter);
      tryClearLevel1Gate();
    },
    [touchLetterExplore, tryClearLevel1Gate],
  );

  const onQuizOutcome = useCallback(
    (letter: string, ok: boolean, m: QuizModeId) => {
      reportQuizOutcome(letter, ok, m);
      tryClearLevel1Gate();
    },
    [reportQuizOutcome, tryClearLevel1Gate],
  );

  const encour = encourageToneBn(consecutiveWrongQuiz);
  const softened = encour.softenUi;

  const modeBtns: { id: LabMode; label: string }[] = [
    { id: "explore", label: "অন্বেষণ" },
    { id: "flash", label: "ফ্লাশকার্ড" },
    { id: "hear", label: "শুনে বাছুন" },
    { id: "match", label: "ছবি–হরফ মিল" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {modeBtns.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setMode(b.id)}
            className={`rounded-full px-4 py-2 font-[family-name:var(--font-bn)] text-xs font-semibold shadow-sm transition ${
              mode === b.id
                ? "bg-[var(--islamic-teal-deep)] text-white dark:bg-teal-800"
                : "border border-[var(--islamic-teal)]/25 bg-white/80 text-[var(--islamic-teal-deep)] dark:border-teal-800/50 dark:bg-teal-950/50 dark:text-teal-100"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "explore" ? (
          <motion.div
            key="explore"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0.12 : 0.22 }}
            className="space-y-4"
          >
            <motion.div
              dir="rtl"
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 [unicode-bidi:isolate]"
              variants={reduce ? undefined : stageContainer}
              initial="hidden"
              animate="visible"
            >
              {pool.map((p) => (
                <LetterCard key={p.letter} pair={p} onExplore={exploreTouch} softened={softened} />
              ))}
            </motion.div>
          </motion.div>
        ) : null}

        {mode === "flash" ? (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400">
                প্রাথমিকভাবে দুর্বল হরফের দিকটা খুব সামনে থাকবে স্পেসড রোটেশন অনুযায়ী ।
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFlashIdx((i) => (i <= 0 ? flashOrder.length - 1 : i - 1))
                  }
                  className="rounded-lg border px-3 py-1 font-[family-name:var(--font-bn)] text-xs dark:border-teal-700 dark:text-teal-100"
                >
                  আগের কার্ড
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFlashIdx((i) => (i >= flashOrder.length - 1 ? 0 : i + 1))
                  }
                  className="rounded-lg border px-3 py-1 font-[family-name:var(--font-bn)] text-xs dark:border-teal-700 dark:text-teal-100"
                >
                  পরের কার্ড
                </button>
              </div>
            </div>
            <motion.div
              variants={reduce ? undefined : fadeUpLetter}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-lg"
            >
              <LetterCard pair={flashPair} onExplore={exploreTouch} softened={softened} variant="hero" />
              <button
                type="button"
                onClick={() => void playLetterSound({ pair: flashPair, kind: "formal_ar" })}
                className="mx-auto mt-4 block rounded-xl bg-[var(--islamic-gold-soft)] px-5 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-teal-950 shadow-sm hover:brightness-105 dark:bg-amber-400/95 dark:text-teal-950"
              >
                নাম ও উচ্চারণ শুনুন
              </button>
            </motion.div>
            <ArticulationMouthPlaceholder letter={flashPair.letter} active />
          </motion.div>
        ) : null}

        {mode === "hear" ? (
          <motion.div
            key="hear"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-[var(--islamic-teal)]/15 bg-white/80 p-4 dark:border-teal-800/40 dark:bg-teal-950/40"
          >
            <QuizHearPick
              pool={pool}
              mistakeWeight={mistakeWeight}
              onOutcome={onQuizOutcome}
              consecutiveWrong={consecutiveWrongQuiz}
            />
          </motion.div>
        ) : null}

        {mode === "match" ? (
          <motion.div
            key="match"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-[var(--islamic-teal)]/15 bg-white/80 p-4 dark:border-teal-800/40 dark:bg-teal-950/40"
          >
            <QuizMatchPairs pool={pool} onOutcome={onQuizOutcome} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
