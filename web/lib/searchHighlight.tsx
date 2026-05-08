import type { ReactNode } from "react";

import { crossRootsMatchingAnchor } from "@/lib/crossLanguageRoots";
import type { AyahRecord } from "@/lib/types";

import { countNormalizedTermInText, normalizeForSearch } from "@/lib/searchQuery";

export const MARK_CLASS =
  "rounded px-0.5 py-[0.05rem] bg-amber-200/95 text-[var(--islamic-ink)] [box-decoration-break:clone] dark:bg-amber-500/40 dark:text-amber-50";

export type FieldHighlightRanges = {
  bengali: [number, number][];
  english: [number, number][];
  arabic: [number, number][];
  latin: [number, number][];
  bengaliScript: [number, number][];
};

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** ফাঁকা ছাড়া টোকেন; ইংরেজি টোকেনের জন্য সহজ ডিডুপ (ছোট হাত)। */
export function uniqueSearchTerms(query: string): string[] {
  const raw = query.trim().split(/\s+/).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    const key = /[\u0000-\u007f]/.test(t) ? t.toLowerCase() : t;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

/** Python `rebuild_search_blob` — `r._searchText` এর সাথে মিলিয়ে নিন। */
export function rebuildSearchBlob(r: AyahRecord): string {
  const parts = [
    r.bengaliTransliterationScript || "",
    r.bengaliTranslation || "",
    r.latinTransliteration || "",
    r.englishTranslation || "",
    r.arabicText || "",
  ].filter((p) => p.length > 0);
  return parts.join(" ");
}

type SegmentField = "bn_script" | "bn" | "latin" | "en" | "ar";

export function getSearchTextSegments(r: AyahRecord): Array<{
  field: SegmentField;
  start: number;
  end: number;
  text: string;
}> {
  const ordered = [
    { field: "bn_script" as const, text: r.bengaliTransliterationScript || "" },
    { field: "bn" as const, text: r.bengaliTranslation || "" },
    { field: "latin" as const, text: r.latinTransliteration || "" },
    { field: "en" as const, text: r.englishTranslation || "" },
    { field: "ar" as const, text: r.arabicText || "" },
  ].filter((x) => x.text.length > 0);

  let offset = 0;
  const out: Array<{
    field: SegmentField;
    start: number;
    end: number;
    text: string;
  }> = [];
  for (const o of ordered) {
    if (out.length > 0) offset += 1;
    out.push({
      field: o.field,
      start: offset,
      end: offset + o.text.length,
      text: o.text,
    });
    offset += o.text.length;
  }
  return out;
}

export function mergeRanges(ranges: [number, number][]): [number, number][] {
  if (ranges.length === 0) return [];
  const s = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  let cs = s[0]![0];
  let ce = s[0]![1];
  for (let i = 1; i < s.length; i++) {
    const [a, b] = s[i]!;
    if (a <= ce) ce = Math.max(ce, b);
    else {
      out.push([cs, ce]);
      cs = a;
      ce = b;
    }
  }
  out.push([cs, ce]);
  return out;
}

export function findAllMatchRanges(
  text: string,
  terms: string[],
): [number, number][] {
  const lit = findAllMatchRangesLiteral(text, terms);
  if (lit.length > 0) return lit;
  return findAllMatchRangesNormMapped(text, terms);
}

function findAllMatchRangesLiteral(
  text: string,
  terms: string[],
): [number, number][] {
  if (!text || terms.length === 0) return [];
  const pattern = terms
    .map(escapeRegExp)
    .sort((a, b) => b.length - a.length)
    .join("|");
  if (!pattern) return [];
  const re = new RegExp(pattern, "giu");
  const out: [number, number][] = [];
  for (const m of text.matchAll(re)) {
    if (m.index === undefined) continue;
    out.push([m.index, m.index + m[0].length]);
  }
  return mergeRanges(out);
}

/**
 * নর্মালাইজড সার্চ স্ট্রিং (আরবি আলিফ + NFC ইত্যাদি) অনুযায়ী মিল; অরিজিনাল টেক্সটের ইনডেক্সে ম্যাপ।
 */
function buildSearchNormOrigMap(original: string): {
  norm: string;
  origStart: number[];
} {
  const parts: string[] = [];
  const origStart: number[] = [];
  const seg = [
    ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
      original,
    ),
  ];
  for (const { segment, index } of seg) {
    const n = normalizeForSearch(segment);
    for (let i = 0; i < n.length; ) {
      const cp = n.codePointAt(i)!;
      const w = cp > 0xffff ? 2 : 1;
      origStart.push(index);
      parts.push(String.fromCodePoint(cp));
      i += w;
    }
  }
  return { norm: parts.join(""), origStart };
}

