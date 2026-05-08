"use client";

import { useEffect, useState } from "react";

import { ClickableAyahText } from "@/components/ClickableAyahText";
import { latinQuranLineToBanglaPhonetic } from "@/lib/quranLatinToBanglaPhonetic";
import type { AyahRecord } from "@/lib/types";

/**
 * ল্যাটিন (Tanzil/risan স্টাইল) → বাংলা লিপির স্বয়ংক্রিয় রূপান্তর বহু শব্দে ভুল
 * (যেমন الَّذِينَ ↔ যিনা/যিন, عَالَمِينَ ↔ আলামীন/আলামীনি)। পাবলিক মুখে এটি দেখালে বিভ্রান্তি হয়।
 * নির্ভুল বাংলা প্রতিবর্ণ: `bengaliTransliterationScript` + `bengali_transliteration_overrides.json`।
 * ডেভ-পরীক্ষার জন্য সত্য করতে পারেন — প্রকাশে রাখবেন না যত না ম্যানুয়ালি যাচাই হয়।
 */
const SHOW_LATIN_TO_BANGLA_HEURISTIC = false;

/**
 * আপাতত সমগ্র ব্লক (বাংলা প্রতিবর্ণ, Quran.com শব্দসার, রোমান ট্রান্সলিট) লুকানো —
 * পরবর্তীতে নির্ভুলতা নিয়ে কাজের পর `true` করুন।
 */
const SHOW_AYAH_TRANSLITERATION_ASSIST_BLOCK = false;

const glossCache = new Map<string, string>();

type Props = {
  r: AyahRecord;
  latinHighlightRanges?: [number, number][];
  bengaliScriptHighlightRanges?: [number, number][];
};

/**
 * আরবি পাঠের নিচে উচ্চারণ-সহায়ক স্তর:
 * 1) বাংলা প্রতিবর্ণ (যদি bengaliTransliterationScript / ওভাররাইডে থাকে)
 * 2) ~~ল্যাটিন → বাংলা আনুমানিক~~ (বন্ধ — নির্ভুলতার জন্য; কোডে SHOW_LATIN_TO_BANGLA_HEURISTIC)
 * 3) Quran.com WBW-র বাংলা শব্দসার (অর্থভিত্তিক)
 * 4) সম্পূর্ণ রোমান ট্রান্সলিটারেশন
 */
