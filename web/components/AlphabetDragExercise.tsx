"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AlphabetPair } from "@/lib/learnAlphabetSets";

function shuffledPairs(seed: AlphabetPair[]): AlphabetPair[] {
  const copy = [...seed];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

const BOX =
  "flex h-[5.25rem] w-[5.25rem] shrink-0 items-center justify-center rounded-xl border-2 bg-white/95 shadow-inner dark:bg-teal-950/80";

type Props = {
  pairs: AlphabetPair[];
  /** প্রতিটি নতুন সম্পূর্ণ সমাধানের পর একবার কল */
  onSolved?: () => void;
  /** রিসেট চাপলে */
  onReset?: () => void;
};

export default function AlphabetDragExercise({
  pairs,
  onSolved,
  onReset,
}: Props) {
  const [slots, setSlots] = useState<(AlphabetPair | null)[]>(() =>
    pairs.map(() => null),
  );
  const [dragging, setDragging] = useState<AlphabetPair | null>(null);
  const [picked, setPicked] = useState<AlphabetPair | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [dragBank, setDragBank] = useState<AlphabetPair[]>(() =>
    shuffledPairs(pairs),
  );

  const solvedRef = useRef(false);

  useEffect(() => {
    setSlots(pairs.map(() => null));
    setDragBank(shuffledPairs(pairs));
    solvedRef.current = false;
    setPicked(null);
    setWrongSlot(null);
  }, [pairs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPicked(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const placeLetter = useCallback(
    (idx: number, p: AlphabetPair) => {
      const expected = pairs[idx]?.letter;
      if (!expected || p.letter !== expected) return false;
      setSlots((prev) => {
        const next = [...prev];
        next[idx] = p;
        return next;
      });
      return true;
    },
    [pairs],
  );

  const tryPlaceWithFeedback = useCallback(
    (idx: number, p: AlphabetPair) => {
      const expected = pairs[idx]?.letter;
      if (!expected) return;
      if (p.letter !== expected) {
        setWrongSlot(idx);
        window.setTimeout(() => setWrongSlot(null), 420);
        setPicked(null);
        return;
      }
      placeLetter(idx, p);
      setPicked(null);
    },
    [pairs, placeLetter],
  );

  const solved =
    slots.length === pairs.length &&
    slots.every((s, i) => s?.letter === pairs[i]?.letter);

  useEffect(() => {
    if (!solved) {
      solvedRef.current = false;
      return;
    }
    if (solvedRef.current) return;
    solvedRef.current = true;
    onSolved?.();
  }, [solved, onSolved]);

  const lettersAvailableToDrag = useMemo(() => {
    return dragBank.filter((p) => {
      const idx = pairs.findIndex((t) => t.letter === p.letter);
      if (idx < 0) return true;
      return slots[idx]?.letter !== pairs[idx]!.letter;
    });
  }, [dragBank, pairs, slots]);

  const reset = useCallback(() => {
    setSlots(pairs.map(() => null));
    setDragBank(shuffledPairs(pairs));
    solvedRef.current = false;
    setPicked(null);
    setWrongSlot(null);
    onReset?.();
  }, [pairs, onReset]);

  const bankGridClass =
    pairs.length <= 4
      ? "grid grid-cols-2 gap-2 sm:grid-cols-4"
      : "grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {pairs.map((p, idx) => (
          <div
            key={p.letter}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--islamic-teal)]/18 bg-[var(--islamic-parchment)]/35 px-3 py-3 dark:border-teal-800/45 dark:bg-teal-950/35 sm:flex-nowrap sm:gap-4 sm:px-4"
          >
            {/* ছবির বাক্স */}
            <div
              className={`${BOX} border-[var(--islamic-teal)]/25 text-4xl dark:border-teal-700/40`}
              aria-hidden
            >
              {p.emoji}
            </div>

            {/* ব্যাখ্যা */}
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-[family-name:var(--font-bn)] text-[11px] leading-snug text-[var(--islamic-ink-soft)] dark:text-teal-300/95 sm:text-xs">
                {p.wordBn}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--islamic-teal)]/70 dark:text-teal-500">
                আরবি শব্দ (শুরুতে এই হরফ)
              </p>
              <p
                dir="rtl"
                className="[font-family:var(--font-quran-ar)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-100/95"
              >
                {p.arabicWord}
              </p>
            </div>

            {/* হরফের খালি বাক্স — ছবির বাক্সের সমান আকার */}
            <div
              role="button"
              tabIndex={0}
              aria-label={`হরফ মিলানোর বাক্স সারি ${idx + 1}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging) {
                  tryPlaceWithFeedback(idx, dragging);
                  setDragging(null);
                }
              }}
              onClick={() => {
                if (slots[idx] || !picked) return;
                tryPlaceWithFeedback(idx, picked);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                if (slots[idx] || !picked) return;
                tryPlaceWithFeedback(idx, picked);
              }}
              className={`${BOX} cursor-pointer border-dashed transition-colors hover:border-[var(--islamic-gold)]/65 hover:bg-[var(--islamic-parchment)]/60 dark:hover:bg-teal-900/60 ${
                wrongSlot === idx
                  ? "border-red-500/80 bg-red-500/10 dark:border-red-400/70"
                  : "border-[var(--islamic-gold)]/45 dark:border-amber-700/45"
              }`}
            >
              {slots[idx]?.letter ? (
                <motion.span
                  dir="rtl"
                  className="text-4xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-50"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  {slots[idx]!.letter}
                </motion.span>
              ) : (
                <span className="font-[family-name:var(--font-bn)] text-[10px] text-center leading-tight text-[var(--islamic-ink-soft)] dark:text-teal-500">
                  হরফ
                  <br />
                  এখানে
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 font-[family-name:var(--font-bn)] text-xs font-medium text-[var(--islamic-teal)]/90 dark:text-teal-400">
          নিচের বাক্সগুলো থেকে হরফ টেনে আনুন — অথবা একটি হরফ চাপুন, তারপর উপরের
          খালি বাক্সে চাপুন।
        </p>
        <div
          className={`${bankGridClass} rounded-xl border border-[var(--islamic-teal)]/15 bg-white/90 p-3 dark:border-teal-800/40 dark:bg-teal-950/50`}
        >
          {lettersAvailableToDrag.length === 0 ? (
            <p className="col-span-full font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-500">
              সব হরফ সঠিক বাক্সে চলে গেছে।
            </p>
          ) : (
            lettersAvailableToDrag.map((p) => {
              const active = picked?.letter === p.letter;
              return (
                <motion.button
                  key={`drag-${p.letter}`}
                  layout
                  type="button"
                  draggable
                  onDragStart={() => {
                    setDragging(p);
                    setPicked(null);
                  }}
                  onDragEnd={() => setDragging(null)}
                  onClick={() =>
                    setPicked((cur) =>
                      cur?.letter === p.letter ? null : p,
                    )
                  }
                  dir="rtl"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex aspect-square min-h-[5.25rem] items-center justify-center rounded-xl border-2 bg-white text-4xl font-semibold shadow-md transition-colors dark:bg-teal-900/75 dark:text-teal-50 ${
                    active
                      ? "border-[var(--islamic-gold)] ring-2 ring-[var(--islamic-gold)]/55 ring-offset-2 ring-offset-[var(--islamic-parchment)] dark:ring-offset-teal-950"
                      : "border-[var(--islamic-gold)]/55 hover:bg-[var(--islamic-parchment)]/90 dark:hover:bg-teal-900"
                  }`}
                >
                  {p.letter}
                </motion.button>
              );
            })
          )}
        </div>
        {picked ? (
          <p className="mt-2 font-[family-name:var(--font-bn)] text-[11px] text-[var(--islamic-teal-deep)] dark:text-amber-200/90">
            নির্বাচিত হরফ — উপরের খালি বাক্সে ট্যাপ করুন। বাতিল: Escape বা আবার
            একই হরফ চাপুন।
          </p>
        ) : null}
      </div>

      {solved ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-green-600/25 bg-green-600/10 px-4 py-3 dark:bg-green-500/15"
        >
          <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-green-800 dark:text-green-300">
            সুন্দর! এই সেট সম্পূর্ণ হয়েছে।
          </p>
        </motion.div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-[var(--islamic-teal)]/25 px-3 py-1.5 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-teal-deep)] hover:bg-[var(--islamic-parchment)]/80 dark:border-teal-700/50 dark:text-teal-200"
        >
          আবার খেলুন
        </button>
      </div>
    </div>
  );
}
