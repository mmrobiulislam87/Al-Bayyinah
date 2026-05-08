"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import LabPanelChronology from "@/components/research-lab/panels/LabPanelChronology";
import LabPanelMeaningSearch from "@/components/research-lab/panels/LabPanelMeaningSearch";
import LabPanelMunasabah from "@/components/research-lab/panels/LabPanelMunasabah";
import LabPanelOntology from "@/components/research-lab/panels/LabPanelOntology";
import LabPanelTafsirHub from "@/components/research-lab/panels/LabPanelTafsirHub";
import LabPanelWorkspace from "@/components/research-lab/panels/LabPanelWorkspace";
import {
  type ResearchLabModule,
  type ResearchLabModuleId,
  RESEARCH_LAB_MODULES,
  parseLabModuleParam,
} from "@/lib/researchLab/modules";

function statusLabel(status: ResearchLabModule["status"]): string {
  if (status === "shipped") return "চালু";
  if (status === "in_progress") return "নির্মাণাধীন";
  return "পরিকল্পিত";
}

function statusClass(status: ResearchLabModule["status"]): string {
  if (status === "shipped")
    return "bg-emerald-700/90 text-white dark:bg-emerald-600/90";
  if (status === "in_progress")
    return "bg-amber-600/95 text-white dark:bg-amber-700/90";
  return "bg-slate-600/85 text-white dark:bg-slate-500/90";
}

function ResearchLabClientInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlModule = useMemo(
    () => parseLabModuleParam(searchParams.get("m")),
    [searchParams],
  );

  const [active, setActive] = useState<ResearchLabModuleId>(urlModule);

  useEffect(() => {
    setActive(urlModule);
  }, [urlModule]);

  const selectModule = useCallback(
    (id: ResearchLabModuleId) => {
      setActive(id);
      const u = new URLSearchParams(searchParams.toString());
      u.set("m", id);
      router.replace(`${pathname}?${u.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const current = RESEARCH_LAB_MODULES.find((m) => m.id === active)!;

  const richPanel =
    active === "ontology" ? (
      <LabPanelOntology />
    ) : active === "semantic" ? (
      <LabPanelMeaningSearch />
    ) : active === "munasabah" ? (
      <LabPanelMunasabah />
    ) : active === "chronology" ? (
      <LabPanelChronology />
    ) : active === "workspace" ? (
      <LabPanelWorkspace verseKeyFromUrl={searchParams.get("v")} />
    ) : active === "tafsir" ? (
      <LabPanelTafsirHub />
    ) : null;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="mb-8 border-b border-[var(--islamic-gold)]/35 pb-6 dark:border-amber-800/35">
        <p className="font-[family-name:var(--font-bn)] text-xs font-semibold uppercase tracking-wider text-[var(--islamic-teal)] dark:text-teal-300">
          Al-Bayyinah Research Station
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-bn)] text-2xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100 sm:text-3xl">
          কোরআন গবেষণাগার
        </h1>
        <p className="mt-3 max-w-3xl font-[family-name:var(--font-bn)] text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
          ভাষাবিজ্ঞান, অন্টোলজি, সিমান্টিক সার্চ, মুনাসাবাহ, কালানুক্রমিক প্রেক্ষাপট,
          কিরাআত, তুলনামূলক তাফসীর ও গবেষকের ওয়ার্কস্পেস — একজ্ঞা লক্ষ্যে সংহত।
          মডিউলগুলো ধাপে ধাপে কার্যকর করা হয়; বিস্তারিত মাস্টার প্ল্যান রিপোর{" "}
          <span className="whitespace-nowrap rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
            docs/RESEARCH_LAB.md
          </span>{" "}
          ফাইলে।
        </p>
        <div className="mt-4 flex flex-wrap gap-2 font-[family-name:var(--font-bn)] text-sm">
          <Link
            href="/research"
            className="rounded-lg border border-[var(--islamic-teal)]/30 bg-white/80 px-3 py-2 font-medium text-[var(--islamic-teal-deep)] shadow-sm transition hover:bg-[var(--islamic-teal)]/8 dark:border-teal-700/50 dark:bg-teal-950/60 dark:text-teal-100 dark:hover:bg-teal-900/40"
          >
            রিসার্চ ড্যাশবোর্ড (চার্ট + কনকর্ডেন্স)
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-[var(--islamic-teal)]/25 bg-white/70 px-3 py-2 text-[var(--islamic-teal-deep)] transition hover:bg-[var(--islamic-teal)]/8 dark:border-teal-800/45 dark:bg-teal-950/50 dark:text-teal-100"
          >
            হোম · অনুসন্ধান
          </Link>
        </div>
      </header>

      <div className="mb-6 lg:flex lg:gap-6">
        <nav
          className="mb-4 lg:mb-0 lg:w-64 lg:shrink-0"
          aria-label="গবেষণা মডিউল"
        >
          <p className="mb-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
            মডিউল
          </p>
          <ul className="flex max-h-[min(70vh,520px)] flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible lg:pr-1">
            {RESEARCH_LAB_MODULES.map((m) => (
              <li key={m.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => selectModule(m.id)}
                  className={
                    m.id === active
                      ? "w-full rounded-lg border-2 border-[var(--islamic-teal-deep)] bg-[var(--islamic-teal)]/12 px-3 py-2.5 text-left font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:border-teal-400/70 dark:bg-teal-900/35 dark:text-teal-50"
                      : "w-full rounded-lg border border-transparent px-3 py-2.5 text-left font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink)] transition hover:border-[var(--islamic-teal)]/20 hover:bg-white/60 dark:text-teal-200/90 dark:hover:border-teal-700/40 dark:hover:bg-teal-950/50"
                  }
                >
                  <span className="block leading-snug">{m.titleBn}</span>
                  <span
                    className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusClass(m.status)}`}
                  >
                    {statusLabel(m.status)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <article className="min-w-0 flex-1 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/88 p-5 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/45">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
              {current.titleBn}
            </h2>
            <span
              className={`shrink-0 rounded-md px-2.5 py-1 font-[family-name:var(--font-bn)] text-xs font-semibold ${statusClass(current.status)}`}
            >
              {statusLabel(current.status)}
            </span>
          </div>
          <p className="mb-6 font-[family-name:var(--font-bn)] text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
            {current.taglineBn}
          </p>

          {richPanel ? <div className="mb-6">{richPanel}</div> : null}

          <details
            className="rounded-lg border border-[var(--islamic-teal)]/12 bg-white/50 dark:border-teal-800/35 dark:bg-teal-950/30"
            open={richPanel == null}
          >
            <summary className="cursor-pointer px-3 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
              {richPanel
                ? "পরিকল্পিত লক্ষ্য ও কারিগরি (বিস্তারিত)"
                : "লক্ষ্য ও কারিগরি"}
            </summary>
            <div className="border-t border-[var(--islamic-teal)]/10 px-3 pb-3 pt-3 dark:border-teal-800/30">
              <div className="grid gap-6 sm:grid-cols-2">
                <section>
                  <h3 className="mb-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
                    লক্ষ্য
                  </h3>
                  <ul className="list-inside list-disc space-y-1.5 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink)] dark:text-teal-100/90">
                    {current.goalsBn.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="mb-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
                    কারিগরি ও ডাটা
                  </h3>
                  <ul className="list-inside list-disc space-y-1.5 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink)] dark:text-teal-100/90">
                    {current.technicalBn.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </details>

          {current.relatedHref ? (
            <div className="mt-6 rounded-lg border border-[var(--islamic-gold)]/25 bg-[var(--islamic-teal)]/5 p-4 dark:border-amber-800/30 dark:bg-teal-900/25">
              <p className="font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-200">
                সম্পর্কিত (বর্তমান সাইট)
              </p>
              <Link
                href={current.relatedHref}
                className="mt-1 inline-block font-[family-name:var(--font-bn)] text-sm font-medium text-[var(--islamic-teal-deep)] underline underline-offset-2 hover:text-[var(--islamic-teal)] dark:text-teal-200"
              >
                {current.relatedLabelBn ?? current.relatedHref}
              </Link>
            </div>
          ) : null}

          <footer className="mt-8 border-t border-[var(--islamic-teal)]/10 pt-4 font-[family-name:var(--font-bn)] text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
            পূর্ণ মানের ফিচার নির্ভর করে প্রমাণযোগ্য প্রাথমিক পাঠ, লাইসেন্সকৃত
            কorpus ও স্বচ্ছ উৎসে। অগ্রগতি `docs/RESEARCH_LAB.md` ও রিপোর{" "}
            <span className="font-medium text-[var(--islamic-ink)] dark:text-teal-200">
              ROADMAP.md
            </span>{" "}
            এর সাথে সামঞ্জস্য রেখে ইটারেশন করা হবে। প্রজেক্ট সীমা অনুযায়ী হাদিস
            কorpus বা হাদিসভিত্তিক ফিচার অন্তর্ভুক্ত নয়।
          </footer>
        </article>
      </div>
    </div>
  );
}

export default function ResearchLabClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl flex-1 items-center justify-center px-4 py-24 font-[family-name:var(--font-bn)] text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
          গবেষণাগার লোড হচ্ছে…
        </div>
      }
    >
      <ResearchLabClientInner />
    </Suspense>
  );
}
