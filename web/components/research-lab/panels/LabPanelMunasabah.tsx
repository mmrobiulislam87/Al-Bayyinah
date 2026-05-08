"use client";

import Link from "next/link";

import { MUNASABAH_SAMPLE_LINKS } from "@/lib/researchLab/munasabahSeed";
import { toBengaliDigits } from "@/lib/numberBn";

export default function LabPanelMunasabah() {
  return (
    <section className="mb-6 rounded-lg border border-[var(--islamic-teal)]/20 bg-white/75 p-4 dark:border-teal-800/40 dark:bg-teal-950/40">
      <h3 className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
        নমুনা আয়াত-সংযোগ (কুরেটেড)
      </h3>
      <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/88">
        স্বয়ংক্রিয় তাফসীর নয় — গবেষকরা সূত্র যোগ করে বৃদ্ধি করবেন। হাদিস বর্ণনা
        এখানে নেই।
      </p>
      <ul className="mt-3 space-y-3">
        {MUNASABAH_SAMPLE_LINKS.map((x) => (
          <li
            key={x.id}
            className="rounded-md border border-[var(--islamic-teal)]/12 bg-white/90 p-3 dark:border-teal-800/35 dark:bg-teal-950/55"
          >
            <p className="font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-200">
              {x.labelBn}
            </p>
            <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink)] dark:text-teal-100/90">
              {x.noteBn}
            </p>
            <p className="mt-2 flex flex-wrap gap-2 font-[family-name:var(--font-bn)] text-xs">
              <Link
                href={`/surah/${x.fromSurah}#ayah-${x.fromAyah}`}
                className="text-[var(--islamic-teal-deep)] underline-offset-2 hover:underline dark:text-teal-300"
              >
                {toBengaliDigits(x.fromSurah)}:{toBengaliDigits(x.fromAyah)}
              </Link>
              <span className="text-[var(--islamic-ink-soft)]">→</span>
              <Link
                href={`/surah/${x.toSurah}#ayah-${x.toAyah}`}
                className="text-[var(--islamic-teal-deep)] underline-offset-2 hover:underline dark:text-teal-300"
              >
                {toBengaliDigits(x.toSurah)}:{toBengaliDigits(x.toAyah)}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
