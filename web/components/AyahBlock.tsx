"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import type { AyahRecord } from "@/lib/types";

import { isBookmarked as checkBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { getSurahMeta } from "@/lib/surahs";
import { toBengaliDigits } from "@/lib/numberBn";
import { formatAyahHash } from "@/lib/juz";
import { AyahTransliterationBelowArabic } from "@/components/AyahTransliterationBelowArabic";
import { BengaliTranslationStack } from "@/components/BengaliTranslationStack";
import { ClickableAyahText } from "@/components/ClickableAyahText";
import { useOptionalBengaliTranslationPrefs } from "@/contexts/BengaliTranslationContext";
import { getFieldHighlightRanges } from "@/lib/searchHighlight";

type Props = {
  r: AyahRecord;
  /** সার্চ ফলাফলের জন্য সূরা/আয়াত হেডিং দেখানো। */
  showSurahHeading?: boolean;
  /** তেলাওয়াত চলাকালীন এই আয়াত হাইলাইট। */
  ayahAudioActive?: boolean;
  /**
   * true যখন এই আয়াতই নির্বাচিত এবং নিচের ডক অডিও চলছে (ইতিমধ্যে পজ নয়).
   * `onAyahPauseAudio` থাকলে বিরতি বাটন সক্রিয়তার জন্য।
   */
  ayahAudioIsPlaying?: boolean;
  /** থাকলে «প্লে» — স্থানীয় আয়াতে তেলাওয়াত (বা একই আয়াতে পজ হলে রিজিউম)। */
  onAyahPlayAudio?: (localAyah: number) => void;
  /** থাকলে «বিরতি» — ডক অডিও থামানো। */
  onAyahPauseAudio?: () => void;
  /** থাকলে আরবি/বাংলা/ইংরেজি পাঠে মিল হাইলাইট। */
  highlightQuery?: string;
  /** true হলে একটি ভাষায় মিল থাকলে অন্যান্য ভাষায় আনুপাতিক শব্দও হাইলাইট। */
  searchHighlightCrossLanguage?: boolean;
};

function buildCopyText(r: AyahRecord): string {
  const parts = [
    r.arabicText,
    r.latinTransliteration,
    r.bengaliTransliterationScript,
    r.bengaliTranslation,
    r.englishTranslation,
  ].filter(Boolean);
  return parts.join("\n\n");
}

/**
 * এক আয়াত পাঠের ব্লক: আরবি + বাংলা + ইংরেজি (ইসলামি কার্ড স্টাইল)।
 */
export function AyahBlock({
  r,
  showSurahHeading,
  ayahAudioActive = false,
  ayahAudioIsPlaying = false,
  onAyahPlayAudio,
  onAyahPauseAudio,
  highlightQuery,
  searchHighlightCrossLanguage,
}: Props) {
  const sm = getSurahMeta(r.surah);
  const bnPrefs = useOptionalBengaliTranslationPrefs();
  const [booked, setBooked] = useState(() =>
    typeof window !== "undefined" ? checkBookmarked(r.id) : false,
  );
  const [copyOk, setCopyOk] = useState(false);

  const highlightRanges = useMemo(() => {
    const q = highlightQuery?.trim();
    if (!q) return null;
    return getFieldHighlightRanges(r, q, {
      crossLanguage: searchHighlightCrossLanguage ?? false,
    });
  }, [r, highlightQuery, searchHighlightCrossLanguage]);

  const anchorId = formatAyahHash(r.ayah);

  const onBookmark = useCallback(() => {
    const on = toggleBookmark({
      id: r.id,
      surah: r.surah,
      ayah: r.ayah,
    });
    setBooked(on);
  }, [r.ayah, r.id, r.surah]);

  const onCopy = useCallback(async () => {
    const t = buildCopyText(r);
    try {
      await navigator.clipboard.writeText(t);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 2000);
    } catch {
      setCopyOk(false);
    }
  }, [r]);

  const sharePayload = useMemo(() => {
    const title =
      (sm?.nameBn ? `সূরা ${sm.nameBn} · ` : "") +
      `আয়াত ${toBengaliDigits(r.ayah)}`;
    return { title, text: buildCopyText(r) };
  }, [r, sm?.nameBn]);

  const onShare = useCallback(async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/surah/${r.surah}#${anchorId}`
        : `/surah/${r.surah}#${anchorId}`;
    if (navigator.share) {
      try {
        await navigator.share({ ...sharePayload, url });
      } catch {
        /* ব্যবহারকারী বাতিল */
      }
    } else {
      await onCopy();
    }
  }, [anchorId, onCopy, r.surah, sharePayload]);

  const onAudioToolbarToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!onAyahPlayAudio) return;
      if (
        ayahAudioActive &&
        ayahAudioIsPlaying &&
        onAyahPauseAudio
      ) {
        onAyahPauseAudio();
        return;
      }
      onAyahPlayAudio(r.ayah);
    },
    [
      onAyahPlayAudio,
      onAyahPauseAudio,
      r.ayah,
      ayahAudioActive,
      ayahAudioIsPlaying,
    ],
  );

  const onArticlePlayFromBackground = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!onAyahPlayAudio) return;
      const el = e.target as HTMLElement;
      if (
        el.closest(
          "button, a, input, select, textarea, summary, [data-word-lookup]",
        )
      ) {
        return;
      }
      onAyahPlayAudio(r.ayah);
    },
    [onAyahPlayAudio, r.ayah],
  );

  return (
    <article
      id={anchorId}
      title={
        onAyahPlayAudio
          ? "কার্ডে ক্লিক: এই আয়াত প্লে / চালু"
          : undefined
      }
      onClick={onAyahPlayAudio ? onArticlePlayFromBackground : undefined}
      className={`scroll-mt-32 rounded-xl border border-[var(--islamic-teal)]/12 bg-white/92 p-4 shadow-md shadow-[var(--islamic-teal)]/5 ring-1 ring-[var(--islamic-gold)]/10 transition-[box-shadow,ring-color,transform] duration-500 ease-out motion-reduce:transition-none dark:border-teal-800/40 dark:bg-teal-950/55 dark:ring-amber-900/25 sm:scroll-mt-36 sm:p-5 md:p-6 ${
        onAyahPlayAudio ? "cursor-pointer touch-manipulation" : ""
      } ${
        ayahAudioActive
          ? "z-[1] scale-[1.01] ring-2 ring-[var(--islamic-gold)]/55 shadow-lg shadow-[var(--islamic-teal)]/15 motion-reduce:scale-100"
          : ""
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {showSurahHeading ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-[var(--islamic-gold)]/25 pb-2 text-base dark:border-amber-800/35 sm:text-lg">
            <span className="font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
              {sm?.nameBn ?? `সূরা ${toBengaliDigits(r.surah)}`}
            </span>
            <span className="text-[var(--islamic-ink-soft)] dark:text-teal-200/75">
              (
              {sm?.nameEn ?? `Surah ${r.surah}`} · সূরা{" "}
              {toBengaliDigits(r.surah)} · আয়াত {toBengaliDigits(r.ayah)})
            </span>
          </div>
        ) : (
          <p className="text-sm font-semibold tracking-wide text-[var(--islamic-teal)] dark:text-teal-300 sm:text-base">
            আয়াত {toBengaliDigits(r.ayah)}
          </p>
        )}
        <div
          className={`flex max-w-full shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5 ${
            onAyahPlayAudio
              ? "rounded-2xl border border-[var(--islamic-teal)]/16 bg-white/75 p-1 shadow-sm ring-1 ring-[var(--islamic-gold)]/10 dark:border-teal-700/40 dark:bg-teal-950/55 dark:ring-amber-900/12"
              : ""
          }`}
        >
          {onAyahPlayAudio ? (
            <button
              type="button"
              onClick={onAudioToolbarToggle}
              aria-label={
                ayahAudioActive && ayahAudioIsPlaying
                  ? `আয়াত ${toBengaliDigits(r.ayah)} বিরতি`
                  : ayahAudioActive && !ayahAudioIsPlaying
                    ? `আয়াত ${toBengaliDigits(r.ayah)} চালু`
                    : `আয়াত ${toBengaliDigits(r.ayah)} শুনুন`
              }
              title={
                ayahAudioActive && ayahAudioIsPlaying
                  ? "বিরতি"
                  : ayahAudioActive && !ayahAudioIsPlaying
                    ? "চালু"
                    : "শুনুন"
              }
              aria-pressed={
                !!(onAyahPauseAudio && ayahAudioActive && ayahAudioIsPlaying)
              }
              className={`inline-flex min-h-10 touch-manipulation items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-[family-name:var(--font-bn)] font-semibold transition-colors sm:min-h-9 sm:px-3 sm:text-sm ${
                ayahAudioActive && ayahAudioIsPlaying
                  ? "border border-[#4a9d9d]/60 bg-[#4a9d9d]/22 text-[var(--islamic-teal-deep)] dark:border-teal-400/45 dark:bg-teal-800/55 dark:text-teal-50"
                  : ayahAudioActive && !ayahAudioIsPlaying
                    ? "border border-amber-600/40 bg-amber-50/90 text-amber-950 dark:border-amber-500/35 dark:bg-amber-950/50 dark:text-amber-100"
                    : "border border-[#4a9d9d]/45 bg-[#4a9d9d]/12 text-[var(--islamic-teal-deep)] hover:bg-[#4a9d9d]/18 dark:border-teal-500/40 dark:bg-teal-900/50 dark:text-teal-100 dark:hover:bg-teal-800/45"
              }`}
            >
              <span aria-hidden className="select-none text-base leading-none">
                {ayahAudioActive && ayahAudioIsPlaying ? "⏸" : "▶"}
              </span>
              <span className="inline">
                {ayahAudioActive && ayahAudioIsPlaying
                  ? "বিরতি"
                  : ayahAudioActive && !ayahAudioIsPlaying
                    ? "চালু"
                    : "শুনুন"}
              </span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onCopy}
            className="min-h-10 touch-manipulation rounded-lg border border-[var(--islamic-teal)]/20 bg-[var(--islamic-parchment)]/80 px-2.5 py-2 text-xs font-[family-name:var(--font-bn)] text-[var(--islamic-teal-deep)] hover:border-[var(--islamic-gold)]/50 sm:min-h-9 sm:px-2.5 sm:text-xs dark:border-teal-700/50 dark:bg-teal-900/50 dark:text-teal-100"
          >
            {copyOk ? "কপি ✓" : "কপি"}
          </button>
          <button
            type="button"
            onClick={onShare}
            className="min-h-10 touch-manipulation rounded-lg border border-[var(--islamic-teal)]/20 bg-[var(--islamic-parchment)]/80 px-2.5 py-2 text-xs font-[family-name:var(--font-bn)] text-[var(--islamic-teal-deep)] hover:border-[var(--islamic-gold)]/50 sm:min-h-9 sm:px-2.5 sm:text-xs dark:border-teal-700/50 dark:bg-teal-900/50 dark:text-teal-100"
          >
            শেয়ার
          </button>
          <button
            type="button"
            onClick={onBookmark}
            aria-pressed={booked}
            className={`min-h-10 touch-manipulation rounded-lg border px-2.5 py-2 text-xs font-[family-name:var(--font-bn)] transition-colors sm:min-h-9 sm:px-2.5 sm:text-xs ${
              booked
                ? "border-amber-600/60 bg-amber-100/90 text-amber-950 dark:border-amber-500/50 dark:bg-amber-950/70 dark:text-amber-100"
                : "border-[var(--islamic-teal)]/20 bg-[var(--islamic-parchment)]/80 text-[var(--islamic-teal-deep)] hover:border-[var(--islamic-gold)]/50 dark:border-teal-700/50 dark:bg-teal-900/50 dark:text-teal-100"
            }`}
          >
            {booked ? "★ বুকমার্ক" : "☆ বুকমার্ক"}
          </button>
          <Link
            href={`/research/lab?m=workspace&v=${r.surah}:${r.ayah}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-h-10 touch-manipulation items-center rounded-lg border border-[var(--islamic-teal)]/20 bg-[var(--islamic-parchment)]/80 px-2.5 py-2 text-xs font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal-deep)] hover:border-[var(--islamic-gold)]/50 sm:min-h-9 sm:px-2.5 sm:text-xs dark:border-teal-700/50 dark:bg-teal-900/50 dark:text-teal-100"
            title="গবেষণাগারে এই আয়াতের নোট"
          >
            গবেষক নোট
          </Link>
        </div>
      </div>

      {r.arabicText ? (
        <div
          role="paragraph"
          dir="rtl"
          lang="ar"
          className="mb-4 text-right text-[1.28rem] leading-[1.95] text-[var(--islamic-ink)] [font-family:var(--font-quran-ar)] dark:text-teal-50 sm:text-[clamp(1.38rem,2.8vw,1.85rem)] sm:leading-[2.05] md:mb-5"
        >
          <ClickableAyahText
            text={r.arabicText}
            lang="ar"
            ayahRef={{ surah: r.surah, ayah: r.ayah }}
            highlightRanges={
              highlightQuery?.trim() && highlightRanges
                ? highlightRanges.arabic
                : []
            }
          />
        </div>
      ) : null}

      <AyahTransliterationBelowArabic
        r={r}
        latinHighlightRanges={
          highlightQuery?.trim() && highlightRanges
            ? highlightRanges.latin
            : []
        }
        bengaliScriptHighlightRanges={
          highlightQuery?.trim() && highlightRanges
            ? highlightRanges.bengaliScript
            : []
        }
      />

      <div className="space-y-4 sm:space-y-5">
        <div>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--islamic-teal)]/75 dark:text-teal-400/85 sm:text-sm">
              বাংলা
            </p>
            {bnPrefs ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  bnPrefs.openAddTranslationModal();
                }}
                className="touch-manipulation rounded-lg border border-[#4a9d9d]/50 bg-[#4a9d9d]/14 px-2.5 py-1 font-[family-name:var(--font-bn)] text-[0.7rem] font-semibold text-[var(--islamic-teal-deep)] underline decoration-[var(--islamic-gold)]/45 underline-offset-2 hover:bg-[#4a9d9d]/22 dark:border-teal-500/45 dark:bg-teal-900/45 dark:text-teal-100 sm:text-xs"
              >
                ＋ অনুবাদ যোগ করুন
              </button>
            ) : null}
          </div>
          {bnPrefs ? (
            <BengaliTranslationStack
              r={r}
              visibleSourceIds={bnPrefs.visibleIds}
              primaryId={bnPrefs.primaryId}
              onHideSource={bnPrefs.removeVisible}
              bengaliHighlightRanges={
                highlightQuery?.trim() && highlightRanges
                  ? highlightRanges.bengali
                  : []
              }
            />
          ) : (
            <div
              className="font-[family-name:var(--font-bn)] text-base leading-relaxed text-[var(--islamic-ink)] dark:text-teal-100/95 sm:text-lg sm:leading-[1.72]"
              role="paragraph"
            >
              <ClickableAyahText
                text={r.bengaliTranslation}
                lang="bn"
                ayahRef={{ surah: r.surah, ayah: r.ayah }}
                highlightRanges={
                  highlightQuery?.trim() && highlightRanges
                    ? highlightRanges.bengali
                    : []
                }
              />
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--islamic-teal)]/75 dark:text-teal-400/85 sm:text-sm">
            English
          </p>
          <div
            className="text-base leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-200/80 sm:text-lg sm:leading-[1.72]"
            role="paragraph"
          >
            <ClickableAyahText
              text={r.englishTranslation}
              lang="en"
              highlightRanges={
                highlightQuery?.trim() && highlightRanges
                  ? highlightRanges.english
                  : []
              }
            />
          </div>
        </div>
      </div>
    </article>
  );
}
