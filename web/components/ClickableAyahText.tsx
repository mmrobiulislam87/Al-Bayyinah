"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  type DictionaryLookup,
  lookupWord,
} from "@/lib/quranDictionary";
import {
  type RemoteDictionaryOk,
  fetchRemoteDictionary,
} from "@/lib/dictionaryClient";
import {
  corpusRowGlosses,
  ensureQuranWordCorpusLoaded,
  getCorpusAyahRow,
  lookupCorpusForAyahWord,
} from "@/lib/quranWordCorpus";
import { MARK_CLASS, mergeRanges } from "@/lib/searchHighlight";

type LocaleTag = "ar" | "bn" | "en";

type WordSeg = { index: number; segment: string; isWordLike: boolean };

function intlSegmentWords(text: string, locale: string): WordSeg[] | null {
  try {
    const Ctor = (
      Intl as typeof Intl & { Segmenter?: typeof Intl.Segmenter }
    ).Segmenter;
    if (typeof Ctor !== "function") return null;
    const seg = new Ctor(locale, { granularity: "word" });
    const out: WordSeg[] = [];
    for (const s of seg.segment(text) as Iterable<{
      segment: string;
      index: number;
      isWordLike: boolean;
    }>) {
      out.push({
        index: s.index,
        segment: s.segment,
        isWordLike: Boolean(s.isWordLike),
      });
    }
    return out;
  } catch {
    return null;
  }
}

/**
 * Intl.Segmenter ছাড়া — আরবি/বাংলা/ল্যাটিনসহ \p{L} টোকেন।
 */
function regexSegmentWords(text: string): WordSeg[] {
  const out: WordSeg[] = [];
  const re = /[\p{L}\p{M}\p{N}]+/gu;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push({
        index: last,
        segment: text.slice(last, m.index),
        isWordLike: false,
      });
    }
    out.push({
      index: m.index,
      segment: m[0],
      isWordLike: true,
    });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    out.push({
      index: last,
      segment: text.slice(last),
      isWordLike: false,
    });
  }
  return out;
}

function segmentAll(text: string, lang: LocaleTag): WordSeg[] {
  /** আরবিতে শুধু regex — Intl.Segmenter মাঝে মাঝে টোকেন কorpus/regex থেকে আলাদা */
  if (lang === "ar") return regexSegmentWords(text);
  const locale = lang === "bn" ? "bn" : "en";
  return intlSegmentWords(text, locale) ?? regexSegmentWords(text);
}

function rangesOverlapWord(
  wStart: number,
  wEnd: number,
  merged: [number, number][],
): boolean {
  return merged.some(([a, b]) => Math.max(wStart, a) < Math.min(wEnd, b));
}

type PopoverState = {
  rect: DOMRect;
  surface: string;
  lang: LocaleTag;
  hit: DictionaryLookup | null;
};

type HoverTipState = {
  rect: DOMRect;
  bn: string;
  enLine: string;
};

function HoverGlossTooltip({ tip }: { tip: HoverTipState | null }) {
  if (!tip) return null;
  const { rect, bn, enLine } = tip;
  const left = rect.left + rect.width / 2;
  const top = rect.top;
  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-[90] max-w-[min(380px,calc(100vw-1rem))] rounded-lg bg-teal-700 px-3.5 py-2.5 text-center shadow-lg shadow-black/25 ring-1 ring-teal-500/40 dark:bg-teal-600 dark:ring-teal-400/35 sm:max-w-[min(420px,calc(100vw-2rem))] sm:px-4 sm:py-3"
      style={{
        left,
        top,
        transform: "translate(-50%, calc(-100% - 10px))",
      }}
    >
      <p
        dir="auto"
        className="font-[family-name:var(--font-bn)] text-[0.94rem] font-medium leading-snug text-white sm:text-base"
      >
        {bn}
      </p>
      {enLine ? (
        <p className="mt-1.5 border-t border-white/20 pt-1.5 text-[0.78rem] leading-snug text-teal-100/95 sm:text-sm sm:leading-relaxed">
          {enLine}
        </p>
      ) : null}
      <span
        className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-teal-700 dark:border-t-teal-600"
        aria-hidden
      />
    </div>
  );
}

