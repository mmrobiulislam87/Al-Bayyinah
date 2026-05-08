import { normalizeForSearch } from "@/lib/searchQuery";
import { stripArabicDiacritics } from "@/lib/crossLanguageRoots";

export function normalizeTranscript(s: string): string {
  return normalizeForSearch(stripArabicDiacritics(s)).replace(
    /[\u0640\u200c\u200d\s]/g,
    "",
  );
}

/** সহজ অক্ষর-ভিত্তিক মিল (০–১); তাজবীদ বিশ্লেষণ নয়। */
export function arabicRoughSimilarity(a: string, b: string): number {
  const x = normalizeTranscript(a);
  const y = normalizeTranscript(b);
  if (!x.length || !y.length) return 0;
  let hits = 0;
  const len = Math.min(x.length, y.length);
  for (let i = 0; i < len; i++) {
    if (x[i] === y[i]) hits++;
  }
  const denom = Math.max(x.length, y.length);
  return hits / denom;
}
