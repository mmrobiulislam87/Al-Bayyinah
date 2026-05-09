"use client";

import Link from "next/link";

import { LEARN_PHASES, LEARN_QUICK_START } from "@/lib/learnPath";
import { toBengaliDigits } from "@/lib/numberBn";

type Props = {
  streak: number;
};

const quickAccent: Record<
  (typeof LEARN_QUICK_START)[number]["accent"],
  string
> = {
  teal: "border-[var(--islamic-teal)]/35 bg-[var(--islamic-teal)]/08 dark:border-teal-600/40 dark:bg-teal-900/35",
  gold: "border-[var(--islamic-gold)]/45 bg-[var(--islamic-gold)]/12 dark:border-amber-600/45 dark:bg-amber-900/25",
  deep: "border-[var(--islamic-teal-deep)]/35 bg-[var(--islamic-parchment)]/90 dark:border-teal-500/35 dark:bg-teal-950/55",
};

export default function LearnPathMasterPlan({ streak }: Props) {
  return (
    <div className="mb-10 space-y-8">
      <section
        className="rounded-2xl border-2 border-[var(--islamic-gold)]/40 bg-gradient-to-br from-white/95 via-white/88 to-[var(--islamic-parchment)]/85 p-5 shadow-md dark:border-amber-700/40 dark:from-teal-950/95 dark:via-teal-950/88 dark:to-teal-950/70 sm:p-7"
        aria-labelledby="learn-masterplan-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--islamic-teal)]/70 dark:text-teal-400/90">
              শেখার মানচিত্র
            </p>
            <h2
              id="learn-masterplan-heading"
              className="mt-1 font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-50 sm:text-2xl"
            >
              বড় ছবিটা — চার ধাপ; এক দিনে সব নয়
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-200/85">
              এক জায়গায়{" "}
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">অভ্যাস</strong>,{" "}
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">হরফ</strong>,{" "}
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">আয়াত</strong> ও{" "}
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">আপনার খোঁজা শব্দ</strong>{" "}
              — সব একসাথে নয়, <strong className="font-semibold text-[var(--islamic-teal)] dark:text-teal-300">আজ যেখানে আছেন সেখান থেকে</strong>। টানা শেখার দিন:{" "}
              <span className="font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
                {toBengaliDigits(streak)}
              </span>
              ।
            </p>
          </div>
          <Link
            href="#daily-flow"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--islamic-teal-deep)] px-5 py-3 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow-md hover:brightness-110 dark:bg-teal-800"
          >
            আজকের চার ধাপে নামুন ↓
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {LEARN_QUICK_START.map((q) => (
            <Link
              key={q.key}
              href={q.href}
              className={`flex flex-col rounded-xl border p-4 transition hover:brightness-[1.02] dark:hover:brightness-110 ${quickAccent[q.accent]}`}
            >
              <span className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-50">
                {q.titleBn}
              </span>
              <span className="mt-2 text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
                {q.bodyBn}
              </span>
            </Link>
          ))}
        </div>

        <details className="mt-6 rounded-xl border border-[var(--islamic-teal)]/20 bg-white/60 px-4 py-2 dark:border-teal-800/45 dark:bg-teal-950/40">
          <summary className="cursor-pointer list-none font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal)] dark:text-teal-300 [&::-webkit-details-marker]:hidden">
            কেন এই পদ্ধতি সহজ মনে হবে?
            <span className="ml-2 text-xs font-normal text-[var(--islamic-ink-soft)] dark:text-teal-400/80">
              (খুলে পড়ুন — ১ মিনিট)
            </span>
          </summary>
          <ul className="mt-3 space-y-2 border-t border-[var(--islamic-teal)]/10 pt-3 font-[family-name:var(--font-bn)] text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:border-teal-800/35 dark:text-teal-300/85">
            <li>
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">ছোট সময়</strong> — প্রতিদিন
              “এক ঘণ্টা” নয়; কয়েক মিনিটও যথেষ্ট।
            </li>
            <li>
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">এক জায়গায় সব জ্ঞান</strong> —
              হরফ, অর্থ, তেলাওয়াত আলাদা খাতায় না রেখে একটি ধারায়।
            </li>
            <li>
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">হালকা পুরস্কার</strong> — স্ট্রিক ও
              হিকমাহ ছোট জয়ের অনুভূতি; পরীক্ষার মার্ক নয়।
            </li>
            <li>
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/90">নিজের গতি</strong> — যে শব্দ বা সূরা
              আপনার দরকার, সেখান থেকে শুরু করা যায়।
            </li>
          </ul>
        </details>
      </section>

      <section aria-labelledby="learn-phases-heading">
        <h3
          id="learn-phases-heading"
          className="mb-4 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100"
        >
          চার পর্যায় — দেখে রাখুন, আজ না হলে কাল
        </h3>
        <ol className="grid gap-4 sm:grid-cols-2">
          {LEARN_PHASES.map((phase, i) => (
            <li
              key={phase.key}
              className="flex h-full flex-col rounded-2xl border border-[var(--islamic-teal)]/16 bg-white/82 p-5 shadow-sm dark:border-teal-800/44 dark:bg-teal-950/48"
            >
              <div className="flex items-baseline gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--islamic-teal-deep)] font-[family-name:var(--font-bn)] text-sm font-bold text-white dark:bg-teal-800">
                  {toBengaliDigits(i + 1)}
                </span>
                <div>
                  <h4 className="font-[family-name:var(--font-bn)] text-base font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
                    {phase.titleBn.replace(/^[\u09E6-\u09EF]+\s*[·⋅]\s*/, "").trim() ||
                      phase.titleBn}
                  </h4>
                  <p className="text-[11px] font-medium text-[var(--islamic-gold)] dark:text-amber-300/90">
                    {phase.minutesBn}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
                {phase.taglineBn}
              </p>
              <p className="mt-2 rounded-lg bg-[var(--islamic-parchment)]/70 px-3 py-2 text-xs leading-relaxed text-[var(--islamic-teal-deep)] dark:bg-teal-900/40 dark:text-teal-200/90">
                শিক্ষার্থীর টিপ: {phase.whyBn}
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2 border-t border-[var(--islamic-teal)]/10 pt-3 dark:border-teal-800/35">
                {phase.modules.map((m) => (
                  <li key={m.href + m.labelBn}>
                    <Link
                      href={m.href}
                      className="group block rounded-lg border border-transparent px-1 py-1 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] underline-offset-4 hover:border-[var(--islamic-teal)]/15 hover:bg-white/80 hover:underline dark:text-amber-200/95 dark:hover:border-teal-700/40 dark:hover:bg-teal-900/40"
                    >
                      → {m.labelBn}
                      {m.hintBn ? (
                        <span className="mt-0.5 block text-xs font-normal text-[var(--islamic-ink-soft)] no-underline group-hover:no-underline dark:text-teal-400/85">
                          {m.hintBn}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
