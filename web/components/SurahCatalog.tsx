"use client";

/**
 * হোমের ১১৪ সূরার সূচিপত্র — খুঁজে বের করা, মক্কী/মাদানী চিহ্ন, পঠনবান্ধব কার্ড।
 */

import Link from "next/link";
import { useMemo, useState } from "react";

import { getSurahMeta } from "@/lib/surahs";
import {
  getSurahRevelation,
  revelationLabelBn,
} from "@/lib/surahRevelation";
import { toBengaliDigits } from "@/lib/numberBn";

const NUMBERS = Array.from({ length: 114 }, (_, i) => i + 1);

function surahMatchesQuery(surahNum: number, raw: string): boolean {
  const t = raw.trim();
  if (!t) return true;
  const sm = getSurahMeta(surahNum)!;
  const lower = t.toLowerCase();
  if (String(surahNum) === t) return true;
  if (toBengaliDigits(surahNum) === t) return true;
  if (sm.nameBn.includes(t)) return true;
  if (sm.nameEn.toLowerCase().includes(lower)) return true;
  if (sm.nameAr.includes(t)) return true;
  return false;
}

export default function SurahCatalog() {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(
    () => NUMBERS.filter((n) => surahMatchesQuery(n, filter)),
    [filter],
  );

  return (
    <section
      aria-labelledby="surah-catalog-heading"
      className="relative overflow-hidden rounded-2xl border border-[var(--islamic-teal)]/10 bg-gradient-to-b from-[var(--islamic-parchment)]/45 to-transparent px-4 py-5 ring-1 ring-[var(--islamic-gold)]/10 dark:border-teal-800/35 dark:from-teal-950/40 dark:to-transparent dark:ring-amber-900/15 sm:px-5 sm:py-6 md:px-6"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[var(--islamic-teal)]/[0.06] blur-2xl dark:bg-teal-400/[0.07]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-12 h-40 w-40 rounded-full bg-[var(--islamic-gold)]/[0.08] blur-2xl dark:bg-amber-500/[0.06]"
        aria-hidden
      />

      <div className="relative">
        <div className="mb-5 flex flex-col gap-3 border-b border-[var(--islamic-gold)]/35 pb-5 dark:border-amber-800/35 sm:mb-6 sm:pb-6">
          <div>
            <h2
              id="surah-catalog-heading"
              className="font-[family-name:var(--font-bn)] text-2xl font-bold tracking-tight text-[var(--islamic-teal-deep)] dark:text-teal-50 sm:text-3xl"
            >
              সূরাসমূহ · সূচিপত্র
            </h2>
            <p
              className="mt-2 font-[family-name:var(--font-quran-ar)] text-2xl font-normal leading-snug tracking-tight text-[var(--islamic-teal-deep)] [text-shadow:0_1px_0_rgba(212,168,75,0.22)] dark:text-teal-100/95 dark:[text-shadow:0_1px_12px_rgba(45,212,191,0.12)] sm:text-3xl"
              dir="rtl"
              lang="ar"
            >
              سور القرآن
            </p>
            <p className="mt-2 max-w-3xl font-[family-name:var(--font-bn)] text-base leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-200/90 sm:text-lg">
              নম্বর বা নাম লিখে দ্রুত খুঁজুন। প্রতিটি কার্ড মক্কী বা মাদানী সূরা —
              রঙিন ট্যাগ দিয়ে সহজে চেনা যায়।
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="surah-filter"
                className="mb-1.5 block font-[family-name:var(--font-bn)] text-sm font-medium text-[var(--islamic-teal)] dark:text-teal-300"
              >
                সূরা খুঁজুন
              </label>
              <input
                id="surah-filter"
                type="search"
                autoComplete="off"
                placeholder="যেমন: ২, ফাতিহা, الرحمن, Yaseen…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="min-h-12 w-full touch-manipulation rounded-xl border border-[var(--islamic-teal)]/20 bg-white/90 px-4 py-3 text-base text-[var(--islamic-ink)] shadow-inner outline-none ring-[var(--islamic-teal)]/15 placeholder:text-stone-400 focus:border-[var(--islamic-gold)]/60 focus:ring-2 focus:ring-[var(--islamic-gold)]/30 dark:border-teal-700/50 dark:bg-teal-950/55 dark:text-teal-50 dark:placeholder:text-teal-600"
              />
            </div>
            <div
              className="flex shrink-0 flex-wrap items-center gap-4 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/95 sm:text-base"
              role="group"
              aria-label="প্রকাশস্থলের চিহ্ন"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600 shadow-[0_0_0_2px_rgba(15,76,68,0.2)] dark:bg-teal-400 dark:shadow-[0_0_0_2px_rgba(45,212,191,0.15)]"
                  aria-hidden
                />
                মক্কী
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-600 shadow-[0_0_0_2px_rgba(217,119,6,0.2)] dark:bg-amber-400 dark:shadow-[0_0_0_2px_rgba(251,191,36,0.12)]"
                  aria-hidden
                />
                মাদানী
              </span>
              <span className="text-[var(--islamic-teal)]/80 dark:text-teal-400/90">
                মোট {toBengaliDigits(114)} টি
              </span>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--islamic-teal)]/25 bg-white/50 px-4 py-8 text-center font-[family-name:var(--font-bn)] text-base text-[var(--islamic-ink-soft)] dark:border-teal-700/40 dark:bg-teal-950/35 dark:text-teal-300/90">
            এই অনুসন্ধানে কোনো সূরা মেলেনি। অন্য শব্দ বা নম্বর দিয়ে চেষ্টা করুন।
          </p>
        ) : (
          <>
            <p className="mb-3 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
              দেখাচ্ছে{" "}
              <span className="font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
                {toBengaliDigits(filtered.length)}
              </span>{" "}
              টি
            </p>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:gap-4">
              {filtered.map((n) => {
                const sm = getSurahMeta(n)!;
                const rev = getSurahRevelation(n);
                const isMadani = rev === "madani";
                const accentBar = isMadani
                  ? "border-l-amber-600/90 dark:border-l-amber-400/85"
                  : "border-l-teal-700/90 dark:border-l-teal-400/80";
                const badgeBg = isMadani
                  ? "from-amber-600/15 to-amber-500/5 text-amber-900 dark:from-amber-500/25 dark:to-amber-600/10 dark:text-amber-100"
                  : "from-teal-700/15 to-teal-600/5 text-[var(--islamic-teal-deep)] dark:from-teal-500/25 dark:to-teal-600/10 dark:text-teal-50";
                return (
                  <li key={n}>
                    <Link
                      href={`/surah/${n}`}
                      className={`group relative flex min-h-[4.5rem] touch-manipulation flex-col gap-1 rounded-2xl border border-[var(--islamic-teal)]/12 border-l-[3px] bg-white/90 px-3 py-3 pl-3 shadow-sm ${accentBar} transition-all duration-300 hover:z-[1] hover:-translate-y-0.5 hover:border-[var(--islamic-gold)]/40 hover:shadow-lg hover:shadow-[var(--islamic-teal)]/10 active:translate-y-0 active:scale-[0.99] dark:border-teal-800/45 dark:bg-teal-950/55 dark:hover:border-amber-600/45 dark:hover:shadow-black/25 sm:min-h-0 sm:py-3.5`}
                    >
                      <span className="flex items-start gap-2.5">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-[family-name:var(--font-bn)] text-base font-bold leading-none shadow-inner ${badgeBg}`}
                          aria-hidden
                        >
                          {toBengaliDigits(n)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-col gap-1">
                            <span
                              className="font-[family-name:var(--font-quran-ar)] text-[1.35rem] font-normal leading-[1.45] text-[var(--islamic-teal-deep)] [text-shadow:0_1px_0_rgba(15,76,68,0.06)] transition-[color,filter] group-hover:text-[var(--islamic-teal)] sm:text-[1.5rem] dark:text-teal-100 dark:[text-shadow:0_0_20px_rgba(45,212,191,0.08)] dark:group-hover:text-white"
                              dir="rtl"
                              lang="ar"
                            >
                              {sm.nameAr}
                            </span>
                            <span className="font-[family-name:var(--font-bn)] text-base font-semibold leading-snug text-[var(--islamic-teal-deep)] transition-colors group-hover:text-[var(--islamic-teal)] dark:text-teal-100/95 dark:group-hover:text-white sm:text-[1.05rem]">
                              {sm.nameBn}
                            </span>
                            <span className="truncate font-medium text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
                              {sm.nameEn}
                            </span>
                          </span>
                        </span>
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-[2.875rem] text-xs sm:text-sm">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 font-[family-name:var(--font-bn)] font-medium ${
                            isMadani
                              ? "bg-amber-100/90 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100"
                              : "bg-teal-100/80 text-teal-950 dark:bg-teal-950/55 dark:text-teal-100"
                          }`}
                        >
                          {revelationLabelBn(rev)}
                        </span>
                        <span className="text-[var(--islamic-teal)]/70 dark:text-teal-500/90">
                          {toBengaliDigits(sm.ayahCount)} আয়াত
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
