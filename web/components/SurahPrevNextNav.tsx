import Link from "next/link";

import { getSurahMeta } from "@/lib/surahs";
import { toBengaliDigits } from "@/lib/numberBn";

type Props = { current: number };

/**
 * সূরা পাঠের পূর্ববর্তী / পরবর্তী অধ্যায় লিংক।
 */
export default function SurahPrevNextNav({ current }: Props) {
  const prev = current > 1 ? current - 1 : null;
  const next = current < 114 ? current + 1 : null;
  const prevMeta = prev ? getSurahMeta(prev) : null;
  const nextMeta = next ? getSurahMeta(next) : null;

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="সূরা নেভিগেশন"
      className="mx-auto mt-10 flex w-full max-w-full flex-col gap-2 border-t border-[var(--islamic-gold)]/35 pt-6 sm:flex-row sm:justify-between"
    >
      {prev && prevMeta ? (
        <Link
          href={`/surah/${prev}`}
          className="group rounded-xl border border-[var(--islamic-teal)]/15 bg-white/85 px-4 py-3 shadow-sm transition hover:border-[var(--islamic-gold)]/45 hover:shadow-md"
        >
          <span className="text-xs font-medium text-[var(--islamic-teal)]/80">
            ← পূর্ববর্তী
          </span>
          <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] group-hover:text-[var(--islamic-teal)]">
            {toBengaliDigits(prev)}. {prevMeta.nameBn}
          </p>
          <p className="text-xs text-[var(--islamic-ink-soft)]">{prevMeta.nameEn}</p>
        </Link>
      ) : (
        <span />
      )}
      {next && nextMeta ? (
        <Link
          href={`/surah/${next}`}
          className="group rounded-xl border border-[var(--islamic-teal)]/15 bg-white/85 px-4 py-3 text-right shadow-sm transition hover:border-[var(--islamic-gold)]/45 hover:shadow-md sm:ml-auto"
        >
          <span className="text-xs font-medium text-[var(--islamic-teal)]/80">
            পরবর্তী →
          </span>
          <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] group-hover:text-[var(--islamic-teal)]">
            {toBengaliDigits(next)}. {nextMeta.nameBn}
          </p>
          <p className="text-xs text-[var(--islamic-ink-soft)]">{nextMeta.nameEn}</p>
        </Link>
      ) : null}
    </nav>
  );
}
