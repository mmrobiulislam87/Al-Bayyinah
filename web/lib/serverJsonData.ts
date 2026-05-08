import fs from "fs";
import path from "path";

import type { AyahRecord } from "@/lib/types";
import type { WordCorpusFile } from "@/lib/quranWordCorpus";

export type SearchIndexRow = { id: string; s: number; a: number; t: string };

let corpusCache: WordCorpusFile | null = null;
let searchIndexCache: SearchIndexRow[] | null = null;
let allAyahsCache: AyahRecord[] | null = null;

function publicDataPath(rel: string): string {
  return path.join(process.cwd(), "public", "data", rel);
}

export function loadWordCorpusServer(): WordCorpusFile {
  if (corpusCache) return corpusCache;
  const raw = fs.readFileSync(publicDataPath("word-corpus.json"), "utf8");
  corpusCache = JSON.parse(raw) as WordCorpusFile;
  return corpusCache;
}

export function loadSearchIndexServer(): SearchIndexRow[] {
  if (searchIndexCache) return searchIndexCache;
  const raw = fs.readFileSync(publicDataPath("search-index.json"), "utf8");
  searchIndexCache = JSON.parse(raw) as SearchIndexRow[];
  return searchIndexCache;
}

/** সব সূরা JSON মিলিয়ে — অনুবাদ-ভিত্তিক গবেষণা API এর জন্য (মেমোরি-ক্যাশ)। */
export function loadAllAyahsServer(): AyahRecord[] {
  if (allAyahsCache) return allAyahsCache;
  const out: AyahRecord[] = [];
  for (let s = 1; s <= 114; s++) {
    const raw = fs.readFileSync(
      publicDataPath(`surah/${s}.json`),
      "utf8",
    );
    const rows = JSON.parse(raw) as AyahRecord[];
    out.push(...rows);
  }
  allAyahsCache = out;
  return out;
}
