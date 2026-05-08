"use client";

import { useMemo } from "react";

import {
  QURAN_RESEARCH_CATEGORY_LABELS,
  QURAN_RESEARCH_RESOURCES,
  groupResourcesByCategory,
  type QuranResearchCategory,
} from "@/lib/quranResearchResources";

const CATEGORY_ORDER: QuranResearchCategory[] = [
  "primary_text",
  "morphology",
  "lexicon",
  "search_api",
  "tafsir_reference",
  "methodology",
];

export default function ResearchResourcesPanel() {
  const grouped = useMemo(
    () => groupResourcesByCategory(QURAN_RESEARCH_RESOURCES),
    [],
  );

  return (
    <section
      className="mb-10 rounded-xl border border-[var(--islamic-teal)]/15 bg-gradient-to-b from-white/88 to-white/72 p-4 shadow-sm dark:border-teal-800/40 dark:from-teal-950/55 dark:to-teal-950/40"
      aria-labelledby="research-resources-heading"
    >
      <h2
        id="research-resources-heading"
        className="mb-1 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100"
      >
        গবেষণার জন্য উপাদান ও বাহ্যিক সম্পদ
      </h2>
      <p className="mb-4 font-[family-name:var(--font-bn)] text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
        কোরআনিক টেক্সচুয়াল স্টাডিজ, ভাষাতত্ত্ব ও তাফসীর রেফারেন্সের জন্য কুরেটেড তালিকা।
        পণ্যায়নের আগে প্রতিটি সাইটের লাইসেন্স ও অ্যাট্রিবিউশন যাচাই করুন।
      </p>

      <div className="flex flex-col gap-6">
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped.get(cat);
          if (!items?.length) return null;
          return (
            <div key={cat}>
              <h3 className="mb-2 border-s-4 border-[var(--islamic-gold)]/70 ps-3 font-[family-name:var(--font-bn)] text-sm font-bold text-[var(--islamic-teal)] dark:border-amber-500/50 dark:text-teal-200">
                {QURAN_RESEARCH_CATEGORY_LABELS[cat]}
              </h3>
              <ul className="flex flex-col gap-3">
                {items.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-lg border border-[var(--islamic-teal)]/12 bg-white/80 px-3 py-2.5 dark:border-teal-800/35 dark:bg-teal-900/35"
                  >
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] underline decoration-[var(--islamic-gold)]/40 underline-offset-2 hover:decoration-[var(--islamic-gold)] dark:text-teal-100"
                    >
                      {r.titleBn}
                    </a>
                    <p className="mt-1 font-[family-name:var(--font-bn)] text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
                      {r.summaryBn}
                    </p>
                    <p className="mt-1.5 font-[family-name:var(--font-bn)] text-[0.65rem] leading-snug text-[var(--islamic-teal)]/75 dark:text-teal-500/90">
                      <span className="font-semibold">লাইসেন্স/শর্ত:</span>{" "}
                      {r.licenseNoteBn}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
