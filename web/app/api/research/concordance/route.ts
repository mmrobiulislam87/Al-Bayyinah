import { NextRequest, NextResponse } from "next/server";

import { collectConcordanceHits } from "@/lib/quranConcordance";
import { loadWordCorpusServer } from "@/lib/serverJsonData";
import type { SearchMode } from "@/lib/searchQuery";

export const runtime = "nodejs";

function clampLimit(raw: string | null): number {
  const n = Number(raw ?? "500");
  if (!Number.isFinite(n)) return 500;
  return Math.min(2000, Math.max(1, Math.floor(n)));
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const modeRaw = req.nextUrl.searchParams.get("mode") ?? "partial";
  const mode: SearchMode = modeRaw === "exact" ? "exact" : "partial";
  const limit = clampLimit(req.nextUrl.searchParams.get("limit"));

  if (!q) {
    return NextResponse.json({
      q: "",
      mode,
      limit,
      totalAyahs: 0,
      hits: [],
    });
  }

  try {
    const corpus = loadWordCorpusServer();
    const hits = collectConcordanceHits(corpus, q, mode, limit);
    return NextResponse.json({
      q,
      mode,
      limit,
      totalAyahs: hits.length,
      hits,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "কorpus লোড করা যায়নি।" },
      { status: 500 },
    );
  }
}
