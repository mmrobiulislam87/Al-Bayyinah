"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import { fadeUpLetter } from "@/lib/fundamentals/fundamentalsMotion";
import { mnemonicLineBn } from "@/lib/fundamentals/mnemonicHintsBn";
import type { AlphabetPair } from "@/lib/learnAlphabetSets";
import { playLetterSound } from "@/lib/learnAudioEngine";

type Props = {
  pair: AlphabetPair;
  /** স্টোরে এক্সপ্লোর টাচ */
  onExplore: (letter: string) => void;
  softened?: boolean;
  /** বড় স্টেজে কেন্দ্রীয় কার্ড */
  variant?: "grid" | "hero";
};

export default function LetterCard({
  pair,
  onExplore,
  softened = false,
  variant = "grid",
}: Props) {
  const reduce = useReducedMotion();
  const hoverSoundAt = useRef(0);
  const [open, setOpen] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const shapeLine = mnemonicLineBn(pair.letter, pair.wordBn.split("·")[0]?.trim() ?? pair.wordBn);

  const play = useCallback(
    async (kind: "formal_ar" | "arabic_example") => {
      onExplore(pair.letter);
      await playLetterSound({ pair, kind });
    },
    [onExplore, pair],
  );

  const onPointerEnter = () => {
    onExplore(pair.letter);
    if (reduce) return;
    const now = Date.now();
    if (now - hoverSoundAt.current < 950) return;
    hoverSoundAt.current = now;
    void playLetterSound({ pair, kind: "formal_ar" });
  };

  const onClick = () => {
    setOpen((o) => !o);
    setSparkle(true);
    window.setTimeout(() => setSparkle(false), 640);
    void play("formal_ar");
  };

  const isHero = variant === "hero";

  return (
    <motion.article
      dir="ltr"
      lang="bn"
      layout
      variants={reduce ? undefined : fadeUpLetter}
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-b shadow-sm transition-colors [unicode-bidi:isolate] ${
        softened
          ? "border-teal-300/45 from-white/90 to-teal-50/50 dark:border-teal-700/45 dark:from-teal-950/80 dark:to-teal-950/50"
          : "border-[var(--islamic-teal)]/22 from-white/95 to-[var(--islamic-parchment)]/75 dark:border-teal-800/50 dark:from-teal-950/70 dark:to-teal-950/45"
      } ${isHero ? "min-h-[min(52vh,420px)] p-6 sm:p-10" : "p-3 sm:p-4"}`}
      whileHover={
        reduce
          ? undefined
          : {
              scale: 1.02,
              boxShadow: "0 0 24px rgba(45, 212, 191, 0.18)",
            }
      }
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {sparkle && !reduce ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-200/10 via-transparent to-teal-200/15"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
        />
      ) : null}

      <button
        type="button"
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        className="group flex w-full flex-1 flex-col items-center justify-center gap-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--islamic-gold)]"
      >
        <span className="text-2xl" aria-hidden>
          {pair.emoji}
        </span>
        <span
          dir="rtl"
          className={`font-[family-name:var(--font-quran-ar)] font-normal text-[var(--islamic-teal-deep)] dark:text-teal-50 ${
            isHero ? "text-[clamp(4.5rem,18vw,9rem)] leading-none" : "text-4xl sm:text-5xl"
          }`}
        >
          {pair.letter}
        </span>
        <span className="font-[family-name:var(--font-bn)] text-[10px] font-medium text-[var(--islamic-ink-soft)] dark:text-teal-400/90 sm:text-xs">
          {pair.nameBn ?? "হরফ"}
        </span>
      </button>

      {open ? (
        <div className="mt-3 space-y-2 border-t border-[var(--islamic-teal)]/12 pt-3 dark:border-teal-800/35">
          <p className="font-[family-name:var(--font-bn)] text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
            <strong className="text-[var(--islamic-teal-deep)] dark:text-teal-100">আকৃতি:</strong>{" "}
            {shapeLine}
          </p>
          <p className="font-[family-name:var(--font-bn)] text-[11px] leading-relaxed text-[var(--islamic-ink)] dark:text-teal-100/90">
            {pair.wordBn}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void play("formal_ar");
              }}
              className="rounded-lg bg-[var(--islamic-teal-deep)] px-3 py-1.5 font-[family-name:var(--font-bn)] text-[11px] font-semibold text-white hover:brightness-110 dark:bg-teal-800"
            >
              আরবি নাম শুনুন
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void play("arabic_example");
              }}
              className="rounded-lg border border-[var(--islamic-teal)]/35 px-3 py-1.5 font-[family-name:var(--font-bn)] text-[11px] font-semibold text-[var(--islamic-teal-deep)] dark:border-teal-600/50 dark:text-teal-100"
            >
              উদাহরণ শব্দ{" "}
              <span dir="rtl" className="font-[family-name:var(--font-quran-ar)]">
                {pair.arabicWord}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </motion.article>
  );
}
