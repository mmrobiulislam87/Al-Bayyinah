"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { shuffleInPlace } from "@/lib/fundamentals/adaptiveQuiz";
import type { AlphabetPair } from "@/lib/learnAlphabetSets";
import type { QuizModeId } from "@/stores/learnFundamentalsStore";

type Props = {
  pool: AlphabetPair[];
  onOutcome: (letter: string, ok: boolean, mode: QuizModeId) => void;
};

function takeSix(pool: AlphabetPair[]): AlphabetPair[] {
  if (pool.length <= 6) return [...pool];
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy.slice(0, 6);
}

export default function QuizMatchPairs({ pool, onOutcome }: Props) {
  const reduce = useReducedMotion();
  const [slice] = useState(() => takeSix(pool));
  const emojiSide = useMemo(() => shuffleInPlace([...slice]), [slice]);
  const lettersSide = useMemo(() => shuffleInPlace([...slice]), [slice]);
  const [pendingEmoji, setPendingEmoji] = useState<AlphabetPair | null>(null);
  const [pendingLetter, setPendingLetter] = useState<AlphabetPair | null>(null);
  const [matched, setMatched] = useState<Record<string, true>>({});

  const flushWrong = () => {
    window.setTimeout(() => {
      setPendingEmoji(null);
      setPendingLetter(null);
    }, reduce ? 0 : 520);
  };

  const onEmojiTap = (p: AlphabetPair) => {
    if (matched[p.letter]) return;
    if (!pendingLetter) {
      setPendingEmoji(p);
      return;
    }
    const ok = p.letter === pendingLetter.letter;
    setPendingEmoji(null);
    setPendingLetter(null);
    if (ok) {
      setMatched((m) => ({ ...m, [p.letter]: true }));
      onOutcome(p.letter, true, "match_shape");
      return;
    }
    onOutcome(pendingLetter.letter, false, "match_shape");
    flushWrong();
  };

  const onLetterTap = (p: AlphabetPair) => {
    if (matched[p.letter]) return;
    if (!pendingEmoji) {
      setPendingLetter(p);
      return;
    }
    const ok = p.letter === pendingEmoji.letter;
    setPendingEmoji(null);
    setPendingLetter(null);
    if (ok) {
      setMatched((m) => ({ ...m, [p.letter]: true }));
      onOutcome(p.letter, true, "match_shape");
      return;
    }
    onOutcome(p.letter, false, "match_shape");
    flushWrong();
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
          ছবি ও ইঙ্গিত
        </p>
        <div className="grid grid-cols-2 gap-2">
          {emojiSide.map((pair) => (
            <motion.button
              key={`e-${pair.letter}`}
              type="button"
              disabled={Boolean(matched[pair.letter])}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              onClick={() => onEmojiTap(pair)}
              className={`rounded-xl border px-3 py-3 text-left font-[family-name:var(--font-bn)] text-[11px] leading-snug shadow-sm transition ${
                matched[pair.letter]
                  ? "border-green-600/35 bg-green-500/15 opacity-60 dark:border-green-700/35"
                  : pendingEmoji?.letter === pair.letter
                    ? "border-[var(--islamic-gold)] bg-amber-50/55 dark:bg-amber-950/35"
                    : "border-[var(--islamic-teal)]/20 bg-white/90 dark:border-teal-800/40 dark:bg-teal-950/55"
              }`}
            >
              <span className="text-xl">{pair.emoji}</span>
              <span className="mt-1 block text-[var(--islamic-ink-soft)] dark:text-teal-400/92">
                {pair.wordBn.split("·")[0]?.trim()?.slice(0, 52)}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
          সংগত হরফ
        </p>
        <div dir="rtl" className="grid grid-cols-3 gap-2 [unicode-bidi:isolate]">
          {lettersSide.map((pair) => (
            <motion.button
              key={`l-${pair.letter}`}
              type="button"
              disabled={Boolean(matched[pair.letter])}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              onClick={() => onLetterTap(pair)}
              className={`rounded-xl border py-4 text-center font-[family-name:var(--font-quran-ar)] text-3xl shadow-sm transition ${
                matched[pair.letter]
                  ? "border-green-600/35 bg-green-500/15 text-green-900 dark:border-green-700/35 dark:text-green-300"
                  : pendingLetter?.letter === pair.letter
                    ? "border-[var(--islamic-gold)] bg-amber-50/55 dark:bg-amber-950/35"
                    : "border-[var(--islamic-teal)]/20 bg-white/90 dark:border-teal-800/40 dark:bg-teal-950/65"
              }`}
            >
              <span dir="rtl">{pair.letter}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
