"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { toBengaliDigits } from "@/lib/numberBn";
import {
  ayahAudioUrlInSurah,
  DEFAULT_SURAH_RECITER_ID,
  readStoredSurahReciterId,
  surahAudioUrl,
  writeStoredSurahReciterId,
  SURAH_RECITERS,
} from "@/lib/quranRecitation";

function formatAudioClock(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export type SurahAudioPlayerHandle = {
  /**
   * বাটন ক্লিকের ধারাবাহিকতায় সরাসরি প্লে — ব্রাউজার অটোপ্লে নীতি মানে।
   */
  playAyahFromUserGesture: (localAyah: number) => void;
  /**
   * আয়াত ডক থেকে তেলাওয়াত থামানো।
   */
  pauseDockAudio: () => void;
};

type Props = {
  surahNumber: number;
  surahNameBn: string;
  className?: string;
  fixedDock?: boolean;
  ayahCount?: number;
  onPlayingAyahChange?: (localAyah: number | null) => void;
  /** আয়াত সিঙ্ক অডিও প্লে/পজ — আয়াত কার্ডের প্লে·বিরতি বাটনের সাথে মিল। */
  onAyahDockPlaybackChange?: (playing: boolean) => void;
};

const SurahAudioPlayer = forwardRef<SurahAudioPlayerHandle, Props>(
  function SurahAudioPlayer(
    {
      surahNumber,
      surahNameBn,
      className = "",
      fixedDock = false,
      ayahCount = 0,
      onPlayingAyahChange,
      onAyahDockPlaybackChange,
    },
    ref,
  ) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [reciterId, setReciterId] = useState(DEFAULT_SURAH_RECITER_ID);
    const [hydrated, setHydrated] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    const [ayahSyncSrc, setAyahSyncSrc] = useState("");
    const [activeLocalAyah, setActiveLocalAyah] = useState<number | null>(null);
    const [dockTime, setDockTime] = useState(0);
    const [dockDur, setDockDur] = useState(0);
    const [dockPlaying, setDockPlaying] = useState(false);
    const activeAyahRef = useRef<number | null>(null);
    const autoplayAfterSrcRef = useRef(false);
    const prevSurahForSyncRef = useRef<number | null>(null);
    const ayahCountRef = useRef(ayahCount);
    ayahCountRef.current = ayahCount;
    const surahNumberRef = useRef(surahNumber);
    surahNumberRef.current = surahNumber;

    useEffect(() => {
      activeAyahRef.current = activeLocalAyah;
    }, [activeLocalAyah]);

    useEffect(() => {
      setDockTime(0);
      setDockDur(0);
    }, [ayahSyncSrc]);

    useEffect(() => {
      setReciterId(readStoredSurahReciterId());
      setHydrated(true);
    }, []);

    const surahOnlySrc = useMemo(() => {
      try {
        return surahAudioUrl(surahNumber, reciterId);
      } catch {
        return "";
      }
    }, [surahNumber, reciterId]);

    const onReciterChange = useCallback((id: string) => {
      setReciterId(id);
      writeStoredSurahReciterId(id);
      setAudioError(null);
    }, []);

    const pauseDockAudio = useCallback(() => {
      if (!fixedDock) return;
      audioRef.current?.pause();
    }, [fixedDock]);

    const playAyahFromUserGesture = useCallback(
      (localAyah: number) => {
        if (!fixedDock || ayahCount < 1) return;
        if (localAyah < 1 || localAyah > ayahCount) return;
        const elFirst = audioRef.current;
        if (
          elFirst &&
          activeAyahRef.current === localAyah &&
          elFirst.paused
        ) {
          void elFirst.play().catch(() =>
            setAudioError("প্লে শুরু হয়নি। নিচের কন্ট্রোল থেকে আবার চেষ্টা করুন।"),
          );
          return;
        }
        let url: string;
        try {
          url = ayahAudioUrlInSurah(surahNumber, localAyah, reciterId);
        } catch {
          setAudioError("অডিও URL গঠন ব্যর্থ।");
          return;
        }
        setAudioError(null);
        autoplayAfterSrcRef.current = false;
        activeAyahRef.current = localAyah;
        setActiveLocalAyah(localAyah);
        onPlayingAyahChange?.(localAyah);
        setAyahSyncSrc(url);
        const el = audioRef.current;
        if (el) {
          el.pause();
          el.src = url;
          el.load();
          void el.play().catch(() =>
            setAudioError("প্লে শুরু হয়নি। নিচের কন্ট্রোল থেকে আবার চেষ্টা করুন।"),
          );
        } else {
          autoplayAfterSrcRef.current = true;
        }
      },
      [
        fixedDock,
        ayahCount,
        surahNumber,
        reciterId,
        onPlayingAyahChange,
      ],
    );

    useImperativeHandle(
      ref,
      () => ({ playAyahFromUserGesture, pauseDockAudio }),
      [playAyahFromUserGesture, pauseDockAudio],
    );

    /** সূরা বদল: আয়াত ১, হাইলাইট মুছে। */
    useEffect(() => {
      if (!fixedDock || !hydrated || ayahCount < 1) return;
      const surahChanged = prevSurahForSyncRef.current !== surahNumber;
      if (!surahChanged) return;
      prevSurahForSyncRef.current = surahNumber;
      activeAyahRef.current = null;
      setActiveLocalAyah(null);
      onPlayingAyahChange?.(null);
      onAyahDockPlaybackChange?.(false);
      try {
        setAyahSyncSrc(ayahAudioUrlInSurah(surahNumber, 1, reciterId));
      } catch {
        setAyahSyncSrc("");
      }
    }, [
      surahNumber,
      hydrated,
      fixedDock,
      ayahCount,
      reciterId,
      onPlayingAyahChange,
      onAyahDockPlaybackChange,
    ]);

    /** শুধু কণ্ঠ বদল: বর্তমান আয়াতের নতুন ফাইল (সূরা নেভ ইফেক্ট আলাদা)। */
    useEffect(() => {
      if (!fixedDock || !hydrated || ayahCountRef.current < 1) return;
      const s = surahNumberRef.current;
      if (prevSurahForSyncRef.current !== s) return;
      const ayah = activeAyahRef.current ?? 1;
      if (ayah < 1 || ayah > ayahCountRef.current) return;
      try {
        const u = ayahAudioUrlInSurah(s, ayah, reciterId);
        setAyahSyncSrc(u);
        const el = audioRef.current;
        if (el) {
          el.pause();
          el.src = u;
          el.load();
        }
      } catch {
        setAyahSyncSrc("");
      }
    }, [reciterId, hydrated, fixedDock]);

    useEffect(() => {
      if (!autoplayAfterSrcRef.current) return;
      autoplayAfterSrcRef.current = false;
      const el = audioRef.current;
      if (!el) return;
      void el.play().catch(() =>
        setAudioError("পরের আয়াত প্লে হয়নি। কন্ট্রোল থেকে চালান।"),
      );
    }, [ayahSyncSrc]);

    const runAfterAyahEnds = useCallback(() => {
      const cur = activeAyahRef.current;
      if (cur === null || ayahCount < 1) return;
      const next = cur + 1;
      if (next > ayahCount) {
        activeAyahRef.current = null;
        setActiveLocalAyah(null);
        onPlayingAyahChange?.(null);
        try {
          setAyahSyncSrc(ayahAudioUrlInSurah(surahNumber, 1, reciterId));
        } catch {
          setAyahSyncSrc("");
        }
        return;
      }
      autoplayAfterSrcRef.current = true;
      activeAyahRef.current = next;
      setActiveLocalAyah(next);
      onPlayingAyahChange?.(next);
      try {
        setAyahSyncSrc(ayahAudioUrlInSurah(surahNumber, next, reciterId));
      } catch {
        setAyahSyncSrc("");
      }
    }, [ayahCount, surahNumber, reciterId, onPlayingAyahChange]);

    const handleAudioPlay = useCallback(() => {
      if (!fixedDock) return;
      if (activeAyahRef.current === null) {
        activeAyahRef.current = 1;
        setActiveLocalAyah(1);
        onPlayingAyahChange?.(1);
      }
    }, [fixedDock, onPlayingAyahChange]);

    const notifyDockPlayback = useCallback(
      (playing: boolean) => {
        onAyahDockPlaybackChange?.(playing);
      },
      [onAyahDockPlaybackChange],
    );

    const onDockTimeUpdate = useCallback(() => {
      const el = audioRef.current;
      if (el) setDockTime(el.currentTime);
    }, []);

    const onDockLoaded = useCallback(() => {
      setAudioError(null);
      const el = audioRef.current;
      if (el && Number.isFinite(el.duration)) {
        setDockDur(el.duration);
      }
    }, []);

    const onDockAudioPlay = useCallback(() => {
      setDockPlaying(true);
      handleAudioPlay();
      notifyDockPlayback(true);
    }, [handleAudioPlay, notifyDockPlayback]);

    const onDockAudioPause = useCallback(() => {
      setDockPlaying(false);
      notifyDockPlayback(false);
    }, [notifyDockPlayback]);

    const onDockAudioEnded = useCallback(() => {
      setDockPlaying(false);
      notifyDockPlayback(false);
      runAfterAyahEnds();
    }, [notifyDockPlayback, runAfterAyahEnds]);

    useEffect(() => {
      setAudioError(null);
      if (fixedDock) return;
      const el = audioRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    }, [surahNumber, reciterId, surahOnlySrc, fixedDock]);

    const dockSafeBottom =
      "pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 sm:pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pt-1.5";

    if (fixedDock) {
      return (
        <div
          data-surah-audio-dock
          className={`fixed inset-x-0 bottom-0 z-30 bg-transparent ${className}`}
          role="region"
          aria-label={`${surahNameBn} — আয়াত সিঙ্ক তেলাওয়াত`}
        >
          <div
            className={`pointer-events-none px-2 sm:px-3 ${dockSafeBottom}`}
          >
            <div className="pointer-events-auto mx-auto w-full max-w-[21rem] sm:max-w-[24rem]">
            {ayahCount >= 1 ? (
              <audio
                ref={audioRef}
                className="sr-only"
                preload="metadata"
                src={ayahSyncSrc || undefined}
                onPlay={onDockAudioPlay}
                onPause={onDockAudioPause}
                onEnded={onDockAudioEnded}
                onTimeUpdate={onDockTimeUpdate}
                onError={() =>
                  setAudioError(
                    "অডিও লোড হয়নি। নেটওয়ার্ক বা অন্য কণ্ঠ চেষ্টা করুন।",
                  )
                }
                onLoadedData={onDockLoaded}
                onLoadedMetadata={onDockLoaded}
              />
            ) : null}

            <div
              role="group"
              aria-label={`${surahNameBn} — তেলাওয়াত নিয়ন্ত্রণ`}
              className="relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--islamic-teal)_32%,rgba(255,255,255,0.55))] bg-[linear-gradient(168deg,rgba(255,255,255,0.97)_0%,rgba(250,253,252,0.94)_28%,rgba(238,249,246,0.9)_62%,rgba(225,243,239,0.93)_100%)] px-2.5 py-2 shadow-[0_2px_0_rgba(255,255,255,0.92)_inset,0_-2px_10px_rgba(15,76,68,0.05)_inset,0_-1px_0_rgba(15,76,68,0.07)_inset,0_10px_38px_-6px_rgba(15,76,68,0.16),0_4px_14px_-2px_rgba(15,76,68,0.11),0_2px_6px_rgba(15,76,68,0.07)] ring-1 ring-[var(--islamic-gold)]/18 transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_2px_0_rgba(255,255,255,0.95)_inset,0_-2px_10px_rgba(15,76,68,0.05)_inset,0_12px_44px_-6px_rgba(15,76,68,0.18),0_6px_18px_-2px_rgba(15,76,68,0.13)] dark:border-teal-500/28 dark:bg-[linear-gradient(168deg,rgba(42,115,106,0.72)_0%,rgba(22,78,70,0.82)_38%,rgba(10,48,45,0.91)_72%,rgba(6,32,30,0.95)_100%)] dark:shadow-[0_1px_0_rgba(129,214,196,0.18)_inset,0_2px_12px_rgba(0,0,0,0.35)_inset,0_-1px_0_rgba(0,0,0,0.35)_inset,0_14px_46px_rgba(0,0,0,0.45),0_6px_20px_rgba(0,0,0,0.35),0_3px_0_rgba(0,0,0,0.22)] dark:ring-amber-400/12 dark:hover:shadow-[0_1px_0_rgba(129,214,196,0.22)_inset,0_2px_12px_rgba(0,0,0,0.32)_inset,0_16px_52px_rgba(0,0,0,0.48),0_6px_22px_rgba(0,0,0,0.38)]"
            >
              <div className="w-full min-w-0 border-b border-[var(--islamic-teal)]/10 pb-1.5 text-center dark:border-teal-600/25">
                <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
                  <span className="shrink-0 rounded-md bg-[var(--islamic-teal)]/14 px-1.5 py-px font-[family-name:var(--font-bn)] text-[0.5625rem] font-semibold uppercase tracking-wide text-[var(--islamic-teal)] dark:bg-teal-800/55 dark:text-teal-300">
                    তেলাওয়াত · সিঙ্ক
                  </span>
                  <p className="min-w-0 text-balance font-[family-name:var(--font-bn)] text-[0.75rem] font-semibold leading-tight text-[var(--islamic-teal-deep)] dark:text-teal-50 sm:text-[0.8125rem]">
                    সূরা {toBengaliDigits(surahNumber)} · {surahNameBn}
                    {activeLocalAyah !== null ? (
                      <span className="ms-1 font-normal text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
                        · আয়াত{" "}
                        <span className="font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
                          {toBengaliDigits(activeLocalAyah)}
                        </span>
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1.5">
                {ayahCount >= 1 ? (
                  <>
                    <button
                      type="button"
                      disabled={!ayahSyncSrc}
                      onClick={() => {
                        const el = audioRef.current;
                        if (!el || !ayahSyncSrc) return;
                        if (el.paused) {
                          void el.play().catch(() =>
                            setAudioError("প্লে শুরু হয়নি। আবার চেষ্টা করুন।"),
                          );
                        } else {
                          el.pause();
                        }
                      }}
                      className="relative flex h-5 w-5 shrink-0 touch-manipulation items-center justify-center overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--islamic-teal)_82%,black)] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--islamic-teal)_22%,white)_0%,var(--islamic-teal)_42%,color-mix(in_srgb,var(--islamic-teal)_78%,black)_100%)] text-white shadow-[0_1px_0_rgba(255,255,255,0.38)_inset,0_4px_10px_rgba(15,76,68,0.28),0_2px_0_color-mix(in_srgb,var(--islamic-teal)_55%,black)] transition-[transform,filter,box-shadow] hover:brightness-[1.06] active:translate-y-px active:brightness-95 active:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_2px_6px_rgba(15,76,68,0.22),0_1px_0_color-mix(in_srgb,var(--islamic-teal)_55%,black)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-sm disabled:active:translate-y-0 dark:border-teal-900/55 dark:bg-[linear-gradient(165deg,rgb(55,170,155)_0%,rgb(15,110,98)_45%,rgb(8,70,62)_100%)] dark:shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_5px_14px_rgba(0,0,0,0.42),0_2px_0_rgba(0,0,0,0.35)] dark:active:shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_2px_8px_rgba(0,0,0,0.35),0_1px_0_rgba(0,0,0,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--islamic-gold)]"
                      aria-label={dockPlaying ? "বিরতি" : "প্লে"}
                    >
                      {dockPlaying ? (
                        <span className="flex gap-px" aria-hidden>
                          <span className="block h-1.5 w-0.5 rounded-[1px] bg-current" />
                          <span className="block h-1.5 w-0.5 rounded-[1px] bg-current" />
                        </span>
                      ) : (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          className="ms-px"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <span
                      className="shrink-0 font-[family-name:var(--font-geist-mono)] text-[0.5625rem] tabular-nums text-[var(--islamic-ink-soft)] dark:text-teal-200/86 sm:text-[0.6rem]"
                      aria-live="polite"
                    >
                      {formatAudioClock(dockTime)}
                      <span className="text-[var(--islamic-ink-soft)]/45 dark:text-teal-400/50">
                        /
                      </span>
                      {formatAudioClock(dockDur)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={dockDur > 0 ? dockDur : 1}
                      step="any"
                      value={dockDur > 0 ? Math.min(dockTime, dockDur) : 0}
                      disabled={!dockDur}
                      onChange={(e) => {
                        const el = audioRef.current;
                        if (!el) return;
                        const t = Number(e.target.value);
                        el.currentTime = t;
                        setDockTime(t);
                      }}
                      className="dock-audio-scrub dock-audio-scrub--compact h-3 w-[6.25rem] shrink-0 cursor-pointer sm:w-[7.25rem] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="টাইমলাইন"
                    />
                  </>
                ) : null}

                <label className="flex max-w-full items-center justify-center gap-1">
                  <span className="shrink-0 font-[family-name:var(--font-bn)] text-[0.5625rem] font-medium text-[var(--islamic-teal)] dark:text-teal-400">
                    কণ্ঠ
                  </span>
                  <select
                    value={reciterId}
                    disabled={!hydrated}
                    onChange={(e) => onReciterChange(e.target.value)}
                    className="min-h-[1.375rem] w-[min(100%,14rem)] touch-manipulation rounded-md border border-[var(--islamic-teal)]/25 bg-white/92 py-px pe-1 ps-1 font-[family-name:var(--font-bn)] text-[0.65rem] leading-tight text-[var(--islamic-ink)] outline-none focus:border-[var(--islamic-gold)]/55 focus:ring-1 focus:ring-[var(--islamic-gold)]/25 dark:border-teal-600/40 dark:bg-teal-900/65 dark:text-teal-50 disabled:opacity-60 sm:w-[min(100%,16.5rem)] sm:text-[0.68rem]"
                  >
                    {SURAH_RECITERS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.labelBn}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {audioError ? (
              <p className="mt-1.5 text-center font-[family-name:var(--font-bn)] text-[0.65rem] leading-tight text-red-700 dark:text-red-400">
                {audioError}
              </p>
            ) : null}

            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`static w-full rounded-2xl border border-[var(--islamic-teal)]/15 bg-white/90 px-4 py-4 shadow-sm ring-1 ring-[var(--islamic-gold)]/12 dark:border-teal-800/45 dark:bg-teal-950/60 dark:ring-amber-900/20 sm:px-5 sm:py-5 ${className}`}
        role="region"
        aria-label={`${surahNameBn} — সূরার তেলাওয়াত শুনুন`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-bn)] text-base font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100 sm:text-lg">
              সূরার তেলাওয়াত শুনুন
            </h2>
            <p className="mt-0.5 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
              উপরে কণ্ঠ বেছে নিচের প্লে চাপুন — পুরো সূরা
            </p>
          </div>
          <label className="flex min-w-0 flex-col gap-1 sm:w-64 sm:shrink-0">
            <span className="font-[family-name:var(--font-bn)] text-xs font-medium text-[var(--islamic-teal)] dark:text-teal-400">
              কণ্ঠ (কারি)
            </span>
            <select
              value={reciterId}
              disabled={!hydrated}
              onChange={(e) => onReciterChange(e.target.value)}
              className="min-h-11 w-full touch-manipulation rounded-xl border border-[var(--islamic-teal)]/20 bg-white px-3 py-2.5 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink)] outline-none focus:border-[var(--islamic-gold)]/55 focus:ring-2 focus:ring-[var(--islamic-gold)]/25 dark:border-teal-700/50 dark:bg-teal-900/40 dark:text-teal-50 disabled:opacity-60 sm:text-base"
            >
              {SURAH_RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.labelBn}
                </option>
              ))}
            </select>
          </label>
        </div>

        {surahOnlySrc ? (
          <div className="mt-6 border-t border-[var(--islamic-teal)]/12 pt-5 dark:border-teal-700/35">
            <p className="mb-2 font-[family-name:var(--font-bn)] text-xs font-medium text-[var(--islamic-teal)]/90 dark:text-teal-400/90">
              প্লে ও টাইমলাইন
            </p>
            <audio
              ref={audioRef}
              key={`${surahNumber}-${reciterId}`}
              className="h-14 w-full"
              controls
              controlsList="nodownload"
              preload="metadata"
              src={surahOnlySrc}
              onError={() =>
                setAudioError(
                  "অডিও লোড হয়নি। নেটওয়ার্ক চেক করুন বা অন্য কণ্ঠ বেছে দেখুন।",
                )
              }
              onLoadedData={() => setAudioError(null)}
            />
          </div>
        ) : null}

        {audioError ? (
          <p className="mt-3 font-[family-name:var(--font-bn)] text-sm text-red-700 dark:text-red-400">
            {audioError}
          </p>
        ) : null}

        <p className="mt-3 font-[family-name:var(--font-bn)] text-[0.7rem] leading-relaxed text-[var(--islamic-ink-soft)]/85 dark:text-teal-400/70 sm:text-xs">
          উৎস:{" "}
          <a
            href="https://alquran.cloud/cdn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--islamic-teal)] underline decoration-[var(--islamic-gold)]/45 underline-offset-2 hover:text-[var(--islamic-teal-deep)] dark:text-teal-300 dark:hover:text-teal-100"
          >
            Al Quran Cloud / Islamic Network
          </a>{" "}
          · সূরা {toBengaliDigits(surahNumber)}
        </p>
      </div>
    );
  },
);

SurahAudioPlayer.displayName = "SurahAudioPlayer";

export default SurahAudioPlayer;
