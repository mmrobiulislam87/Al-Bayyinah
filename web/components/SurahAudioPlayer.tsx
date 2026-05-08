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

    const onDockAudioPlay = useCallback(() => {
      handleAudioPlay();
      notifyDockPlayback(true);
    }, [handleAudioPlay, notifyDockPlayback]);

    const onDockAudioPause = useCallback(() => {
      notifyDockPlayback(false);
    }, [notifyDockPlayback]);

    const onDockAudioEnded = useCallback(() => {
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
      "pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 sm:pt-3";

    if (fixedDock) {
      return (
        <div
          data-surah-audio-dock
          className={`fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-[var(--islamic-teal)]/25 bg-[var(--islamic-parchment)]/97 shadow-[0_-10px_40px_rgba(15,76,68,0.16)] backdrop-blur-lg dark:border-teal-700/55 dark:bg-teal-950/96 dark:shadow-black/45 ${className}`}
          role="region"
          aria-label={`${surahNameBn} — আয়াত সিঙ্ক তেলাওয়াত`}
        >
          <div
            className={`mx-auto w-full max-w-6xl px-3 sm:px-5 ${dockSafeBottom}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal)]/85 dark:text-teal-400/90">
                  তেলাওয়াত (আয়াত সিঙ্ক)
                </p>
                <p className="truncate font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
                  সূরা {toBengaliDigits(surahNumber)} · {surahNameBn}
                  {activeLocalAyah !== null ? (
                    <span className="ms-2 font-normal text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
                      — আয়াত{" "}
                      <span className="font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
                        {toBengaliDigits(activeLocalAyah)}
                      </span>
                    </span>
                  ) : (
                    <span className="ms-1 text-xs font-normal text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
                      · কোনো আয়াতে «শুনুন» চাপুন, বা প্লে দিয়ে ১ নম্বর থেকে
                    </span>
                  )}
                </p>
              </div>
              <label className="flex w-full min-w-0 flex-col gap-0.5 sm:w-56 sm:shrink-0">
                <span className="font-[family-name:var(--font-bn)] text-[0.65rem] font-medium text-[var(--islamic-teal)] dark:text-teal-400">
                  কণ্ঠ
                </span>
                <select
                  value={reciterId}
                  disabled={!hydrated}
                  onChange={(e) => onReciterChange(e.target.value)}
                  className="min-h-10 w-full touch-manipulation rounded-lg border border-[var(--islamic-teal)]/22 bg-white/95 px-2.5 py-2 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink)] outline-none focus:border-[var(--islamic-gold)]/55 focus:ring-2 focus:ring-[var(--islamic-gold)]/22 dark:border-teal-700/50 dark:bg-teal-900/55 dark:text-teal-50 disabled:opacity-60 sm:text-sm"
                >
                  {SURAH_RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.labelBn}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {ayahCount >= 1 ? (
              <audio
                ref={audioRef}
                className="mt-2 h-12 w-full sm:h-[3.25rem]"
                controls
                controlsList="nodownload"
                preload="metadata"
                src={ayahSyncSrc || undefined}
                onPlay={onDockAudioPlay}
                onPause={onDockAudioPause}
                onEnded={onDockAudioEnded}
                onError={() =>
                  setAudioError(
                    "অডিও লোড হয়নি। নেটওয়ার্ক বা অন্য কণ্ঠ চেষ্টা করুন।",
                  )
                }
                onLoadedData={() => setAudioError(null)}
              />
            ) : null}

            {audioError ? (
              <p className="mt-1.5 font-[family-name:var(--font-bn)] text-xs text-red-700 dark:text-red-400">
                {audioError}
              </p>
            ) : null}

            <p className="mt-1 truncate font-[family-name:var(--font-bn)] text-[0.65rem] text-[var(--islamic-ink-soft)]/88 dark:text-teal-400/72">
              আয়াতপ্রতি ফাইল · উৎস:{" "}
              <a
                href="https://alquran.cloud/cdn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--islamic-teal)] underline decoration-[var(--islamic-gold)]/40 underline-offset-2 dark:text-teal-300"
              >
                Islamic Network
              </a>
            </p>
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