function origRangeCoveringNormSlice(
  original: string,
  origStart: number[],
  a: number,
  b: number,
): [number, number] | null {
  if (a >= b || a < 0 || b > origStart.length) return null;
  const oa = Math.min(...origStart.slice(a, b));
  const lastStart = origStart[b - 1]!;
  const seg = [
    ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
      original,
    ),
  ];
  for (const s of seg) {
    if (s.index <= lastStart && lastStart < s.index + s.segment.length) {
      return [oa, s.index + s.segment.length];
    }
  }
  return [oa, Math.min(original.length, lastStart + 1)];
}

function findAllMatchRangesNormMapped(
  text: string,
  terms: string[],
): [number, number][] {
  if (!text || terms.length === 0) return [];
  const { norm, origStart } = buildSearchNormOrigMap(text);
  if (norm.length !== origStart.length) return [];
  const nTerms = terms
    .map((t) => normalizeForSearch(t))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (nTerms.length === 0) return [];
  const pattern = nTerms.map(escapeRegExp).join("|");
  const re = new RegExp(pattern, "giu");
  const out: [number, number][] = [];
  for (const m of norm.matchAll(re)) {
    if (m.index === undefined) continue;
    const a = m.index;
    const b = a + m[0].length;
    const rng = origRangeCoveringNormSlice(text, origStart, a, b);
    if (rng) out.push(rng);
  }
  return mergeRanges(out);
}

/** আনুপাতিক অক্ষরস্থান থেকে পুরো শব্দের [start,end) — আরবি কম্বাইনিং সহ। */
export function findWordRangeAtRatio(
  text: string,
  ratio: number,
): [number, number] | null {
  if (!text.length) return null;
  const r = Math.max(0, Math.min(1, ratio));
  let target = Math.floor(r * text.length);
  if (target >= text.length) target = text.length - 1;

  const isW = (i: number) =>
    i >= 0 &&
    i < text.length &&
    /[\p{L}\p{M}\p{N}]/u.test(text[i]!);

  if (!isW(target)) {
    let f = target;
    while (f < text.length && !isW(f)) f++;
    if (f < text.length) target = f;
    else {
      let b = target;
      while (b >= 0 && !isW(b)) b--;
      if (b < 0) return null;
      target = b;
    }
  }

  let lo = target;
  let hi = target + 1;
  while (lo > 0 && isW(lo - 1)) lo--;
  while (hi < text.length && isW(hi)) hi++;
  return lo < hi ? [lo, hi] : null;
}

function countTermInText(text: string | undefined, term: string): number {
  return countNormalizedTermInText(text, term);
}

/**
 * ফলাফলের আরবি/বাংলা/ইংরেজি ক্ষেত্রে সার্চ টোকেনের মোট উপস্থিতি।
 */
export function countSearchWordHits(
  results: AyahRecord[],
  query: string,
): number {
  const terms = uniqueSearchTerms(query);
  if (terms.length === 0) return 0;
  let total = 0;
  for (const rec of results) {
    for (const term of terms) {
      total += countTermInText(rec.arabicText, term);
      total += countTermInText(rec.bengaliTranslation, term);
      total += countTermInText(rec.englishTranslation, term);
    }
  }
  return total;
}

