"use client";

import Link from "next/link";

import {
  QURAN_RESEARCH_RESOURCES,
  type QuranResearchResource,
} from "@/lib/quranResearchResources";

export default function LabPanelTafsirHub() {
  const tafsir: QuranResearchResource[] = QURAN_RESEARCH_RESOURCES.filter(
    (r) => r.category === "tafsir_reference",
  );
  return (
    <section className="mb-6 rounded-lg border border-[var(--islamic-teal)]/20 bg-white/75 p-4 dark:border-teal-800/40 dark:bg-teal-950/40">
      <h3 className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
        তুলনামূলক তাফসীর — প্রবেশ
      </h3>
      <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/88">
        পূর্ণ তাফসীর গ্রন্থ লাইসেন্সসাপেক্ষে; অ্যাপে Iframe নয় — বাহ্যিক ট্যাবে
        উৎস খুলুন। পাশাপাশি পাঠের জন্য নীচের ডেডিকেটেড পৃষ্ঠা ব্যবহার করুন।
      </p>
      <Link
        href="/research/tafsir"
        className="mt-3 inline-flex rounded-lg bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-white dark:bg-teal-800"
      >
        তাফসীর হাব (আয়াত + বহিরাগত লিঙ্ক)
      </Link>
      <ul className="mt-4 space-y-2">
        {tafsir.map((r) => (
          <li key={r.id} className="font-[family-name:var(--font-bn)] text-xs">
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--islamic-teal-deep)] underline-offset-2 hover:underline dark:text-teal-300"
            >
              {r.titleBn}
            </a>
            <p className="text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
              {r.summaryBn}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
