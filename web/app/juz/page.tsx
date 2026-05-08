import type { Metadata } from "next";
import Link from "next/link";

import { JUZ_STARTS, formatAyahHash } from "@/lib/juz";
import { toBengaliDigits } from "@/lib/numberBn";
import { getSurahMeta } from "@/lib/surahs";

export const metadata: Metadata = {
  title: "ত্রিশ জুজ",
  description: "কুরআনের ৩০ জুজ — প্রচলিত মদিনা মুসহাফ অনুযায়ী শুরু সূরা ও আয়াত।",
};

export default function JuzPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <h1 className="mb-2 font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
        ত্রিশ জুজ
      </h1>
      <p className="mb-6 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
        প্রতিটি লিংক সংশ্লিষ্ট সূরায় প্রথম আয়াতে স্ক্রল করবে।
      </p>
      <ol className="flex flex-col gap-2">
        {JUZ_STARTS.map((j) => {
          const sm = getSurahMeta(j.startSurah);
          const hash = formatAyahHash(j.startAyah);
          return (
            <li key={j.juz}>
              <Link
                href={`/surah/${j.startSurah}#${hash}`}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[var(--islamic-teal)]/12 bg-white/90 px-4 py-3 text-sm shadow-sm transition-colors hover:border-[var(--islamic-gold)]/45 dark:border-teal-800/45 dark:bg-teal-950/55"
              >
                <span className="font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
                  জুজ {toBengaliDigits(j.juz)}
                </span>
                <span className="text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
                  {sm?.nameBn ?? `সূরা ${toBengaliDigits(j.startSurah)}`}{" "}
                  ·&nbsp;আয়াত&nbsp;{toBengaliDigits(j.startAyah)}
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
