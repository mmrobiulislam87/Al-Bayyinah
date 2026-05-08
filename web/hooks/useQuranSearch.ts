"use client";

/**
 * সার্চ: প্রথমে `GET /api/search` (partial/exact + roots); ত্রুটি হলে ক্লায়েন্টে `search-index.json`।
 */

import { useCallback, useEffect, useState } from "react";

import { ayahMatchesQuery, queryMatchesHaystack, type SearchMode } from "@/lib/searchQuery";
import { fetchAyahRecords } from "@/lib/surahData";
import type { AyahRecord } from "@/lib/types";

type SearchIndexRow = { id: string; s: number; a: number; t: string };

type SearchBundle = {
  rows: SearchIndexRow[];
};

export type QuranSearchProgress = "idle" | "loading" | "ready" | "error";

type Options = {
  /** হোম: true — ইনডেক্স প্রথমে টানবে না। */
  lazy?: boolean;
};

export type SearchOptions = {
  mode?: SearchMode;
  mergeRoots?: boolean;
};

export function useQuranSearch(options?: Options) {
  const lazy = options?.lazy ?? false;
  const [bundle, setBundle] = useState<SearchBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<QuranSearchProgress>(
    lazy ? "idle" : "loading",
  );
  const [active, setActive] = useState(!lazy);

  const activateSearch = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (!active) return;
    if (bundle) return;
    let cancelled = false;
    setProgress("loading");
    setError(null);

    (async () => {
      try {
        const res = await fetch("/data/search-index.json");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} — search-index.json`);
        }
        const rows = (await res.json()) as SearchIndexRow[];
        if (cancelled) return;
        setBundle({ rows });
        setProgress("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "লোড ব্যর্থ");
        setProgress("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, bundle]);

  const searchRecordsLocal = useCallback(
    async (
      q: string,
      limit = 120,
      mode: SearchMode = "partial",
    ): Promise<AyahRecord[]> => {
      if (!bundle || !q.trim()) return [];
      const trimmed = q.trim();
      const keys: { surah: number; ayah: number }[] = [];
      for (let i = 0; i < bundle.rows.length; i++) {
        const row = bundle.rows[i]!;
        if (queryMatchesHaystack(row.t, trimmed, mode)) {
          keys.push({ surah: row.s, ayah: row.a });
          if (keys.length >= limit) break;
        }
      }
      const resolved = await fetchAyahRecords(keys);
      const out = resolved.filter((r): r is AyahRecord => r != null);
      return out.filter((r) => ayahMatchesQuery(r, trimmed, mode));
    },
    [bundle],
  );

  const searchRecords = useCallback(
    async (
      q: string,
      limit = 120,
      opts?: SearchOptions,
    ): Promise<AyahRecord[]> => {
      const trimmed = q.trim();
      if (!trimmed) return [];
      const mode = opts?.mode ?? "partial";
      const mergeRoots = opts?.mergeRoots ?? false;

      try {
        const u = new URL("/api/search", window.location.origin);
        u.searchParams.set("q", trimmed);
        u.searchParams.set("mode", mode);
        u.searchParams.set("roots", mergeRoots ? "1" : "0");
        u.searchParams.set("limit", String(limit));
        const res = await fetch(u.toString());
        if (!res.ok) throw new Error(`search api ${res.status}`);
        const data = (await res.json()) as {
          hits?: { surah: number; ayah: number }[];
        };
        const hits = Array.isArray(data.hits) ? data.hits : [];
        const resolved = await fetchAyahRecords(hits);
        return resolved.filter((r): r is AyahRecord => r != null);
      } catch {
        return searchRecordsLocal(trimmed, limit, mode);
      }
    },
    [searchRecordsLocal],
  );

  return {
    searchRecords,
    activateSearch,
    error,
    progress,
    indexReady: progress === "ready" && bundle != null,
  };
}