type CandidateKey =
  | "bengali"
  | "english"
  | "arabic"
  | "latin"
  | "bengaliScript";

function segmentToCandidateKey(field: SegmentField): CandidateKey {
  switch (field) {
    case "bn_script":
      return "bengaliScript";
    case "bn":
      return "bengali";
    case "latin":
      return "latin";
    case "en":
      return "english";
    case "ar":
      return "arabic";
  }
}

/**
 * সার্চ-ফলাফল হাইলাইটের জন্য প্রতিটি ফিল্ডে অক্ষর দূরত্ব।
 * crossLanguage: যে ভাষায় টাইপই হোক, অন্য ভাষায় আনুপাতিক একই অবস্থানের শব্দও হাইলাইট।
 */
export function getFieldHighlightRanges(
  r: AyahRecord,
  query: string,
  options?: { crossLanguage?: boolean },
): FieldHighlightRanges {
  const empty: FieldHighlightRanges = {
    bengali: [],
    english: [],
    arabic: [],
    latin: [],
    bengaliScript: [],
  };

  const terms = uniqueSearchTerms(query);
  if (terms.length === 0) return empty;

  const bn = r.bengaliTranslation || "";
  const en = r.englishTranslation || "";
  const ar = r.arabicText || "";
  const lat = r.latinTransliteration || "";
  const bns = r.bengaliTransliterationScript || "";

  let litBn = findAllMatchRanges(bn, terms);
  let litEn = findAllMatchRanges(en, terms);
  let litAr = findAllMatchRanges(ar, terms);
  let litLat = findAllMatchRanges(lat, terms);
  let litBns = findAllMatchRanges(bns, terms);

  const cross = options?.crossLanguage ?? false;

  type Cand = { key: CandidateKey; text: string; lit: [number, number][] };
  const candidates: Cand[] = [
    { key: "bengali", text: bn, lit: litBn },
    { key: "english", text: en, lit: litEn },
    { key: "arabic", text: ar, lit: litAr },
    { key: "latin", text: lat, lit: litLat },
    { key: "bengaliScript", text: bns, lit: litBns },
  ];

  const hadDirectStringMatch = new Map<CandidateKey, boolean>(
    candidates.map((c) => [c.key, c.lit.length > 0]),
  );

  const assignLit = (key: CandidateKey, v: [number, number][]) => {
    const c = candidates.find((x) => x.key === key)!;
    c.lit = v;
    if (key === "bengali") litBn = v;
    else if (key === "english") litEn = v;
    else if (key === "arabic") litAr = v;
    else if (key === "latin") litLat = v;
    else litBns = v;
  };

  let anchor: Cand | null = candidates.find((c) => c.lit.length > 0) ?? null;

  if (!anchor && cross) {
    const blob = r._searchText?.length ? r._searchText : rebuildSearchBlob(r);
    const blobMatches = findAllMatchRanges(blob, terms);
    if (blobMatches.length > 0) {
      const [gs, ge] = blobMatches[0]!;
      const segs = getSearchTextSegments(r);
      const seg = segs.find((s) => gs >= s.start && gs < s.end);
      if (seg) {
        const ck = segmentToCandidateKey(seg.field);
        const localS = Math.max(0, gs - seg.start);
        const localE = Math.min(seg.text.length, ge - seg.start);
        if (localE > localS) {
          const nr = mergeRanges([[localS, localE]]);
          assignLit(ck, nr);
          anchor = candidates.find((c) => c.key === ck)!;
        }
      }
    }
  }

  const rootAugmentedKey = new Set<CandidateKey>();

  if (cross && anchor && anchor.lit.length > 0) {
    const mergedSlices = anchor.lit
      .map(([s, e]) => anchor!.text.slice(s, e))
      .join(" ");
    const anchorRootKey: "arabic" | "english" | "bengali" | "latin" =
      anchor.key === "bengaliScript"
        ? "bengali"
        : anchor.key;
    const roots = crossRootsMatchingAnchor(anchorRootKey, mergedSlices);

    const addNeedleRanges = (
      key: CandidateKey,
      text: string,
      needles: string[],
    ) => {
      if (key === anchor.key) return;
      if (hadDirectStringMatch.get(key)) return;
      if (!text.length || !needles.length) return;
      const acc: [number, number][] = [];
      for (const needle of needles) {
        acc.push(...findAllMatchRanges(text, [needle]));
      }
      const mergedNeedles = mergeRanges(acc);
      if (!mergedNeedles.length) return;
      if (key === "bengali") {
        litBn = mergeRanges([...litBn, ...mergedNeedles]);
        assignLit("bengali", litBn);
      } else if (key === "english") {
        litEn = mergeRanges([...litEn, ...mergedNeedles]);
        assignLit("english", litEn);
      } else if (key === "arabic") {
        litAr = mergeRanges([...litAr, ...mergedNeedles]);
        assignLit("arabic", litAr);
      } else if (key === "latin") {
        litLat = mergeRanges([...litLat, ...mergedNeedles]);
        assignLit("latin", litLat);
      } else {
        litBns = mergeRanges([...litBns, ...mergedNeedles]);
        assignLit("bengaliScript", litBns);
      }
      rootAugmentedKey.add(key);
    };

    for (const root of roots) {
      addNeedleRanges("bengali", bn, root.bengaliNeedles);
      addNeedleRanges("english", en, root.englishNeedles);
      addNeedleRanges("latin", lat, root.latinNeedles);
    }
  }

  if (cross && anchor && anchor.lit.length > 0) {
    const anchorLen = anchor.text.length || 1;
    for (const [s, e] of anchor.lit) {
      const ratio = (s + e) / 2 / anchorLen;
      for (const c of candidates) {
        if (c.key === anchor.key) continue;
        if (hadDirectStringMatch.get(c.key)) continue;
        if (rootAugmentedKey.has(c.key)) continue;
        if (!c.text.length) continue;
        const w = findWordRangeAtRatio(c.text, ratio);
        if (w) assignLit(c.key, mergeRanges([...c.lit, w]));
      }
    }
  }

  return {
    bengali: mergeRanges(litBn),
    english: mergeRanges(litEn),
    arabic: mergeRanges(litAr),
    latin: mergeRanges(litLat),
    bengaliScript: mergeRanges(litBns),
  };
}

export function highlightWithRanges(
  text: string | undefined,
  ranges: [number, number][],
): ReactNode {
  if (!text) return null;
  const merged = mergeRanges(
    ranges.filter(([s, e]) => s >= 0 && e <= text.length && s < e),
  );
  if (merged.length === 0) return text;
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  for (const [s, e] of merged) {
    if (cursor < s) {
      parts.push(<span key={key++}>{text.slice(cursor, s)}</span>);
    }
    parts.push(
      <mark key={key++} className={MARK_CLASS}>
        {text.slice(s, e)}
      </mark>,
    );
    cursor = e;
  }
  if (cursor < text.length) {
    parts.push(<span key={key++}>{text.slice(cursor)}</span>);
  }
  return parts;
}

/**
 * প্রদত্ত সার্চ কোয়েরি দিয়ে টেক্সটে মিলগুলো &lt;mark&gt; করে।
 */
export function highlightPlain(
  text: string | undefined,
  query: string,
): ReactNode {
  if (!text) return null;
  const trimmed = query.trim();
  if (!trimmed) return text;
  const terms = uniqueSearchTerms(trimmed);
  if (terms.length === 0) return text;
  return highlightWithRanges(text, findAllMatchRanges(text, terms));
}