export function AyahTransliterationBelowArabic({
  r,
  latinHighlightRanges,
  bengaliScriptHighlightRanges,
}: Props) {
  const lat = r.latinTransliteration?.trim() ?? "";
  const bnScript = r.bengaliTransliterationScript?.trim() ?? "";
  const bnPhoneticFromLatin =
    SHOW_LATIN_TO_BANGLA_HEURISTIC && lat ? latinQuranLineToBanglaPhonetic(lat) : "";
  /** সত্যিকারের বাংলা প্রতিবর্ণ (JSON/ওভাররাইড) থাকলে ল্যাটিন→বাংলা আনুমানিক লাইন লুকোই — দ্বিবাক্য এড়ানো। */
  const showLatinToBanglaHeuristic = Boolean(bnPhoneticFromLatin && !bnScript);

  const cacheKey = `${r.surah}:${r.ayah}`;
  const [glossLine, setGlossLine] = useState<string | undefined>(() =>
    glossCache.has(cacheKey) ? glossCache.get(cacheKey)! : undefined,
  );
  const [glossErr, setGlossErr] = useState(false);

  useEffect(() => {
    if (!SHOW_AYAH_TRANSLITERATION_ASSIST_BLOCK) return;
    const k = `${r.surah}:${r.ayah}`;
    if (glossCache.has(k)) {
      setGlossLine(glossCache.get(k)!);
      setGlossErr(false);
      return;
    }
    let cancelled = false;
    setGlossLine(undefined);
    setGlossErr(false);
    fetch(`/api/quran/bn-word-gloss-line?surah=${r.surah}&ayah=${r.ayah}`)
      .then(async (res) => {
        const j = (await res.json()) as { line?: string; error?: string };
        if (!res.ok) throw new Error(j.error ?? "request");
        return typeof j.line === "string" ? j.line : "";
      })
      .then((line) => {
        if (cancelled) return;
        glossCache.set(k, line);
        setGlossLine(line);
      })
      .catch(() => {
        if (!cancelled) {
          setGlossErr(true);
          setGlossLine("");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [r.surah, r.ayah]);

  if (!SHOW_AYAH_TRANSLITERATION_ASSIST_BLOCK) return null;

  const glossReady = glossLine !== undefined;
  const glossText = glossLine?.trim() ?? "";

  if (!lat && !bnScript) {
    if (!glossReady) {
      return (
        <div
          className="mb-4 border-b border-[var(--islamic-teal)]/10 pb-4 text-sm text-[var(--islamic-ink-soft)] dark:border-teal-800/40 dark:text-teal-400/85 md:mb-5"
          role="status"
        >
          উচ্চারণ সহায়ক সারি লোড হচ্ছে…
        </div>
      );
    }
    if (!glossText) return null;
  }

  if (glossReady && !glossText && !lat && !bnScript) return null;

  return (
    <div
      className="mb-4 border-b border-[var(--islamic-teal)]/10 pb-4 dark:border-teal-800/40 md:mb-5"
      role="region"
      aria-label="উচ্চারণ"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--islamic-teal)]/75 dark:text-teal-400/85 sm:text-sm">
        উচ্চারণ ও সহায়ক সারি
      </p>

      {bnScript ? (
        <div className="mb-3 space-y-1">
          <p className="text-[0.7rem] font-medium text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
            বাংলা প্রতিবর্ণ
          </p>
          <div
            className="font-[family-name:var(--font-bn)] text-base leading-relaxed text-[var(--islamic-ink)] dark:text-teal-100/90 sm:text-lg"
            lang="bn"
            role="paragraph"
          >
            <ClickableAyahText
              text={r.bengaliTransliterationScript}
              lang="bn"
              ayahRef={{ surah: r.surah, ayah: r.ayah }}
              highlightRanges={bengaliScriptHighlightRanges ?? []}
            />
          </div>
        </div>
      ) : null}

      {showLatinToBanglaHeuristic ? (
        <div className="mb-3 space-y-1">
          <p className="text-[0.7rem] font-medium text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
            বাংলা লিপিতে ধ্বনি (ল্যাটিন থেকে আনুমানিক)
          </p>
          <div
            className="font-[family-name:var(--font-bn)] text-base leading-relaxed text-[var(--islamic-ink)] dark:text-teal-100/90 sm:text-lg"
            lang="bn"
            role="paragraph"
          >
            <ClickableAyahText text={bnPhoneticFromLatin} lang="bn" ayahRef={{ surah: r.surah, ayah: r.ayah }} />
          </div>
        </div>
      ) : null}

      {!glossReady ? (
        <p className="mb-3 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400/85" role="status">
          বাংলা শব্দসার লোড হচ্ছে…
        </p>
      ) : glossText ? (
        <div className="mb-3 space-y-1">
          <p className="text-[0.7rem] font-medium text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
            শব্দে শব্দে বাংলা নির্দেশ (অর্থভিত্তিক — Quran.com)
          </p>
          <div
            className="font-[family-name:var(--font-bn)] text-base leading-relaxed text-[var(--islamic-ink)] dark:text-teal-100/90 sm:text-lg"
            lang="bn"
            role="paragraph"
          >
            <ClickableAyahText text={glossText} lang="bn" ayahRef={{ surah: r.surah, ayah: r.ayah }} />
          </div>
        </div>
      ) : glossErr ? (
        <p className="mb-3 text-xs text-[var(--islamic-ink-soft)] dark:text-teal-500/80">
          বাংলা শব্দসার লোড হয়নি।
        </p>
      ) : null}

      {lat ? (
        <div className="space-y-1">
          <p className="text-[0.7rem] font-medium text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
            রোমান লিপিতে ট্রান্সলিটারেশন (সূত্র: প্রকল্পের ডেটা)
          </p>
          <div
            className="font-[family-name:var(--font-bn)] text-[0.95rem] leading-relaxed tracking-[0.02em] text-[var(--islamic-ink-soft)] dark:text-teal-200/85 sm:text-base"
            dir="ltr"
            lang="bn"
            role="paragraph"
            translate="no"
          >
            <ClickableAyahText
              text={r.latinTransliteration}
              lang="bn"
              ayahRef={{ surah: r.surah, ayah: r.ayah }}
              highlightRanges={latinHighlightRanges ?? []}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
