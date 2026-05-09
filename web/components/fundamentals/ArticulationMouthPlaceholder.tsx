"use client";

/** মুখের মানচিত্র — পরবর্তীতে SVG টাং/বাতাস অ্যানিমেশন যোগ করার জন্য স্থান। */

type Props = { letter: string; active: boolean };

export default function ArticulationMouthPlaceholder({ letter, active }: Props) {
  return (
    <div
      className={`relative mx-auto max-w-[220px] rounded-2xl border p-4 transition ${
        active
          ? "border-[var(--islamic-gold)]/60 bg-gradient-to-b from-white/95 to-amber-50/30 shadow-md dark:border-amber-500/45 dark:from-teal-950/90 dark:to-teal-900/50"
          : "border-[var(--islamic-teal)]/15 bg-white/70 dark:border-teal-800/40 dark:bg-teal-950/40"
      }`}
      aria-hidden={!active}
    >
      <svg viewBox="0 0 120 100" className="h-32 w-full text-[var(--islamic-teal-deep)] dark:text-teal-200">
        <ellipse
          cx="60"
          cy="44"
          rx="38"
          ry="28"
          fill="currentColor"
          fillOpacity={active ? 0.12 : 0.07}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M32 58 Q60 78 88 58"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 3 : 2}
          strokeLinecap="round"
          opacity={active ? 0.95 : 0.65}
        />
        <ellipse
          cx="60"
          cy="72"
          rx={active ? 18 : 12}
          ry={active ? 8 : 5}
          fill="currentColor"
          fillOpacity={active ? 0.35 : 0.2}
        />
      </svg>
      <p className="font-[family-name:var(--font-bn)] text-center text-[10px] text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
        হরফ <span dir="rtl" className="font-[family-name:var(--font-quran-ar)] text-lg">{letter}</span> · মখরজ
        ডায়াগ্রাম (প্রসারণ হবে)
      </p>
    </div>
  );
}
