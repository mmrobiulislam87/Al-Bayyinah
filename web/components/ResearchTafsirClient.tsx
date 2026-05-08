"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import BengaliAddTranslationDialog from "@/components/BengaliAddTranslationDialog";
import { AyahTransliterationBelowArabic } from "@/components/AyahTransliterationBelowArabic";
import { BengaliTranslationStack } from "@/components/BengaliTranslationStack";
import {
  BengaliTranslationProvider,
  useBengaliTranslationPrefs,
} from "@/contexts/BengaliTranslationContext";
import { toBengaliDigits } from "@/lib/numberBn";
import {
  QURAN_RESEARCH_RESOURCES,
  type QuranResearchResource,
} from "@/lib/quranResearchResources";
import { fetchAyahRecord } from "@/lib/surahData";
import type { AyahRecord } from "@/lib/types";

function parseRef(raw: string): { surah: number; ayah: number } | null {
  const m = /^(\d{1,3}):(\d{1,3})$/.exec(raw.trim());
  if (!m) return null;
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  if (surah < 1 || surah > 114 || ayah < 1) return null;
  return { surah, ayah };
}

export default function ResearchTafsirClient() {
  return (
    <BengaliTranslationProvider>
      <ResearchTafsirContent />
      <BengaliAddTranslationDialog />
    </BengaliTranslationProvider>
  );
}

function ResearchTafsirContent() {
  const [refInput, setRefInput] = useState("2:255");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ayah, setAyah] = useState<AyahRecord | null>(null);
  const bnPrefs = useBengaliTranslationPrefs();

  const tafsirResources = useMemo(
    () =>
      QURAN_RESEARCH_RESOURCES.filter(
        (r) => r.category === "tafsir_reference",
      ),
    [],
  );

  const others = useMemo(
    () =>
      QURAN_RESEARCH_RESOURCES.filter((r) => r.category !== "tafsir_reference"),
    [],
  );

  async function loadAyah() {
    const p = parseRef(refInput);
    if (!p) {
      setErr("সঠিক ফর্ম: সূরা:আয়াত (যেমন 2:255)");
      setAyah(null);
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const r = await fetchAyahRecord(p.surah, p.ayah);
      setAyah(r ?? null);
      if (!r) setErr("আয়াত খুঁজে পাওয়া যায়নি।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="mb-6 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          তাফসীর ও সহগ্রন্থ — তুলনামূলক প্রবেশ
        </h1>
        <p className="mt-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
          একই স্ক্রিনে আয়াত ও বহিরাগত তাফসীর পোর্টালের লিঙ্ক। গ্রন্থপাঠ সরাসরি
          অ্যাপে এম্বেড নয়; লাইসেন্স ও সূত্র মেনে নিজ এডিটরে তুলনা করুন।
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/research/lab?m=tafsir"
            className="rounded-lg border border-[var(--islamic-teal)]/30 bg-white/80 px-3 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal-deep)] dark:border-teal-700/50 dark:bg-teal-950/60 dark:text-teal-100"
          >
            ← গবেষণাগার
          </Link>
          <Link
            href="/research"
            className="rounded-lg border border-[var(--islamic-teal)]/25 px-3 py-2 font-[family-name:var(--font-bn)] text-sm dark:border-teal-800/45"
          >
            রিসার্চ ড্যাশবোর্ড
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/88 p-4 dark:border-teal-800/45 dark:bg-teal-950/45">
        <label className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
          সূরা:আয়াত
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            className="min-h-11 flex-1 rounded-lg border border-[var(--islamic-teal)]/25 bg-white px-3 py-2 font-mono dark:border-teal-700/50 dark:bg-teal-950/70 dark:text-teal-50"
          />
          <button
            type="button"
            onClick={() => void loadAyah()}
            disabled={busy}
            className="rounded-lg bg-[var(--islamic-teal-deep)] px-5 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-white disabled:opacity-60 dark:bg-teal-800"
          >
            {busy ? "লোড…" : "দেখান"}
          </button>
        </div>
        {err ? (
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">{err}</p>
        ) : null}

        {ayah ? (
          <div className="mt-6 space-y-4 border-t border-[var(--islamic-teal)]/12 pt-4 dark:border-teal-800/35">
            <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-200">
              {toBengaliDigits(ayah.surah)}:{toBengaliDigits(ayah.ayah)}
            </p>
            {ayah.arabicText ? (
              <p
                dir="rtl"
                className="text-2xl leading-relaxed text-[var(--islamic-ink)] dark:text-teal-50"
              >
                {ayah.arabicText}
              </p>
            ) : null}
            <AyahTransliterationBelowArabic r={ayah} />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--islamic-teal)]/75 dark:text-teal-400/85 sm:text-sm">
                  বাংলা
                </p>
                <button
                  type="button"
                  onClick={() => bnPrefs.openAddTranslationModal()}
                  className="touch-manipulation rounded-lg border border-[#4a9d9d]/50 bg-[#4a9d9d]/14 px-2.5 py-1 font-[family-name:var(--font-bn)] text-[0.7rem] font-semibold text-[var(--islamic-teal-deep)] underline decoration-[var(--islamic-gold)]/45 underline-offset-2 hover:bg-[#4a9d9d]/22 dark:border-teal-500/45 dark:bg-teal-900/45 dark:text-teal-100 sm:text-xs"
                >
                  ＋ অনুবাদ যোগ করুন
                </button>
              </div>
              {bnPrefs.hydrated ? (
                <BengaliTranslationStack
                  r={ayah}
                  visibleSourceIds={bnPrefs.visibleIds}
                  primaryId={bnPrefs.primaryId}
                  onHideSource={bnPrefs.removeVisible}
                />
              ) : (
                <p className="font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink)] dark:text-teal-100/90">
                  {ayah.bengaliTranslation}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--islamic-teal)]/75 dark:text-teal-400/85 sm:text-sm">
                English
              </p>
              <p className="mt-1 font-[family-name:var(--font-bn)] text-sm italic text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
                {ayah.englishTranslation}
              </p>
            </div>
            <Link
              href={`/surah/${ayah.surah}#ayah-${ayah.ayah}`}
              className="inline-block font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] underline dark:text-teal-300"
            >
              পূর্ণ সূরা ভিউতে খুলুন
            </Link>
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--islamic-teal)]/15 bg-white/85 p-4 dark:border-teal-800/40 dark:bg-teal-950/40">
          <h2 className="font-[family-name:var(--font-bn)] text-base font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
            তাফসীর রেফারেন্স
          </h2>
          <ResourceList items={tafsirResources} />
        </section>
        <section className="rounded-xl border border-[var(--islamic-teal)]/15 bg-white/85 p-4 dark:border-teal-800/40 dark:bg-teal-950/40">
          <h2 className="font-[family-name:var(--font-bn)] text-base font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
            অন্যান্য গবেষণা সম্পদ
          </h2>
          <ResourceList items={others} />
        </section>
      </div>
    </div>
  );
}

function ResourceList({ items }: { items: QuranResearchResource[] }) {
  return (
    <ul className="mt-3 space-y-3 font-[family-name:var(--font-bn)] text-sm">
      {items.map((r) => (
        <li key={r.id}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--islamic-teal-deep)] underline-offset-2 hover:underline dark:text-teal-300"
          >
            {r.titleBn}
          </a>
          <p className="text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
            {r.summaryBn}
          </p>
          <p className="text-[11px] text-[var(--islamic-ink-soft)] dark:text-teal-500/80">
            {r.licenseNoteBn}
          </p>
        </li>
      ))}
    </ul>
  );
}
