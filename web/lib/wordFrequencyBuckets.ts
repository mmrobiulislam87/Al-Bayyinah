import { stripArabicDiacritics } from "@/lib/crossLanguageRoots";
import { normalizeForSearch } from "@/lib/searchQuery";
import { getSurahRevelation } from "@/lib/surahRevelation";
import type { WordCorpusFile } from "@/lib/quranWordCorpus";

/** কorpus টোকেন মিল — `quranWordCorpus`/`lookupCorpusForAyahWord`-এর মতো আলিফ/কেরা/ইয়েহ সচেতন। */
export function normCorpusArabicToken(s: string): string {
  return normalizeForSearch(stripArabicDiacritics(s))
    .trim()
    .replace(/[\u0640\u200c\u200d]/g, "")
    .replace(/\u0649/g, "\u064A");
}

/**
 * আরবি শব্দ টোকেনে needle সাবস্ট্রিং — গণনায় একটি টোকেনে একবার।
 */
export function countWordMatchesInCorpus(
  corpus: WordCorpusFile,
  needleRaw: string,
): { makki: number; madani: number; totalTokens: number } {
  const needle = normCorpusArabicToken(needleRaw);
  let makki = 0;
  let madani = 0;

  if (!needle) return { makki: 0, madani: 0, totalTokens: 0 };

  for (const [key, words] of Object.entries(corpus.ayahs)) {
    const sm = /^(\d+):/.exec(key);
    const surah = sm ? Number(sm[1]) : NaN;
    if (!Number.isFinite(surah)) continue;
    const bucket = getSurahRevelation(surah);

    for (const row of words) {
      const uth = row[0];
      if (!uth) continue;
      const nt = normCorpusArabicToken(uth);
      if (nt.includes(needle) || needle.includes(nt)) {
        if (bucket === "makki") makki++;
        else madani++;
      }
    }
  }

  return { makki, madani, totalTokens: makki + madani };
}
