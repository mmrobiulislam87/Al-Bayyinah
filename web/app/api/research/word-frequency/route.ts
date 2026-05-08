import { NextRequest, NextResponse } from "next/server";

import { countWordMatchesInCorpus } from "@/lib/wordFrequencyBuckets";
import { loadWordCorpusServer } from "@/lib/serverJsonData";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const needle = req.nextUrl.searchParams.get("needle")?.trim() ?? "";
  if (!needle) {
    return NextResponse.json({
      needle: "",
      makki: 0,
      madani: 0,
      totalTokens: 0,
    });
  }

  try {
    const corpus = loadWordCorpusServer();
    const stats = countWordMatchesInCorpus(corpus, needle);
    return NextResponse.json({ needle, ...stats });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "কorpus লোড করা যায়নি।" },
      { status: 500 },
    );
  }
}
