import { NextRequest, NextResponse } from "next/server";

import { stripArabicDiacritics } from "@/lib/crossLanguageRoots";
import { normalizeForSearch } from "@/lib/searchQuery";

export const runtime = "nodejs";

function normArTitle(s: string): string {
  return normalizeForSearch(stripArabicDiacritics(s))
    .trim()
    .replace(/[\u0640\u200c\u200d]/g, "");
}

function arabicTitleCandidates(surface: string): string[] {
  const n = normArTitle(surface);
  const out: string[] = [];
  const push = (x: string) => {
    const t = x.trim();
    if (t && !out.includes(t)) out.push(t);
  };
  push(surface);
  push(n);
  if (n.length > 2 && n.startsWith("ال")) push(n.slice(2));
  for (const p of ["و", "ف", "ب", "ل", "ك", "س"]) {
    if (n.startsWith(p) && n.length > 2) push(n.slice(p.length));
  }
  return out;
}

async function wiktionaryExtract(
  wiki: "en" | "bn",
  title: string,
): Promise<string | null> {
  const u = new URL(`https://${wiki}.wiktionary.org/w/api.php`);
  u.searchParams.set("action", "query");
  u.searchParams.set("prop", "extracts");
  u.searchParams.set("exintro", "1");
  u.searchParams.set("explaintext", "1");
  u.searchParams.set("titles", title);
  u.searchParams.set("format", "json");

  const res = await fetch(u.toString(), {
    headers: {
      "User-Agent": "Al-BayyinahDictionary/1.0 (Quran study; +https://github.com/)",
    },
    next: { revalidate: 86_400 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    query?: { pages?: Record<string, { extract?: string; missing?: boolean }> };
  };
  const pages = data.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (!page || page.missing || !page.extract) return null;
  return page.extract.trim().slice(0, 900);
}

async function freeDictionaryEn(word: string): Promise<string | null> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Al-BayyinahDictionary/1.0",
    },
    next: { revalidate: 86_400 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return null;
  const lines: string[] = [];
  for (const entry of data as Array<{
    meanings?: Array<{ definitions?: Array<{ definition?: string }> }>;
  }>) {
    for (const m of entry.meanings ?? []) {
      for (const d of m.definitions ?? []) {
        if (d.definition) lines.push(d.definition);
        if (lines.length >= 5) break;
      }
      if (lines.length >= 5) break;
    }
    if (lines.length >= 5) break;
  }
  if (lines.length === 0) return null;
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const lang = (req.nextUrl.searchParams.get("lang") ?? "en").toLowerCase();

  if (!q || q.length > 120) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (!["en", "ar", "bn"].includes(lang)) {
    return NextResponse.json({ ok: false, error: "invalid lang" }, { status: 400 });
  }

  try {
    if (lang === "en") {
      const gloss = await freeDictionaryEn(q);
      if (gloss) {
        return NextResponse.json({
          ok: true,
          source: "Free Dictionary API",
          text: gloss,
          glossEn: gloss.split("\n")[0] ?? gloss,
        });
      }
      const wt = await wiktionaryExtract("en", q);
      if (wt) {
        const line = wt.split("\n")[0] ?? wt;
        return NextResponse.json({
          ok: true,
          source: "Wiktionary (en)",
          text: wt,
          glossEn: line.slice(0, 320),
        });
      }
    } else if (lang === "bn") {
      const wtBn = await wiktionaryExtract("bn", q);
      if (wtBn) {
        const line = wtBn.split("\n")[0] ?? wtBn;
        return NextResponse.json({
          ok: true,
          source: "Wiktionary (bn)",
          text: wtBn,
          glossBn: line.slice(0, 400),
        });
      }
      const wtEn = await wiktionaryExtract("en", q);
      if (wtEn) {
        const line = wtEn.split("\n")[0] ?? wtEn;
        return NextResponse.json({
          ok: true,
          source: "Wiktionary (en)",
          text: wtEn,
          glossEn: line.slice(0, 320),
        });
      }
    } else if (lang === "ar") {
      for (const title of arabicTitleCandidates(q)) {
        const wt = await wiktionaryExtract("en", title);
        if (wt) {
          const line = wt.split("\n")[0] ?? wt;
          return NextResponse.json({
            ok: true,
            source: "Wiktionary (en) · Arabic",
            titleUsed: title,
            text: wt,
            glossEn: line.slice(0, 360),
          });
        }
      }
    }

    return NextResponse.json({ ok: false });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
