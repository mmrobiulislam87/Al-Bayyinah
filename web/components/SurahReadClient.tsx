"use client";

/**
 * এক সূরার সব আয়াত — ইসলামি থিম, নেভিগেশন ও স্ক্রল সহায়ক।
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { AyahBlock } from "@/components/AyahBlock";
import BengaliAddTranslationDialog from "@/components/BengaliAddTranslationDialog";
import LoadingAyahList from "@/components/LoadingAyahList";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SurahAudioPlayer, {
  type SurahAudioPlayerHandle,
} from "@/components/SurahAudioPlayer";
import SurahPrevNextNav from "@/components/SurahPrevNextNav";
import { BengaliTranslationProvider } from "@/contexts/BengaliTranslationContext";
import type { AyahRecord } from "@/lib/types";
import { fetchSurahAyahs } from "@/lib/surahData";
import { toBengaliDigits } from "@/lib/numberBn";
import {
  getSurahRevelation,
  revelationLabelBn,
} from "@/lib/surahRevelation";
import { formatAyahHash } from "@/lib/juz";
import { getSurahMeta } from "@/lib/surahs";

/** মুসহাফের বাসমালা (সূরা ১ ও ৯ ব্যতীত শীর্ষে প্রদর্শন)। */
const BASMALA_AR = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
const BASMALA_BN =
  "পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে।";
const BASMALA_EN =
  "In the Name of Allah—the Most Compassionate, Most Merciful";

