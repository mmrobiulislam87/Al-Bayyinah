import { NextRequest, NextResponse } from "next/server";

import { loadAllAyahsServer } from "@/lib/serverJsonData";
import { queryMatchesHaystack, type SearchMode } from "@/lib/searchQuery";

export const runtime = "nodejs";

function clampLimit(raw: string | null): number {
  const n = Number(raw ?? "80");
  if (!Number.isFinite(n)) return 80;
  return Math.min(300, Math.max(1, Math.floor(n)));
}

/**
 * অনুবাদ/লাতিন/বাংলা ব্লব (`_searchText`) জুড়ে অর্থ-সহায়ক টোকেন মিল।
 * ভেক্টর এম্বেডিং নয় — পরবর্তীতে pgvector এর পাশাপাশি চালু রাখা যাবে।
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const modeRaw = req.nextUrl.searchParams.get("mode") ?? "partial";
  const mode: SearchMode = modeRaw === "exact" ? "exact" : "partial";
  const limit = clampLimit(req.nextUrl.searchParams.get("limit"));

  if (!q) {
    return NextResponse.json({
      q: "",
      mode,
      layer: "translation_blob_fts_style",
      hintBn:
        "এটি ইংরেজি/বাংলা/লাতিন অনুবাদ স্তরে টোকেন মিল; ভেক্টর সিমান্টিক সার্চ আলাদা ইনফ্রা চায়।",
      hits: [] as {
        surah: number;
        ayah: number;
        previewBn: string;
        previewEn: string;
      }[],
    });
  }

  try {
    const rows = loadAllAyahsServer();
    const hits: {
      surah: number;
      ayah: number;
      previewBn: string;
      previewEn: string;
    }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]!;
      const blob = r._searchText?.length ? r._searchText : "";
      if (!queryMatchesHaystack(blob, q, mode)) continue;
      hits.push({
        surah: r.surah,
        ayah: r.ayah,
        previewBn: (r.bengaliTranslation ?? "").slice(0, 220),
        previewEn: (r.englishTranslation ?? "").slice(0, 220),
      });
      if (hits.length >= limit) break;
    }

    return NextResponse.json({
      q,
      mode,
      layer: "translation_blob_fts_style",
      hintBn:
        "ফল আরবি+অনুবাদ মিশ্র ব্লবে মিলের ভিত্তিতে; ভাষাগত নিবিড় সিমিলারিটির জন্য ভেক্টর স্তর যোগ করা হবে।",
      total: hits.length,
      hits,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "আয়াত ডাটা লোড ব্যর্থ।" },
      { status: 500 },
    );
  }
}
