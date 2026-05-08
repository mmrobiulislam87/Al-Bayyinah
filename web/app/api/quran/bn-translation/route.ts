import { NextRequest, NextResponse } from "next/server";

import { BENGALI_TRANSLATION_SOURCES } from "@/lib/bengaliTranslationCatalog";

const QC_MAP = new Map(
  BENGALI_TRANSLATION_SOURCES.filter(
    (s) => s.kind === "quran_com" && s.quranComResourceId !== undefined,
  ).map((s) => [s.id, s.quranComResourceId!] as const),
);

/**
 * রিমোট বাংলা অনুবাদ — Quran.com (সার্ভার প্রক্সি, ক্যাশ সহ)।
 * GET /api/quran/bn-translation?surah=1&ayah=1&key=qc_zakaria
 */
export async function GET(req: NextRequest) {
  const s = Number(req.nextUrl.searchParams.get("surah"));
  const a = Number(req.nextUrl.searchParams.get("ayah"));
  const key = (req.nextUrl.searchParams.get("key") ?? "").trim();

  if (!Number.isInteger(s) || s < 1 || s > 114) {
    return NextResponse.json({ error: "surah" }, { status: 400 });
  }
  if (!Number.isInteger(a) || a < 1 || a > 300) {
    return NextResponse.json({ error: "ayah" }, { status: 400 });
  }

  const resourceId = QC_MAP.get(key);
  if (resourceId === undefined) {
    return NextResponse.json({ error: "key" }, { status: 400 });
  }

  const url = `https://api.quran.com/api/v4/verses/by_key/${s}:${a}?words=false&translations=${resourceId}`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "upstream", status: res.status },
        { status: 502 },
      );
    }
    const j = (await res.json()) as {
      verse?: { translations?: { text?: string }[] };
    };
    const text = j.verse?.translations?.[0]?.text ?? "";
    return NextResponse.json(
      { text },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json({ error: "fetch" }, { status: 502 });
  }
}
