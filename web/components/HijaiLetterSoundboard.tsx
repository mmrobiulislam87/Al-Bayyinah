"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AlphabetPair } from "@/lib/learnAlphabetSets";
import { HIJAI_SOUNDBOARD_ROW_COUNTS } from "@/lib/learnAlphabetSets";
import { canUseSpeechSynth } from "@/lib/speechBnUtter";
import {
  HIJAI_FORMAL_NAME_AR,
  pronounceHijaiLetter,
  primeSpeechSynthVoices,
} from "@/lib/hijaiLetterSpeech";
import { toBengaliDigits } from "@/lib/numberBn";

function rowsForLetters(letters: AlphabetPair[]): AlphabetPair[][] {
  const span = HIJAI_SOUNDBOARD_ROW_COUNTS.reduce((a, n) => a + n, 0);
  if (letters.length !== span) return [letters];
  let o = 0;
  return HIJAI_SOUNDBOARD_ROW_COUNTS.map((n) => {
    const row = letters.slice(o, o + n);
    o += n;
    return row;
  });
}

/** পিডিএফ অনুযায়ী সারিবিভাগ — ডিভাইস সরু হলেও টাইলগুলো উপযুক্ত খুচরো কলামে ফেটে যাবে । */
function rowColsClass(length: number) {
  if (length <= 7) return "grid-cols-4 sm:grid-cols-7";
  if (length <= 10) return "grid-cols-5 sm:grid-cols-10";
  return "grid-cols-4 sm:grid-cols-8 md:grid-cols-12";
}

type Props = {
  letters: AlphabetPair[];
  /** সবগুলো টিপে শোনানো শেষ (প্রথম রিচে একবার) */
  onFirstFullCoverage?: () => void;
};

export default function HijaiLetterSoundboard({
  letters,
  onFirstFullCoverage,
}: Props) {
  const [heard, setHeard] = useState<Record<string, true>>({});
  const fullCoverageFired = useRef(false);
  const [seqBusy, setSeqBusy] = useState(false);

  const total = letters.length;
  const count = Object.keys(heard).length;

  useEffect(() => {
    primeSpeechSynthVoices();
    const h = () => primeSpeechSynthVoices();
    if (typeof window !== "undefined" && window.speechSynthesis)
      window.speechSynthesis.addEventListener("voiceschanged", h);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", h);
    };
  }, []);

  useEffect(() => {
    if (count < total || fullCoverageFired.current) return;
    fullCoverageFired.current = true;
    onFirstFullCoverage?.();
  }, [count, total, onFirstFullCoverage]);

  const onTap = useCallback((p: AlphabetPair) => {
    void pronounceHijaiLetter(p.letter, p.nameBn).then(() => {
      setHeard((prev) => ({ ...prev, [p.letter]: true }));
    });
  }, []);

  const playSequential = useCallback(async () => {
    if (!letters.length || !canUseSpeechSynth()) return;
    if (seqBusy) return;
    setSeqBusy(true);
    try {
      primeSpeechSynthVoices();
      for (let i = 0; i < letters.length; i++) {
        const p = letters[i]!;
        await pronounceHijaiLetter(p.letter, p.nameBn);
        setHeard((prev) => ({ ...prev, [p.letter]: true }));
        await new Promise<void>((res) =>
          window.setTimeout(res, 320),
        );
      }
    } finally {
      setSeqBusy(false);
    }
  }, [letters, seqBusy]);

  const speechSynthOk =
    typeof window !== "undefined" ? canUseSpeechSynth() : true;

  const rows = useMemo(() => rowsForLetters(letters), [letters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--islamic-teal)]/18 bg-[var(--islamic-parchment)]/45 px-3 py-2.5 dark:border-teal-800/45 dark:bg-teal-950/35">
        <p className="font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
          আরবি লেখার দিক ডান থেকে বাম । প্রতিটি হরফ টিপে আনুষ্ঠানিক আরবি নাম শুনুন (
          অন্তত ডিভাইসে আরবি ভয়েস থাকতে হবে —
          ফোনে ভাল ফল অনেক সময় খুঁজে পাবে) । ({toBengaliDigits(count)} /{" "}
          {toBengaliDigits(total)} টি)।
        </p>
        <button
          type="button"
          disabled={!speechSynthOk || seqBusy}
          onClick={() => void playSequential()}
          className="rounded-lg border border-[var(--islamic-teal)]/35 bg-white/90 px-3 py-1.5 font-[family-name:var(--font-bn)] text-[11px] font-semibold text-[var(--islamic-teal-deep)] shadow-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 dark:border-teal-700/50 dark:bg-teal-900/70 dark:text-teal-100"
        >
          {seqBusy ? "এক একটি করে চলেছে…" : "হিজাই ক্রমে এক একটি করে শুনুন"}
        </button>
      </div>

      {!speechSynthOk ? (
        <p
          role="status"
          className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 font-[family-name:var(--font-bn)] text-xs text-amber-950 dark:text-amber-200/95"
        >
          এই ব্রাউজারে কথ্য সিনথেসিস নেই — নিচের হরফের আরবি ও বাংলা টেক্সট দেখুন।
        </p>
      ) : null}

      {/* আরবি দিকনির্দেশ: তিন সারিতে ১২+১০+৭ হরফ · ডান থেকে বাম। */}
      <div className="space-y-2">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            dir="rtl"
            className={`grid gap-2 ${rowColsClass(row.length)}`}
          >
            {row.map((p) => {
              const done = !!heard[p.letter];
              const formalAr = HIJAI_FORMAL_NAME_AR[p.letter];
              const keyLetter =
                `${p.letter}-${rowIdx}`;
              return (
                <motion.button
                  key={keyLetter}
                  layout
                  type="button"
                  onClick={() => onTap(p)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl border-2 px-1 py-2 text-center shadow-sm transition-colors ${
                    done
                      ? "border-green-600/55 bg-green-600/14 dark:border-green-500/50 dark:bg-green-500/14"
                      : "border-[var(--islamic-gold)]/45 bg-white/95 hover:border-[var(--islamic-teal)]/55 dark:border-amber-700/55 dark:bg-teal-900/70"
                  }`}
                  dir="rtl"
                  aria-label={`হরফ ${formalAr ?? p.letter} ও ${p.nameBn ?? ""} শুনুন`}
                >
                  <span className="[font-family:var(--font-quran-ar)] text-3xl font-semibold leading-none text-[var(--islamic-teal-deep)] dark:text-teal-50 sm:text-4xl">
                    {p.letter}
                  </span>
                  {formalAr ? (
                    <span
                      className="mt-0.5 [font-family:var(--font-quran-ar)] text-[10px] leading-tight text-[var(--islamic-teal)]/82 dark:text-teal-300/88"
                      dir="rtl"
                    >
                      {formalAr}
                    </span>
                  ) : null}
                  <span className="mt-0.5 font-[family-name:var(--font-bn)] text-[8px] leading-tight text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
                    {p.nameBn ?? ""}
                  </span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
