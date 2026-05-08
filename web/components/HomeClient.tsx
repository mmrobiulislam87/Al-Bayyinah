"use client";

/**
 * হোম পেজ: গ্লোবাল সার্চ + ১১৪ সূরার গ্রিড (ইসলামি থিম)।
 * সার্চ ইনডেক্স লেজি লোড — প্রথম পেইজ হালকা।
 */

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { AyahBlock } from "@/components/AyahBlock";
import { useQuranSearch } from "@/hooks/useQuranSearch";
import { formatAyahHash } from "@/lib/juz";
import { toBengaliDigits } from "@/lib/numberBn";
import { countSearchWordHits } from "@/lib/searchHighlight";
import type { SearchMode } from "@/lib/searchQuery";
import type { AyahRecord } from "@/lib/types";
import SurahCatalog from "@/components/SurahCatalog";

export default function HomeClient() {
  const { searchRecords, activateSearch, error } = useQuranSearch({
    lazy: true,
  });
  const [query, setQuery] = useState("");
  const dq = useDeferredValue(query.trim());
  const [results, setResults] = useState<AyahRecord[]>([]);
  const [searchBusy, setSearchBusy] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("partial");
  const [mergeRoots, setMergeRoots] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q0 = new URLSearchParams(window.location.search).get("q");
    if (q0?.trim()) setQuery(q0.trim());
  }, []);

  useEffect(() => {
    if (dq) activateSearch();
  }, [dq, activateSearch]);

  useEffect(() => {
    if (!dq) {
      setResults([]);
      setSearchBusy(false);
      return;
    }
    let cancelled = false;
    setSearchBusy(true);
    (async () => {
      const r = await searchRecords(dq, 120, {
        mode: searchMode,
        mergeRoots,
      });
      if (!cancelled) {
        setResults(r);
        setSearchBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dq, searchRecords, searchMode, mergeRoots]);

  const searchSummary = useMemo(() => {
    if (!dq) return null;
    return {
      ayah: results.length,
      surah: new Set(results.map((r) => r.surah)).size,
      wordHits: countSearchWordHits(results, dq),
    };
  }, [dq, results]);

  return (
    <div className="flex flex-1 flex-col text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="sticky top-0 z-10 border-b border-[var(--islamic-teal)]/15 bg-[var(--islamic-parchment)]/92 px-4 py-4 shadow-sm backdrop-blur-md dark:border-teal-800/40 dark:bg-teal-950/90 sm:px-6 sm:py-5 lg:px-8 xl:px-10">
        <div className="flex w-full max-w-full flex-col gap-3 sm:gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal)] dark:text-teal-300 sm:text-2xl">
              অনুসন্ধান
            </h2>
            <p className="text-base text-[var(--islamic-ink-soft)] dark:text-teal-200/75 sm:text-lg">
              বহুভাষায় খুঁজুন — আংশিক বা টোকেন মিল; চাইলে রুট সম্প্রসারণ চালু রাখুন।
            </p>
          </div>
          <label className="sr-only" htmlFor="q">
            সার্চ
          </label>
          <input
            id="q"
            type="search"
            autoComplete="off"
            placeholder="যেমন: সালাত, prayer, رحمة…"
            value={query}
            onFocus={() => activateSearch()}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) setResults([]);
            }}
            className="min-h-12 w-full touch-manipulation rounded-xl border border-[var(--islamic-teal)]/20 bg-white/90 px-4 py-3 text-lg text-[var(--islamic-ink)] shadow-inner outline-none ring-[var(--islamic-teal)]/20 placeholder:text-stone-400 focus:border-[var(--islamic-gold)]/70 focus:ring-2 focus:ring-[var(--islamic-gold)]/35 disabled:cursor-not-allowed disabled:opacity-60 dark:border-teal-700/50 dark:bg-teal-950/60 dark:text-teal-50 dark:placeholder:text-teal-600 sm:min-h-11 sm:py-2.5 sm:text-base"
          />
          <fieldset className="flex flex-col gap-2 rounded-lg border border-[var(--islamic-teal)]/12 bg-white/60 px-3 py-3 text-sm dark:border-teal-800/35 dark:bg-teal-950/35 sm:px-4 sm:text-base">
            <legend className="sr-only">সার্চ মোড</legend>
            <div className="flex flex-wrap gap-3 font-[family-name:var(--font-bn)] text-[var(--islamic-ink)] dark:text-teal-100/90">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="radio"
                  name="searchMode"
                  checked={searchMode === "partial"}
                  onChange={() => setSearchMode("partial")}
                  className="accent-[var(--islamic-teal-deep)]"
                />
                আংশিক মিল
              </label>
              <label className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="radio"
                  name="searchMode"
                  checked={searchMode === "exact"}
                  onChange={() => setSearchMode("exact")}
                  className="accent-[var(--islamic-teal-deep)]"
                />
                টোকেন একদম মিল
              </label>
            </div>
            <label className="flex cursor-pointer items-center gap-2 font-[family-name:var(--font-bn)] text-[var(--islamic-ink)] dark:text-teal-100/90">
              <input
                type="checkbox"
                checked={mergeRoots}
                onChange={(e) => setMergeRoots(e.target.checked)}
                className="accent-[var(--islamic-teal-deep)]"
              />
              রুট সম্প্রসারণ (যেমন সালাত → আরবি মিলসহ আয়াত)
            </label>
          </fieldset>
          {dq && searchBusy && (
            <p className="text-sm text-[var(--islamic-teal)]/80 dark:text-teal-300/90">
              ফলাফল খুঁজে দেখা হচ্ছে…
            </p>
          )}
          {error && (
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          )}
        </div>
      </header>

      <main className="w-full max-w-full flex-1 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        {dq ? (
          <section aria-label="অনুসন্ধান ফলাফল">
            {dq && !searchBusy && !error && searchSummary ? (
              <div className="mb-4 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/80 px-4 py-3 text-sm shadow-sm dark:border-teal-800/45 dark:bg-teal-950/50">
                <p className="mb-2 font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
                  পরিসংখ্যান
                </p>
                <ul className="space-y-1 font-[family-name:var(--font-bn)] text-[var(--islamic-ink)] dark:text-teal-100/90">
                  <li>
                    মোট আয়াত (ফলাফল):{" "}
                    <span className="font-semibold text-[var(--islamic-teal)] dark:text-amber-200/95">
                      {toBengaliDigits(searchSummary.ayah)}
                    </span>
                  </li>
                  <li>
                    ভিন্ন সূরা:{" "}
                    <span className="font-semibold text-[var(--islamic-teal)] dark:text-amber-200/95">
                      {toBengaliDigits(searchSummary.surah)}
                    </span>
                  </li>
                  <li>
                    আরবি/বাংলা/ইংরেজি পাঠে শব্দের মোট মিল:{" "}
                    <span className="font-semibold text-[var(--islamic-teal)] dark:text-amber-200/95">
                      {toBengaliDigits(searchSummary.wordHits)}
                    </span>
                  </li>
                </ul>
              </div>
            ) : null}
            <ul className="flex flex-col gap-3">
              {results.map((r) => (
                <li key={r.id}>
                  <AyahBlock
                    r={r}
                    showSurahHeading
                    highlightQuery={dq}
                    searchHighlightCrossLanguage
                  />
                  <p className="mt-1 text-center text-xs text-[var(--islamic-teal)]/70 dark:text-teal-400/80">
                    <Link
                      href={`/surah/${r.surah}#${formatAyahHash(r.ayah)}`}
                      className="font-[family-name:var(--font-bn)] text-[var(--islamic-teal-deep)] underline decoration-[var(--islamic-gold)]/50 underline-offset-4 transition-colors hover:text-[var(--islamic-gold)] dark:text-teal-200 dark:hover:text-amber-200"
                    >
                      পুরো সূরায় এই আয়াত →
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
            {results.length === 0 && !searchBusy && !error && (
              <p className="text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
                কোনো মিল পাওয়া যায়নি।
              </p>
            )}
          </section>
        ) : (
          <SurahCatalog />
        )}
      </main>
    </div>
  );
}