function showBasmalaAboveAyahs(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

type Props = {
  surahNumber: number;
};

function scrollToHash() {
  const raw = typeof window !== "undefined" ? window.location.hash : "";
  if (!raw?.startsWith("#")) return;
  const id = raw.slice(1);
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export default function SurahReadClient({ surahNumber }: Props) {
  const meta = getSurahMeta(surahNumber);
  const audioRef = useRef<SurahAudioPlayerHandle>(null);
  const [verses, setVerses] = useState<AyahRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [ayahDockAudioPlaying, setAyahDockAudioPlaying] = useState(false);

  const requestPlayFromAyah = useCallback((localAyah: number) => {
    audioRef.current?.playAyahFromUserGesture(localAyah);
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const small =
        window.matchMedia("(max-width: 639px)").matches;
      if (!small) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document
        .querySelector<HTMLElement>("[data-surah-audio-dock]")
        ?.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: "nearest",
        });
    });
  }, []);

  const requestPauseDockAudio = useCallback(() => {
    audioRef.current?.pauseDockAudio();
  }, []);

  useEffect(() => {
    setPlayingAyah(null);
    setAyahDockAudioPlaying(false);
  }, [surahNumber]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setVerses([]);
    (async () => {
      try {
        const rows = await fetchSurahAyahs(surahNumber);
        if (!cancelled) {
          setVerses(rows);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "লোড ব্যর্থ");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  useEffect(() => {
    if (loading || verses.length === 0) return;
    scrollToHash();
    const onHash = () => scrollToHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [loading, verses, surahNumber]);

  /** তেলাওয়াতের সাথে সিঙ্ক: বর্তমান আয়াত কার্ড স্ক্রিনে মাঝামাঝি/দৃশ্যমানে আনা। */
  useEffect(() => {
    if (playingAyah === null) return;
    const id = formatAyahHash(playingAyah);
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "center",
        inline: "nearest",
      });
    });
  }, [playingAyah]);

  const expected = meta?.ayahCount ?? 0;
  const loaded = verses.length;
  const incomplete = !loading && expected > 0 && loaded < expected;
  const showVerses = !loading && verses.length > 0;

  const rev = meta ? getSurahRevelation(surahNumber) : "makki";
  const showBasmala = meta ? showBasmalaAboveAyahs(surahNumber) : false;

  return (
    <div className="flex flex-1 flex-col text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="sticky top-0 z-10 border-b border-[var(--islamic-teal)]/12 bg-[var(--islamic-parchment)]/95 py-3 backdrop-blur-md dark:border-teal-800/40 dark:bg-teal-950/92 sm:py-3.5">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-10">
          <Link
            href="/"
            className="min-h-11 w-fit touch-manipulation py-1 font-[family-name:var(--font-bn)] text-base font-medium text-[var(--islamic-teal)] underline decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-[var(--islamic-teal-deep)] dark:text-teal-300 dark:hover:text-teal-100 sm:min-h-0"
          >
            ← হোম ও অনুসন্ধান
          </Link>
        </div>
      </header>

      <section className="border-b border-[var(--islamic-teal)]/10 bg-[var(--islamic-parchment)]/80 dark:border-teal-800/35 dark:bg-teal-950/55">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8 xl:px-10">
          {meta ? (
            <>
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
                <div className="min-w-0 flex-1 md:max-w-[58%]">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-[family-name:var(--font-quran-ar)] text-[clamp(2.1rem,6.5vw,3.85rem)] font-normal leading-[1.18] tracking-tight text-[var(--islamic-teal-deep)] [text-shadow:0_1px_0_rgba(212,168,75,0.18)] dark:text-teal-50 dark:[text-shadow:0_0_24px_rgba(45,212,191,0.12)]"
                  >
                    {meta.nameAr}
                  </p>
                </div>
                <div className="shrink-0 space-y-2 md:max-w-md md:text-end">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 md:justify-end">
                    <h1 className="font-[family-name:var(--font-bn)] text-2xl font-bold leading-tight tracking-tight text-[var(--islamic-ink)] dark:text-teal-50 sm:text-3xl md:text-[1.85rem]">
                      <span className="text-[var(--islamic-teal-deep)] dark:text-teal-200">
                        {toBengaliDigits(surahNumber)}.
                      </span>{" "}
                      {meta.nameBn}
                    </h1>
                    <details className="group relative inline-block text-start">
                      <summary className="cursor-pointer list-none rounded-full bg-[#4a9d9d] px-3.5 py-1.5 text-center text-xs font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-[#3d8787] dark:bg-teal-500 dark:hover:bg-teal-400 [&::-webkit-details-marker]:hidden">
                        তথ্য
                      </summary>
                      <div className="absolute start-0 z-20 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-xl border border-[var(--islamic-teal)]/18 bg-white/98 p-4 text-start text-sm shadow-lg ring-1 ring-black/5 dark:border-teal-700/50 dark:bg-teal-950/98 dark:ring-amber-900/25 md:start-auto md:end-0">
                        <p className="font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
                          {meta.nameBn}
                        </p>
                        <p className="mt-0.5 text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
                          {meta.nameEn}
                        </p>
                        <p
                          dir="rtl"
                          lang="ar"
                          className="mt-3 border-t border-[var(--islamic-teal)]/10 pt-3 font-[family-name:var(--font-quran-ar)] text-lg text-[var(--islamic-teal-deep)] dark:border-teal-700/40 dark:text-teal-100"
                        >
                          {meta.nameAr}
                        </p>
                        <dl className="mt-3 space-y-1.5 border-t border-[var(--islamic-teal)]/10 pt-3 font-[family-name:var(--font-bn)] text-[var(--islamic-ink)] dark:border-teal-700/40 dark:text-teal-100/95">
                          <div className="flex justify-between gap-3">
                            <dt className="text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
                              প্রকাশস্থল
                            </dt>
                            <dd>{revelationLabelBn(rev)}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
                              মোট আয়াত
                            </dt>
                            <dd>{toBengaliDigits(meta.ayahCount)}</dd>
                          </div>
                        </dl>
                      </div>
                    </details>
                  </div>
                  <p className="font-[family-name:var(--font-bn)] text-base font-normal text-[var(--islamic-ink-soft)] dark:text-teal-300/85 sm:text-lg">
                    {meta.nameEn}
                  </p>
                </div>
              </div>

              {showBasmala ? (
                <div className="mt-10 border-t border-[var(--islamic-teal)]/10 pt-10 dark:border-teal-700/35">
                  <div className="mx-auto max-w-3xl text-center">
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-[family-name:var(--font-quran-ar)] text-[clamp(1.45rem,4.2vw,2.05rem)] font-normal leading-[1.55] text-[var(--islamic-teal-deep)] dark:text-teal-50"
                    >
                      {BASMALA_AR}
                    </p>
                    <p className="mt-3 font-[family-name:var(--font-bn)] text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/88 sm:text-base">
                      {BASMALA_BN}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--islamic-ink-soft)]/85 dark:text-teal-400/75 sm:text-sm">
                      {BASMALA_EN}
                    </p>
                  </div>
                </div>
              ) : null}

              {surahNumber === 9 ? (
                <p className="mt-6 text-center font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
                  সূরা অত-তাওবাহ-এর শুরুতে বাসমালা নেই।
                </p>
              ) : null}
            </>
          ) : null}

          {loading && (
            <p className="mt-4 font-[family-name:var(--font-bn)] text-base text-[var(--islamic-teal)]/80 dark:text-teal-300/90 sm:text-lg">
              আয়াত লোড হচ্ছে…
            </p>
          )}
          {error && (
            <p className="mt-4 text-base text-red-700 dark:text-red-400 sm:text-lg">{error}</p>
          )}
          {incomplete && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-3 font-[family-name:var(--font-bn)] text-base text-amber-900 ring-1 ring-amber-200/80 dark:bg-amber-950/50 dark:text-amber-100 dark:ring-amber-800/50 sm:text-lg">
              সতর্কতা: এই সূরায় {toBengaliDigits(expected)} টি আয়াতের মধ্যে{" "}
              {toBengaliDigits(loaded)} টি ডেটাবেজে আছে।
            </p>
          )}
        </div>
      </section>

      <main
        className={`w-full max-w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 ${
          meta
            ? "pb-[max(11.5rem,calc(env(safe-area-inset-bottom)+10rem))] sm:pb-[max(12rem,calc(env(safe-area-inset-bottom)+10.5rem))]"
            : "pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        }`}
      >
        <div className="mx-auto w-full max-w-6xl">
          <BengaliTranslationProvider>
            <BengaliAddTranslationDialog />
            {loading ? (
              <LoadingAyahList />
            ) : (
              <>
                {!error && verses.length === 0 ? (
                  <p className="text-[var(--islamic-ink-soft)] dark:text-teal-300/80">
                    এই সূরার আয়াত পাওয়া যায়নি।
                  </p>
                ) : null}
                {verses.length > 0 ? (
                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    {verses.map((r) => (
                      <AyahBlock
                        key={r.id}
                        r={r}
                        showSurahHeading={false}
                        ayahAudioActive={playingAyah === r.ayah}
                        ayahAudioIsPlaying={
                          playingAyah === r.ayah && ayahDockAudioPlaying
                        }
                        onAyahPlayAudio={requestPlayFromAyah}
                        onAyahPauseAudio={requestPauseDockAudio}
                      />
                    ))}
                  </div>
                ) : null}
                {showVerses ? (
                  <SurahPrevNextNav current={surahNumber} />
                ) : null}
              </>
            )}
          </BengaliTranslationProvider>
        </div>
      </main>
      {meta ? (
        <SurahAudioPlayer
          ref={audioRef}
          surahNumber={surahNumber}
          surahNameBn={meta.nameBn}
          fixedDock
          ayahCount={meta.ayahCount}
          onPlayingAyahChange={setPlayingAyah}
          onAyahDockPlaybackChange={setAyahDockAudioPlaying}
        />
      ) : null}
      <ScrollToTopButton liftForAudioDock={!!meta} />
    </div>
  );
}
