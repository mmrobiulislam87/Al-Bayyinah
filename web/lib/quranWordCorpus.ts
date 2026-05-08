import { stripArabicDiacritics } from "@/lib/crossLanguageRoots";
import type { DictionaryLookup } from "@/lib/quranDictionary";
import { normalizeForSearch } from "@/lib/searchQuery";

/** v2: [Uthmani, gloss_bn, gloss_en, translit] · v1: [Uthmani, gloss_en, translit] */
export type WordCorpusFile = {
  v: number;
  source: string;
  ayahs: Record<string, string[][]>;
};

/** API সারি → স্থির আকার (পুরনো JSON সহন) */
export function normalizeWordRow(r: string[] | undefined): [
  string,
  string,
  string,
  string,
] {
  if (!r?.length) return ["", "", "", ""];
  const u = (r[0] ?? "").trim();
  if (r.length >= 4) {
    return [u, (r[1] ?? "").trim(), (r[2] ?? "").trim(), (r[3] ?? "").trim()];
  }
  if (r.length === 3) {
    return [u, "", (r[1] ?? "").trim(), (r[2] ?? "").trim()];
  }
  return [u, "", "", ""];
}

export function corpusRowGlosses(row: string[] | undefined): {
  uthmani: string;
  bn: string;
  en: string;
  tr: string;
} {
  const [u, bn, en, tr] = normalizeWordRow(row);
  return { uthmani: u, bn, en, tr };
}

let cache: WordCorpusFile | null = null;
let loadPromise: Promise<boolean> | null = null;

/**
 * /data/word-corpus.json লোড (একবার) — ব্যর্থ হলে false।
 */
export function ensureQuranWordCorpusLoaded(): Promise<boolean> {
  if (cache) return Promise.resolve(true);
  if (!loadPromise) {
    loadPromise = fetch("/data/word-corpus.json")
      .then((r) => {
        if (!r.ok) return null;
        return r.json() as Promise<WordCorpusFile>;
      })
      .then((j) => {
        if (j?.ayahs && typeof j.ayahs === "object") {
          cache = j;
          return true;
        }
        return false;
      })
      .catch(() => false);
  }
  return loadPromise;
}

export function isCorpusReady(): boolean {
  return cache != null;
}

/** ক্লায়েন্টে কorpus লোডের পর — আয়াতের শব্দ সারি (Uthmani, ইংরেজি গজ, প্রতিবর্ণ)। */
export function getCorpusAyahRow(
  surah: number,
  ayah: number,
): string[][] | null {
  if (!cache) return null;
  return cache.ayahs[`${surah}:${ayah}`] ?? null;
}

function normToken(s: string): string {
  return normalizeForSearch(stripArabicDiacritics(s))
    .trim()
    .replace(/[\u0640\u200c\u200d]/g, "")
    .replace(/\u0649/g, "\u064A");
}

/** ClickableAyahText-এর মতো — আরবি লাইন থেকে শব্দোক্ত টোকেন। */
export function extractArabicWordTokens(arabicLine: string): string[] {
  const out: string[] = [];
  const re = /[\p{L}\p{M}\p{N}]+/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(arabicLine)) !== null) out.push(m[0]);
  return out;
}

function toLookup(
  uth: string,
  bn: string,
  en: string,
  tr: string,
): DictionaryLookup {
  const e = en.trim();
  const glossEn = tr.trim() ? `${e} — ${tr.trim()}` : e;
  const glossBn =
    bn.trim() ||
    (e ? "বাংলা গজ এখনও নেই; ইংরেজি দেখুন বা `npm run build:corpus` চালান।" : "—");
  return {
    entry: {
      lemmaAr: uth,
      glossBn,
      glossEn: glossEn || "—",
    },
    matchedAs: "ar",
  };
}

/**
 * সুরা-আয়াত + পূর্ণ আরবি + ক্লিক করা পৃষ্ঠ শব্দ দিয়ে কorpus মিল।
 */
export function lookupCorpusForAyahWord(args: {
  surah: number;
  ayah: number;
  arabicLine: string;
  surface: string;
}): DictionaryLookup | null {
  if (!cache) return null;
  const key = `${args.surah}:${args.ayah}`;
  const row = cache.ayahs[key];
  if (!row?.length) return null;

  const ns = normToken(args.surface);
  if (!ns) return null;

  for (const raw of row) {
    const [t0, bn, en, tr] = normalizeWordRow(raw);
    if (normToken(t0) === ns) return toLookup(t0, bn, en, tr);
  }

  const tokens = extractArabicWordTokens(args.arabicLine);
  let uiIdx = tokens.findIndex((t) => normToken(t) === ns);
  if (uiIdx < 0) {
    uiIdx = tokens.findIndex(
      (t) =>
        t === args.surface ||
        normToken(t).includes(ns) ||
        ns.includes(normToken(t)),
    );
  }

  if (uiIdx >= 0 && uiIdx < row.length) {
    const [t0, bn, en, tr] = normalizeWordRow(row[uiIdx]!);
    const n0 = normToken(t0);
    const nUi = normToken(tokens[uiIdx]!);
    if (n0 === ns || nUi === ns || n0 === nUi) {
      return toLookup(t0, bn, en, tr);
    }
  }

  for (let i = 0; i < row.length; i++) {
    const [t0, bn, en, tr] = normalizeWordRow(row[i]!);
    const nt = normToken(t0);
    if (nt.includes(ns) || ns.includes(nt)) {
      if (uiIdx < 0 || i === uiIdx) return toLookup(t0, bn, en, tr);
    }
  }

  return null;
}
