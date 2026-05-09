"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";

import { encourageToneBn } from "@/lib/fundamentals/emotionFeedback";
import {
  pickDistractors,
  pickWeightedLetter,
  shuffleInPlace,
} from "@/lib/fundamentals/adaptiveQuiz";
import type { AlphabetPair } from "@/lib/learnAlphabetSets";
import { playLetterSound } from "@/lib/learnAudioEngine";
import type { QuizModeId } from "@/stores/learnFundamentalsStore";

type Props = {
  pool: AlphabetPair[];
  mistakeWeight: Record<string, number>;
  onOutcome: (letter: string, ok: boolean, mode: QuizModeId) => void;
  consecutiveWrong: number;
};

export default function QuizHearPick({
  pool,
  mistakeWeight,
  onOutcome,
  consecutiveWrong,
}: Props) {
  const reduce = useReducedMotion();
  const [roundKey, setRoundKey] = useState(0);
  const [target, setTarget] = useState<AlphabetPair>(() =>
    pickWeightedLetter(pool, mistakeWeight),
  );
  const [choices, setChoices] = useState<AlphabetPair[]>([]);

  useLayoutEffect(() => {
    setChoices(shuffleInPlace([target, ...pickDistractors(pool, target, 3)]));
  }, [pool, target, roundKey]);

  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "ok" | "bad">("idle");

  const reroll = useCallback(() => {
    setPicked(null);
    setFeedback("idle");
    setTarget(pickWeightedLetter(pool, mistakeWeight));
    setRoundKey((k) => k + 1);
  }, [pool, mistakeWeight]);

  const playPrompt = useCallback(() => {
    void playLetterSound({ pair: target, kind: "formal_ar" });
  }, [target]);

  const encour = useMemo(
    () => encourageToneBn(consecutiveWrong),
    [consecutiveWrong],
  );

  const onChoose = (letter: string) => {
    if (picked) return;
    setPicked(letter);
    const ok = letter === target.letter;
    setFeedback(ok ? "ok" : "bad");
    onOutcome(target.letter, ok, "hear_pick");
    window.setTimeout(() => reroll(), ok ? (reduce ? 420 : 780) : 1100);
  };

  return (
    <div className="space-y-4">
      {encour.line ? (
        <p className="rounded-xl border border-amber-200/50 bg-amber-50/40 px-3 py-2 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-teal-deep)] dark:border-amber-800/35 dark:bg-amber-950/25 dark:text-amber-100/95">
          {encour.line}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileTap={reduce ? undefined : { scale: 0.97 }}
          onClick={() => playPrompt()}
          className="rounded-xl bg-[var(--islamic-teal-deep)] px-4 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow hover:brightness-110 dark:bg-teal-800"
        >
          যে হরফ শুনছেন খুঁজুন · শুনুন
        </motion.button>
        <span className="font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
          সঠিক উত্তরে পরের রাউন্ড স্বয়ংক্রিয়
        </span>
      </div>
      <div
        dir="rtl"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 [unicode-bidi:isolate]"
      >
        {choices.map((p) => {
          const pressed = picked === p.letter;
          const highlight =
            feedback === "idle"
              ? ""
              : p.letter === target.letter
                ? "ring-2 ring-green-500/70"
                : pressed
                  ? "ring-2 ring-red-400/60"
                  : "";
          return (
            <motion.button
              key={`${roundKey}-${p.letter}`}
              type="button"
              disabled={Boolean(picked)}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              onClick={() => onChoose(p.letter)}
              className={`rounded-2xl border border-[var(--islamic-teal)]/20 bg-white/90 px-3 py-4 text-center shadow-sm transition dark:border-teal-800/50 dark:bg-teal-950/60 ${highlight}`}
            >
              <span
                dir="rtl"
                className="block font-[family-name:var(--font-quran-ar)] text-3xl text-[var(--islamic-teal-deep)] dark:text-teal-50"
              >
                {p.letter}
              </span>
              <span className="mt-1 block font-[family-name:var(--font-bn)] text-[10px] text-[var(--islamic-ink-soft)] dark:text-teal-400">
                {p.nameBn ?? ""}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
