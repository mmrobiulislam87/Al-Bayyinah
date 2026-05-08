"use client";

import Link from "next/link";

import { toBengaliDigits } from "@/lib/numberBn";
import { getSurahMeta } from "@/lib/surahs";
import {
  getSurahRevelation,
  revelationLabelBn,
} from "@/lib/surahRevelation";

export default function LabPanelChronology() {
  const rows = Array.from({ length: 114 }, (_, i) => i + 1).map((n) => {
    const meta = getSurahMeta(n);
    const place = getSurahRevelation(n);
    return {
      n,
      nameBn: meta?.nameBn ?? `সূরা ${n}`,
      place,
      label: revelationLabelBn(place),
    };
  });

  return (
    <section className="mb-6 rounded-lg border border-[var(--islamic-teal)]/20 bg-white/75 p-4 dark:border-teal-800/40 dark:bg-teal-950/40">
      <h3 className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
        সূরাভিত্তিক মক্কী / মাদানী (শিক্ষাগত শ্রেণি)
      </h3>
      <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/88">
        নির্দিষ্ট সূরা নিয়ে মতভেদ থাকতে পারে। নুযুল বর্ণনা হাদিস পাঠ হিসেবে অ্যাপে
        আসবে না — প্রজেক্ট নীতি মেনে।
      </p>
      <div className="mt-3 max-h-80 overflow-y-auto rounded-md border border-[var(--islamic-teal)]/12 dark:border-teal-800/35">
        <table className="w-full border-collapse text-left font-[family-name:var(--font-bn)] text-xs">
          <thead className="sticky top-0 bg-[var(--islamic-teal)]/12 dark:bg-teal-900/60">
            <tr>
              <th className="px-2 py-2">নং</th>
              <th className="px-2 py-2">নাম</th>
              <th className="px-2 py-2">প্রকাশস্থল</th>
              <th className="px-2 py-2">পাঠ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.n}
                className="border-t border-[var(--islamic-teal)]/10 dark:border-teal-800/30"
              >
                <td className="px-2 py-1.5 whitespace-nowrap">
                  {toBengaliDigits(r.n)}
                </td>
                <td className="px-2 py-1.5">{r.nameBn}</td>
                <td className="px-2 py-1.5">{r.label}</td>
                <td className="px-2 py-1.5">
                  <Link
                    href={`/surah/${r.n}`}
                    className="text-[var(--islamic-teal-deep)] underline-offset-2 hover:underline dark:text-teal-300"
                  >
                    খুলুন
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
