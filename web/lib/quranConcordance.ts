import { parseAyahKey } from "@/lib/rootExpansion";
import type { SearchMode } from "@/lib/searchQuery";
import { normCorpusArabicToken } from "@/lib/wordFrequencyBuckets";
import { normalizeWordRow, type WordCorpusFile } from "@/lib/quranWordCorpus";

export type ConcordanceTokenSlice = {
  index: number;
  uthmani: string;
  glossBn: string;
  glossEn: string;
  transliteration: string;
};

export type ConcordanceHit = {
  surah: number;
  ayah: number;
  verseKey: string;
  arabicLine: string;
  matchIndices: number[];
  matched: ConcordanceTokenSlice[];
};

function tokenMatchesNeedle(
  uthmani: string,
  needleNorm: string,
  mode: SearchMode,
): boolean {
  if (!needleNorm) return false;
  const nt = normCorpusArabicToken(uthmani);
  if (mode === "exact") return nt === needleNorm;
  return nt.includes(needleNorm) || needleNorm.includes(nt);
}

/**
 * Quran.com-মার্জ করা word-corpus থেকে টোকেন-স্তর concordance —
 * প্রতিটি আয়াতে কোন শব্দ সূচীতে মিল, উথমানী লাইন ও গজ।
 */
export function collectConcordanceHits(
  corpus: WordCorpusFile,
  needleRaw: string,
  mode: SearchMode,
  limit: number,
): ConcordanceHit[] {
  const needleNorm = normCorpusArabicToken(needleRaw);
  if (!needleNorm || limit <= 0) return [];

  const hits: ConcordanceHit[] = [];

  for (const [verseKey, words] of Object.entries(corpus.ayahs)) {
    if (!words?.length) continue;
    const loc = parseAyahKey(verseKey);
    if (!loc) continue;

    const matchIndices: number[] = [];
    const matched: ConcordanceTokenSlice[] = [];
    const lineParts: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const [uth, bn, en, tr] = normalizeWordRow(words[i]!);
      lineParts.push(uth);
      if (tokenMatchesNeedle(uth, needleNorm, mode)) {
        matchIndices.push(i);
        matched.push({
          index: i,
          uthmani: uth,
          glossBn: bn,
          glossEn: en,
          transliteration: tr,
        });
      }
    }

    if (matchIndices.length === 0) continue;

    hits.push({
      surah: loc.surah,
      ayah: loc.ayah,
      verseKey,
      arabicLine: lineParts.join(" "),
      matchIndices,
      matched,
    });
  }

  hits.sort((a, b) =>
    a.surah !== b.surah ? a.surah - b.surah : a.ayah - b.ayah,
  );

  return hits.slice(0, limit);
}
