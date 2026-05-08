import { QURAN_CROSS_ROOTS, type CrossLangRoot } from "@/lib/crossLanguageRoots";
import type { WordCorpusFile } from "@/lib/quranWordCorpus";

/** কোয়েরি টেক্সটের সাথে মেলানো কুরেটেড রুট (বহুভাষা মিল)। */
export function findRootsMatchingQuery(query: string): CrossLangRoot[] {
  const q = query.trim();
  if (!q) return [];
  return QURAN_CROSS_ROOTS.filter(
    (r) =>
      r.matchArabicSlice(q) ||
      r.matchEnglishSlice(q) ||
      r.matchBengaliSlice(q) ||
      r.matchLatinSlice(q),
  );
}

/** শব্দকorpus থেকে আয়াত কী (`surah:ayah`) যেখানে আরবি লাইনে রুটের 패턴 মেলে। */
export function ayahKeysMatchingArabicRoots(
  corpus: WordCorpusFile,
  roots: CrossLangRoot[],
): string[] {
  if (roots.length === 0) return [];
  const keys: string[] = [];
  for (const [key, words] of Object.entries(corpus.ayahs)) {
    const line = words.map((w) => w[0]).join(" ");
    if (roots.some((r) => r.matchArabicSlice(line))) keys.push(key);
  }
  return keys;
}

export type ParsedAyahKey = { surah: number; ayah: number };

export function parseAyahKey(key: string): ParsedAyahKey | null {
  const m = /^(\d+):(\d+)$/.exec(key.trim());
  if (!m) return null;
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  if (!Number.isFinite(surah) || !Number.isFinite(ayah)) return null;
  return { surah, ayah };
}
