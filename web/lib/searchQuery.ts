import type { AyahRecord } from "@/lib/types";

/** partial = সাবস্ট্রিং (ডিফল্ট); exact = টোকেন-পুরো মিল (শব্দ সীমান্ত)। */
export type SearchMode = "partial" | "exact";

/**
 * সার্চ/তুলনা: ইউনিকোড NFC + সাধারণ আরবি আলিফভেরিয়েন্ট একরকম করা (ٱ/أ/إ/آ → ا)।
 */
export function normalizeForSearch(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[\u0671\u0622\u0623\u0625]/g, "\u0627");
}

function searchTermsFromQuery(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => normalizeForSearch(t));
}

/** হেয়স্ট্যাক থেকে শব্দ টোকেন (ইউনিকোড লেটার; আরবি/বাংলা/ল্যাটিন)। */
export function tokenizeSearchHaystack(haystack: string): string[] {
  const re = /[\p{L}\p{M}\p{N}]+/gu;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(haystack)) !== null) {
    out.push(normalizeForSearch(m[0]));
  }
  return out;
}

/**
 * হেয়স্ট্যাকে সব কোয়েরি টোকেন — AND।
 * partial: নর্মালাইজড সাবস্ট্রিং; exact: ভাঙা টোকেনের সাথে সম্পূর্ণ মিল।
 */
export function queryMatchesHaystack(
  haystack: string,
  query: string,
  mode: SearchMode = "partial",
): boolean {
  const terms = searchTermsFromQuery(query);
  if (terms.length === 0) return false;
  if (mode === "partial") {
    const h = normalizeForSearch(haystack);
    return terms.every((t) => h.includes(t));
  }
  const words = tokenizeSearchHaystack(haystack);
  return terms.every((term) => words.some((w) => w === term));
}

/** `_searchText` বা একই গঠনের ব্লব — আয়াত কি কোয়েরির সাথে মেলে। */
export function ayahMatchesQuery(
  r: AyahRecord,
  query: string,
  mode: SearchMode = "partial",
): boolean {
  const blob =
    r._searchText ||
    [
      r.bengaliTransliterationScript,
      r.bengaliTranslation,
      r.latinTransliteration,
      r.englishTranslation,
      r.arabicText,
    ]
      .filter((p): p is string => Boolean(p && p.length))
      .join(" ");
  return queryMatchesHaystack(blob, query, mode);
}

/**
 * টেক্সটে নর্মালাইজড টার্ম কতবার মিলে (অবচয় হিসাব)।
 */
export function countNormalizedTermInText(
  text: string | undefined,
  term: string,
): number {
  if (!text || !term) return 0;
  const h = normalizeForSearch(text);
  const t = normalizeForSearch(term);
  if (!t) return 0;
  let n = 0;
  let i = 0;
  while ((i = h.indexOf(t, i)) !== -1) {
    n++;
    i += t.length;
  }
  return n;
}
