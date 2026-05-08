import { NextRequest, NextResponse } from "next/server";

/**
 * আয়াতের শব্দে শব্দে বাংলা সারি — Quran.com WBW (language=bn) translation gloss যোগ।
 * সম্পূর্ণ অনুবাদ নয়; উচ্চারণ/তিলাওয়াত অনুশীলনে বাংলা লিপিতে সহায়ক সারি।
 */
export async function GET(req: NextRequest) {
  const s = Number(req.nextUrl.searchParams.get("surah"));
  const a = Number(req.nextUrl.searchParams.get("ayah"));

  if (!Number.isInteger(s) || s < 1 || s > 114) {
    return NextResponse.json({ error: "surah" }, { status: 400 });
  }
  if (!Number.isInteger(a) || a < 1 || a > 300) {
    return NextResponse.json({ error: "ayah" }, { status: 400 });
  }

  const url = `https://api.quran.com/api/v4/verses/by_key/${s}:${a}?language=bn&words=true`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "upstream", status: res.status },
        { status: 502 },
      );
    }
    const j = (await res.json()) as {
      verse?: {
        words?: Array<{
          char_type_name?: string;
          translation?: { text?: string; language_name?: string };
        }>;
      };
    };
    const words = j.verse?.words ?? [];
    const parts: string[] = [];
    for (const w of words) {
      if (w.char_type_name !== "word") continue;
      const t = w.translation?.text?.trim();
      if (!t) continue;
      parts.push(t);
    }
    const line = parts.join(" · ");
    return NextResponse.json(
      { line: line || "" },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json({ error: "fetch" }, { status: 502 });
  }
}
