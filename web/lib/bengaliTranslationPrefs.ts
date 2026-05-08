import {
  DEFAULT_BENGALI_PRIMARY_ID,
  DEFAULT_BENGALI_VISIBLE_IDS,
  BENGALI_TRANSLATION_SOURCES,
} from "@/lib/bengaliTranslationCatalog";

const K_PRIMARY = "al-bayyinah-bn-primary";
const K_VISIBLE = "al-bayyinah-bn-visible";

function validId(id: string): boolean {
  return BENGALI_TRANSLATION_SOURCES.some((s) => s.id === id);
}

export function readBengaliPrimaryId(): string {
  if (typeof window === "undefined") return DEFAULT_BENGALI_PRIMARY_ID;
  try {
    const v = window.localStorage.getItem(K_PRIMARY)?.trim();
    if (v && validId(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_BENGALI_PRIMARY_ID;
}

export function writeBengaliPrimaryId(id: string): void {
  if (typeof window === "undefined") return;
  if (!validId(id)) return;
  try {
    window.localStorage.setItem(K_PRIMARY, id);
  } catch {
    /* ignore */
  }
}

export function readBengaliVisibleIds(): string[] {
  if (typeof window === "undefined") return [...DEFAULT_BENGALI_VISIBLE_IDS];
  try {
    const raw = window.localStorage.getItem(K_VISIBLE);
    if (!raw) return [...DEFAULT_BENGALI_VISIBLE_IDS];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_BENGALI_VISIBLE_IDS];
    const clean = parsed.filter(
      (x): x is string => typeof x === "string" && validId(x),
    );
    const uniq = [...new Set(clean)];
    if (uniq.length < 1) return [...DEFAULT_BENGALI_VISIBLE_IDS];
    return uniq;
  } catch {
    return [...DEFAULT_BENGALI_VISIBLE_IDS];
  }
}

export function writeBengaliVisibleIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  let clean = [...new Set(ids.filter(validId))];
  if (clean.length < 1) clean = [DEFAULT_BENGALI_PRIMARY_ID];
  try {
    window.localStorage.setItem(K_VISIBLE, JSON.stringify(clean));
  } catch {
    /* ignore */
  }
}
