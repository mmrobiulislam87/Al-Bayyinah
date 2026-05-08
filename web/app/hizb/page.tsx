import type { Metadata } from "next";
import Link from "next/link";

import { HIZB_STARTS } from "@/lib/hizb";
import { formatAyahHash } from "@/lib/juz";
import { toBengaliDigits } from "@/lib/numberBn";
import { getSurahMeta } from "@/lib/surahs";

export const metadata: Metadata = {
  title: "ষাট হিযব",
  description:
    "কুরআনের ৬০ হিযব (অর্ধ জুজ) — quran.com verse_mapping অনুযায়ী প্রথম আয়াত।",
};

export default function HizbPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <h1 className="mb-2 font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
        ষাট হিযব
      </h1>
      <p className="mb-6 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
        প্রতিটি লিংক সংশ্লিষ্ট সূরায় হিযবের প্রথম আয়াতে স্ক্রল করবে।
      </p>
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {HIZB_STARTS.map((h) => {
          const sm = getSurahMeta(h.startSurah);
          const hash = formatAyahHash(h.startAyah);
          return (
            <li key={h.hizb}>
              <Link
                href={`/surah/${h.startSurah}#${hash}`}
                className="flex h-full flex-col gap-0.5 rounded-xl border border-[var(--islamic-teal)]/12 bg-white/90 px-3 py-2.5 text-sm shadow-sm transition-colors hover:border-[var(--islamic-gold)]/45 dark:border-teal-800/45 dark:bg-teal-950/55"
              >
                <span className="font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
                  হিযব {toBengaliDigits(h.hizb)}
                </span>
                <span className="text-xs text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
                  {sm?.nameBn ?? `সূরা ${toBengaliDigits(h.startSurah)}`} · আয়াত{" "}
                  {toBengaliDigits(h.startAyah)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-8">
        <Link
          href="/"
          className="text-sm font-[family-name:var(--font-bn)] text-[var(--islamic-teal)] underline dark:text-teal-300"
        >
          ← হোম
        </Link>
      </p>
    </div>
  );
}
