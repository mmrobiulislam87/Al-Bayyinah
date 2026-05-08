import { NextRequest, NextResponse } from "next/server";

import {
  ayahKeysMatchingArabicRoots,
  findRootsMatchingQuery,
  parseAyahKey,
} from "@/lib/rootExpansion";
import { queryMatchesHaystack, type SearchMode } from "@/lib/searchQuery";
import { loadSearchIndexServer, loadWordCorpusServer } from "@/lib/serverJsonData";

export const runtime = "nodejs";

function clampLimit(v: string | null, max = 200): number {
  const n = Number(v ?? "120");
  if (!Number.isFinite(n) || n < 1) return 120;
  return Math.min(Math.floor(n), max);
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const modeRaw = req.nextUrl.searchParams.get("mode") ?? "partial";
  const mode: SearchMode = modeRaw === "exact" ? "exact" : "partial";
  const rootsParam = req.nextUrl.searchParams.get("roots");
  const mergeRoots = rootsParam === "1" || rootsParam === "true";
  const limit = clampLimit(req.nextUrl.searchParams.get("limit"));

  if (!q) {
    return NextResponse.json({
      q: "",
      mode,
      mergeRoots,
      hits: [] as { surah: number; ayah: number }[],
      rootsApplied: [] as string[],
    });
  }

  try {
    const rows = loadSearchIndexServer();
    const roots = mergeRoots ? findRootsMatchingQuery(q) : [];
    const rootsApplied = roots.map((r) => r.id);

    const rootOrder: string[] = [];
    if (roots.length > 0) {
      const corpus = loadWordCorpusServer();
      rootOrder.push(...ayahKeysMatchingArabicRoots(corpus, roots));
    }

    const textMatches: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!;
      if (queryMatchesHaystack(row.t, q, mode)) {
        textMatches.push(`${row.s}:${row.a}`);
      }
    }

    const orderedKeys: string[] = [];
    const seen = new Set<string>();
    const pushKey = (id: string) => {
      if (seen.has(id)) return;
      seen.add(id);
      orderedKeys.push(id);
    };

    for (const id of rootOrder) pushKey(id);
    for (const id of textMatches) pushKey(id);

    const hits = orderedKeys
      .slice(0, limit)
      .map(parseAyahKey)
      .filter((x): x is NonNullable<typeof x> => x != null);

    return NextResponse.json({
      q,
      mode,
      mergeRoots,
      rootsApplied,
      hits,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "সার্চ ডাটা লোড করা যায়নি।" },
      { status: 500 },
    );
  }
}