function DictionaryPopover({
  open,
  state,
  onClose,
  titleId,
}: {
  open: boolean;
  state: PopoverState | null;
  onClose: () => void;
  titleId: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [remote, setRemote] = useState<RemoteDictionaryOk | null>(null);
  const [remotePhase, setRemotePhase] = useState<"idle" | "loading" | "done">(
    "idle",
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if ((t as HTMLElement).closest?.("[data-word-lookup]")) return;
      onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setRemote(null);
      setRemotePhase("idle");
      return;
    }
    if (!state) return;
    if (state.hit) {
      setRemote(null);
      setRemotePhase("idle");
      return;
    }
    let cancelled = false;
    setRemote(null);
    setRemotePhase("loading");
    fetchRemoteDictionary(state.surface, state.lang)
      .then((r) => {
        if (cancelled) return;
        if (r.ok) setRemote(r);
        else setRemote(null);
      })
      .finally(() => {
        if (!cancelled) setRemotePhase("done");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- state-এ DOMRect থাকে; পাঠ/মিল শুধু deps-এ
  }, [
    open,
    state?.surface,
    state?.lang,
    state?.hit?.entry?.lemmaAr,
    state?.hit?.matchedAs,
  ]);

  if (!open || !state) return null;

  const pad = 10;
  const width = Math.min(
    400,
    typeof window !== "undefined" ? window.innerWidth - 16 : 400,
  );
  let left = state.rect.left + state.rect.width / 2 - width / 2;
  if (typeof window !== "undefined") {
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  }
  /** `position: fixed` — ভিউপোর্ট কোঅর্ডিনেট */
  const top = state.rect.bottom + pad;

  const { hit, surface, lang } = state;

  return (
    <div
      ref={panelRef}
      data-dict-panel
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="fixed z-[100] max-h-[min(72vh,460px)] overflow-y-auto rounded-xl border border-[var(--islamic-teal)]/25 bg-[var(--islamic-parchment)]/98 px-4 py-3.5 text-base shadow-lg shadow-[var(--islamic-teal)]/15 ring-1 ring-[var(--islamic-gold)]/20 sm:px-5 sm:text-lg dark:border-teal-700/50 dark:bg-teal-950/95 dark:ring-amber-900/30"
      style={{
        top,
        left,
        width,
      }}
    >
      <p id={titleId} className="mb-3 border-b border-[var(--islamic-gold)]/35 pb-2 font-[family-name:var(--font-bn)] text-sm font-semibold uppercase tracking-wide text-[var(--islamic-teal)] dark:border-amber-800/40 dark:text-teal-300 sm:text-base">
        ত্রিভাষিক শব্দকোষ
      </p>
      <p
        className={`mb-3 text-[var(--islamic-ink)] dark:text-teal-50 ${lang === "ar" ? "text-right [font-family:var(--font-quran-ar)] text-xl leading-relaxed sm:text-2xl" : lang === "bn" ? "font-[family-name:var(--font-bn)] text-base sm:text-lg" : "text-base sm:text-lg"}`}
        dir={lang === "ar" ? "rtl" : "ltr"}
        lang={lang === "ar" ? "ar" : lang === "bn" ? "bn" : "en"}
      >
        <span className="text-xs font-normal text-[var(--islamic-ink-soft)] dark:text-teal-400 sm:text-sm">
          নির্বাচিত শব্দ{" "}
        </span>
        <span className="font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
          {surface}
        </span>
      </p>
      {hit ? (
        <div className="space-y-3 text-[var(--islamic-ink)] dark:text-teal-100/95">
          {hit.entry.sourceLabel ? (
            <p className="font-[family-name:var(--font-bn)] text-sm font-medium text-[var(--islamic-teal)] dark:text-teal-400">
              {hit.entry.sourceLabel}
            </p>
          ) : null}
          <div
            className="text-right text-lg leading-relaxed [font-family:var(--font-quran-ar)] dark:text-teal-50 sm:text-xl"
            dir="rtl"
            lang="ar"
          >
            <span className="text-xs font-sans text-[var(--islamic-teal)] dark:text-teal-400 sm:text-sm">
              আরবি মূল{" "}
            </span>
            {hit.entry.lemmaAr}
          </div>
          <div className="font-[family-name:var(--font-bn)] text-base leading-relaxed sm:text-lg">
            <span className="text-xs font-sans font-semibold text-[var(--islamic-teal)] dark:text-teal-400 sm:text-sm">
              বাংলা{" "}
            </span>
            {hit.entry.glossBn}
          </div>
          <div className="text-base leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-200/90 sm:text-lg">
            <span className="text-xs font-semibold text-[var(--islamic-teal)] dark:text-teal-400 sm:text-sm">
              English{" "}
            </span>
            {hit.entry.glossEn}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {remotePhase === "loading" && (
            <p className="font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-teal)] dark:text-teal-400">
              অনলাইন অভিধান খোঁজা হচ্ছে…
            </p>
          )}
          {remotePhase === "done" && remote?.ok && (
            <div className="space-y-2 border-t border-[var(--islamic-gold)]/25 pt-2 dark:border-amber-800/35">
              <p className="font-[family-name:var(--font-bn)] text-[0.65rem] font-semibold text-[var(--islamic-teal)] dark:text-teal-400">
                অনলাইন সংক্ষিপ্ত ({remote.source}
                {remote.titleUsed ? ` · ${remote.titleUsed}` : ""})
              </p>
              {remote.glossBn ? (
                <p className="font-[family-name:var(--font-bn)] text-xs leading-relaxed text-[var(--islamic-ink)] dark:text-teal-100/95">
                  {remote.glossBn}
                </p>
              ) : null}
              {remote.glossEn ? (
                <p className="text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-200/85">
                  {remote.glossEn}
                </p>
              ) : null}
              {remote.text &&
              remote.text.length >
                Math.max(remote.glossEn?.length ?? 0, remote.glossBn?.length ?? 0) +
                  30 ? (
                <div className="max-h-40 overflow-y-auto whitespace-pre-wrap text-[11px] leading-snug text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
                  {remote.text}
                </div>
              ) : null}
              <p className="font-[family-name:var(--font-bn)] text-[0.6rem] leading-snug text-[var(--islamic-ink-soft)]/90 dark:text-teal-400/80">
                উৎস ইন্টারনেটের খোলা অভিধান; কুরআনী প্রসঙ্গে অর্থ আলেমের তাফসীর
                দেখুন।
              </p>
            </div>
          )}
          {remotePhase === "done" && !remote?.ok && (
            <p className="font-[family-name:var(--font-bn)] text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
              স্থানীয় শব্দকোষ ও অনলাইন উৎস (Wiktionary / Free Dictionary) থেকেও
              সংজ্ঞা পাওয়া যায়নি। নেটওয়ার্ক বা শব্দের বানান যাচাই করুন।
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full min-h-11 touch-manipulation rounded-lg border border-[var(--islamic-teal)]/25 py-2.5 text-sm font-[family-name:var(--font-bn)] text-[var(--islamic-teal-deep)] hover:bg-[var(--islamic-teal)]/5 dark:border-teal-700/50 dark:text-teal-200 dark:hover:bg-teal-900/40 sm:mt-3 sm:min-h-10 sm:text-base"
      >
        বন্ধ করুন
      </button>
    </div>
  );
}

type Props = {
  text: string;
  lang: LocaleTag;
  highlightRanges?: [number, number][];
  /** আরবি শব্দে শব্দে কorpus মিলের জন্য (সূরা/আয়াত) */
  ayahRef?: { surah: number; ayah: number };
};

const wordBtnClass =
  "mx-0 inline min-h-[2.75rem] cursor-pointer touch-manipulation rounded-sm border-0 bg-transparent px-0.5 py-1 align-baseline font-[inherit] text-[inherit] decoration-[var(--islamic-gold)]/70 decoration-dotted underline-offset-[0.18em] hover:bg-[var(--islamic-teal)]/6 hover:decoration-[var(--islamic-teal-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--islamic-gold)]/60 sm:min-h-0 sm:px-0 sm:py-0 dark:hover:bg-teal-900/35 dark:hover:decoration-amber-200/80";

export function ClickableAyahText({
  text,
  lang,
  highlightRanges = [],
  ayahRef,
}: Props): ReactNode {
  const titleId = useId();
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [arCorpusRow, setArCorpusRow] = useState<string[][] | null>(null);
  const [hoverTip, setHoverTip] = useState<HoverTipState | null>(null);
  const showHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const arSurah = ayahRef?.surah;
  const arAyah = ayahRef?.ayah;

  useEffect(() => {
    let cancelled = false;
    if (lang !== "ar" || arSurah == null || arAyah == null) {
      setArCorpusRow(null);
      return () => {
        cancelled = true;
      };
    }
    void ensureQuranWordCorpusLoaded().then(() => {
      if (cancelled) return;
      setArCorpusRow(getCorpusAyahRow(arSurah, arAyah));
    });
    return () => {
      cancelled = true;
    };
  }, [lang, arSurah, arAyah]);

  const mergedHL = useMemo(
    () =>
      mergeRanges(
        highlightRanges.filter(([s, e]) => s >= 0 && e <= text.length && s < e),
      ),
    [highlightRanges, text.length],
  );

  const segs = useMemo(() => segmentAll(text, lang), [text, lang]);

  /** কorpusের টোকেনে স্পেস/ۛ ইত্যাদি — regex ভাঙে না; লাইন যদি sync করা arabicText হয়। */
  const renderArabicFromCorpus = useMemo(() => {
    if (lang !== "ar" || !ayahRef || !arCorpusRow?.length) return false;
    const joined = arCorpusRow.map((w) => w[0]).join(" ");
    return joined.normalize("NFC") === text.normalize("NFC");
  }, [lang, ayahRef, arCorpusRow, text]);

  const onWord = useCallback(
    async (surface: string, el: HTMLElement) => {
      if (!surface) return;
      const rect = el.getBoundingClientRect();
      let hit: DictionaryLookup | null = null;
      if (lang === "ar" && ayahRef && text) {
        await ensureQuranWordCorpusLoaded();
        hit = lookupCorpusForAyahWord({
          surah: ayahRef.surah,
          ayah: ayahRef.ayah,
          arabicLine: text,
          surface,
        });
      }
      if (!hit) hit = lookupWord(surface, lang);
      setPopover({ rect, surface, lang, hit });
    },
    [ayahRef, lang, text],
  );

  const clearHoverTimers = useCallback(() => {
    if (showHoverTimerRef.current) {
      clearTimeout(showHoverTimerRef.current);
      showHoverTimerRef.current = null;
    }
    if (hideHoverTimerRef.current) {
      clearTimeout(hideHoverTimerRef.current);
      hideHoverTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (popover !== null) {
      setHoverTip(null);
      clearHoverTimers();
    }
  }, [popover, clearHoverTimers]);

  useEffect(() => () => clearHoverTimers(), [clearHoverTimers]);

  const showHoverFromGloss = useCallback(
    (el: HTMLElement, gloss: { bn: string; en: string; tr: string }) => {
      clearHoverTimers();
      if (popover !== null) return;
      const bn = (gloss.bn || "").trim();
      const en = (gloss.en || "").trim();
      const tr = (gloss.tr || "").trim();
      const primary = bn || en || "—";
      let enLine = "";
      if (bn && en) {
        enLine = tr ? `${en} · ${tr}` : en;
      } else if (!bn && en && tr) {
        enLine = `${en} · ${tr}`;
      } else if (!bn && tr) {
        enLine = tr;
      }
      showHoverTimerRef.current = setTimeout(() => {
        setHoverTip({
          rect: el.getBoundingClientRect(),
          bn: primary,
          enLine,
        });
      }, 90);
    },
    [popover, clearHoverTimers],
  );

  const scheduleHoverFromLookup = useCallback(
    (surface: string, el: HTMLElement) => {
      clearHoverTimers();
      if (popover !== null) return;
      if (!ayahRef || !text) return;
      showHoverTimerRef.current = setTimeout(() => {
        void (async () => {
          await ensureQuranWordCorpusLoaded();
          const hit = lookupCorpusForAyahWord({
            surah: ayahRef.surah,
            ayah: ayahRef.ayah,
            arabicLine: text,
            surface,
          });
          if (!hit) return;
          const bn = hit.entry.glossBn.trim();
          const en = hit.entry.glossEn.trim();
          setHoverTip({
            rect: el.getBoundingClientRect(),
            bn: bn || en || "—",
            enLine: bn && en ? en : "",
          });
        })();
      }, 120);
    },
    [ayahRef, text, popover, clearHoverTimers],
  );

  const endWordHover = useCallback(() => {
    if (showHoverTimerRef.current) {
      clearTimeout(showHoverTimerRef.current);
      showHoverTimerRef.current = null;
    }
    hideHoverTimerRef.current = setTimeout(() => setHoverTip(null), 60);
  }, []);

  const close = useCallback(() => setPopover(null), []);

  const nodes: ReactNode[] = [];
  let k = 0;

  if (renderArabicFromCorpus && arCorpusRow) {
    let offset = 0;
    for (let i = 0; i < arCorpusRow.length; i++) {
      const surface = arCorpusRow[i]![0];
      if (i > 0) {
        nodes.push(
          <span key={`ar-gap-${ayahRef!.surah}-${ayahRef!.ayah}-${i}`}>
            {" "}
          </span>,
        );
        offset += 1;
      }
      const wStart = offset;
      const wEnd = offset + surface.length;
      offset = wEnd;
      const hl = rangesOverlapWord(wStart, wEnd, mergedHL);
      const gloss = corpusRowGlosses(arCorpusRow[i]);
      const btn = (
        <button
          type="button"
          data-word-lookup
          className={wordBtnClass}
          title={gloss.bn || gloss.en || "অর্থ দেখুন"}
          onMouseEnter={(e) => {
            showHoverFromGloss(e.currentTarget, gloss);
          }}
          onMouseLeave={endWordHover}
          onClick={(e) => {
            clearHoverTimers();
            setHoverTip(null);
            void onWord(surface, e.currentTarget);
          }}
        >
          {surface}
        </button>
      );
      nodes.push(
        hl ? (
          <mark key={`ar-${k++}`} className={MARK_CLASS}>
            {btn}
          </mark>
        ) : (
          <span key={`ar-${k++}`}>{btn}</span>
        ),
      );
    }
  } else {
    for (const s of segs) {
      if (!s.isWordLike) {
        nodes.push(<span key={k++}>{s.segment}</span>);
        continue;
      }
      const wStart = s.index;
      const wEnd = s.index + s.segment.length;
      const hl = rangesOverlapWord(wStart, wEnd, mergedHL);
      const btn = (
        <button
          type="button"
          data-word-lookup
          className={wordBtnClass}
          title="অর্থ দেখুন"
          onMouseEnter={(e) => {
            if (lang === "ar" && ayahRef) {
              scheduleHoverFromLookup(s.segment, e.currentTarget);
            }
          }}
          onMouseLeave={lang === "ar" ? endWordHover : undefined}
          onClick={(e) => {
            clearHoverTimers();
            setHoverTip(null);
            void onWord(s.segment, e.currentTarget);
          }}
        >
          {s.segment}
        </button>
      );
      nodes.push(
        hl ? (
          <mark key={k++} className={MARK_CLASS}>
            {btn}
          </mark>
        ) : (
          <span key={k++}>{btn}</span>
        ),
      );
    }
  }

  return (
    <>
      {nodes}
      <HoverGlossTooltip tip={hoverTip} />
      <DictionaryPopover
        open={popover !== null}
        state={popover}
        onClose={close}
        titleId={titleId}
      />
    </>
  );
}
