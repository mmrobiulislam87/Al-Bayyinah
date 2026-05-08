import {
  citeQuranApaParenthetical,
  citeQuranBibliographyApaLine,
  citeQuranBibliographyMlaLine,
  citeQuranMlaParenthetical,
} from "@/lib/citationQuran";

const STORAGE_KEY = "albayyinah_research_notes_v1";

const VERSE_KEY_RE = /^\d{1,3}:\d{1,3}$/;

/** সূরা:আয়াত কী বৈধ কিনা (১–১১৪, আয়াত ≥ ১)। */
export function isValidResearchVerseKey(key: string): boolean {
  const k = key.trim();
  if (!VERSE_KEY_RE.test(k)) return false;
  const [s, a] = k.split(":").map(Number);
  if (!Number.isFinite(s) || !Number.isFinite(a)) return false;
  if (s < 1 || s > 114 || a < 1) return false;
  return true;
}

export type ResearchLabNote = {
  verseKey: string;
  body: string;
  updatedAt: number;
};

function safeParse(raw: string | null): ResearchLabNote[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw) as unknown;
    if (!Array.isArray(j)) return [];
    const out: ResearchLabNote[] = [];
    for (const x of j) {
      if (!x || typeof x !== "object") continue;
      const o = x as Record<string, unknown>;
      const verseKey =
        typeof o.verseKey === "string" ? o.verseKey.trim() : "";
      const body = typeof o.body === "string" ? o.body : "";
      const updatedAt =
        typeof o.updatedAt === "number" ? o.updatedAt : Date.now();
      if (!isValidResearchVerseKey(verseKey)) continue;
      out.push({ verseKey, body, updatedAt });
    }
    return out;
  } catch {
    return [];
  }
}

function writeAll(notes: ResearchLabNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function listResearchLabNotes(): ResearchLabNote[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );
}

export function upsertResearchLabNote(verseKey: string, body: string): void {
  if (typeof window === "undefined") return;
  const key = verseKey.trim();
  if (!isValidResearchVerseKey(key)) return;
  const rest = safeParse(localStorage.getItem(STORAGE_KEY)).filter(
    (n) => n.verseKey !== key,
  );
  rest.push({ verseKey: key, body: body.trim(), updatedAt: Date.now() });
  writeAll(rest);
}

export function deleteResearchLabNote(verseKey: string): void {
  if (typeof window === "undefined") return;
  const key = verseKey.trim();
  const rest = safeParse(localStorage.getItem(STORAGE_KEY)).filter(
    (n) => n.verseKey !== key,
  );
  writeAll(rest);
}

/** এক্সপোর্ট — গবেষণা খসড়া; চূড়ান্ত উদ্ধৃতি স্টাইল গাইড যাচাই করুন। */
export function exportResearchNotesDelimited(
  style: "apa" | "mla",
): string {
  const notes = listResearchLabNotes().sort((a, b) =>
    a.verseKey.localeCompare(b.verseKey, undefined, { numeric: true }),
  );
  const lines: string[] = [
    "Al-Bayyinah — গবেষকের নোট এক্সপোর্ট",
    `স্টাইল: ${style.toUpperCase()} (সংক্ষিপ্ত টেমপ্লেট)`,
    "",
  ];
  for (const n of notes) {
    const [ss, aa] = n.verseKey.split(":").map(Number);
    if (!Number.isFinite(ss) || !Number.isFinite(aa)) continue;
    const inText =
      style === "apa"
        ? citeQuranApaParenthetical(ss, aa)
        : citeQuranMlaParenthetical(ss, aa);
    const bib =
      style === "apa"
        ? citeQuranBibliographyApaLine(ss, aa)
        : citeQuranBibliographyMlaLine(ss, aa);
    lines.push(`--- ${n.verseKey} —`, inText, n.body || "(খালি)", "", bib, "");
  }
  return lines.join("\n");
}
