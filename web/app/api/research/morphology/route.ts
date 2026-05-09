import { NextRequest, NextResponse } from "next/server";

import { getMorphologySemanticLayer } from "@/lib/morphologySemanticLayers";
import { findRootsMatchingQuery } from "@/lib/rootExpansion";

export const runtime = "nodejs";

/**
 * গবেষণা মরফোলজি — v1: ক্রস-ভাষা রুট মিল + দ্বিস্তরীয় অর্থ (লেক্সিক্যাল বনাম কোরআনিক পরিভাষা)।
 * পূর্ণ lemma/রূপ টেবিল (যেমন QAC ইমপোর্ট) যোগ হলে একই এন্ডপয়েন্টে response-এ নতুন ফিল্ড যোগ হবে — বিদ্যমান ক্লায়েন্ট ভাঙবে না।
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({
      q: "",
      layer: "morphology_semantic_v1",
      hintBn:
        "কোয়েরি দিন (?q=) — আরবি, বাংলা, ইংরেজি বা ল্যাটিন টোকেন। প্রত্যুত্তরে রুট সনাক্তকরণ ও পাওয়া গেলে «ভাষাগত ভিত্তি» বনাম «কোরআনিক পরিভাষা» আলাদা দেখানো হয়। হাদিস সংকলন ডাটা নেই।",
      roots: [] as {
        id: string;
        semantic: ReturnType<typeof getMorphologySemanticLayer>;
      }[],
      tokenMorphology: {
        status: "not_imported_yet" as const,
        hintBn:
          "lemma·বিভক্তি·ট্যাগসহ সম্পূর্ণ মরফোলজি টেবিল ইমপোর্ট হলে এই ব্লকে রূপপঞ্জি যুক্ত হবে।",
      },
    });
  }

  try {
    const matched = findRootsMatchingQuery(q);
    const roots = matched.map((r) => ({
      id: r.id,
      semantic: getMorphologySemanticLayer(r.id),
    }));

    return NextResponse.json({
      q,
      layer: "morphology_semantic_v1",
      hintBn:
        "উপরের স্তর কুরেটেড বহুভাষা রুট ও দ্বিস্তরীয় গ্লোস; নিচের tokenMorphology পূর্ণ কর্পাস মরফোলজির জন্য সংরক্ষিত।",
      roots,
      tokenMorphology: {
        status: "not_imported_yet" as const,
        hintBn:
          "Quranic Arabic Corpus ইত্যাদি সামঞ্জস্যপূর্ণ OSS টেবিল ইমপোর্টের পর lemma ও ব্যাকরণ ট্যাগ এখানে ফিরবে।",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "মরফোলজি অনুরোধ প্রক্রিয়াকরণ ব্যর্থ।" },
      { status: 500 },
    );
  }
}
