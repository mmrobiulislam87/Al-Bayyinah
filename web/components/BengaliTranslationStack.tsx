"use client";

import { useEffect, useState } from "react";

import { ClickableAyahText } from "@/components/ClickableAyahText";
import type { AyahRecord } from "@/lib/types";
import { getBengaliSource } from "@/lib/bengaliTranslationCatalog";

const bnTextCache = new Map<string, string>();

type Props = {
  r: AyahRecord;
  /** দেখানো ধাপের id ক্রম */
  visibleSourceIds: string[];
  primaryId: string;
  onHideSource: (id: string) => void;
  /** সার্চ হাইলাইট — শুধু লোকাল (`প্রকল্প`) পাঠে */
  bengaliHighlightRanges?: [number, number][];
};

function RemoteBnLine({
  surah,
  ayah,
  sourceId,
}: {
  surah: number;
  ayah: number;
  sourceId: string;
}) {
  const [text, setText] = useState(() => {
    const k = `${surah}:${ayah}:${sourceId}`;
    return bnTextCache.get(k) ?? "";
  });
  const [loading, setLoading] = useState(!bnTextCache.has(`${surah}:${ayah}:${sourceId}`));
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const k = `${surah}:${ayah}:${sourceId}`;
    if (bnTextCache.has(k)) {
      setText(bnTextCache.get(k)!);
      setLoading(false);
      setErr(null);
      return;
    }
    let c = false;
    setLoading(true);
    setErr(null);
    setText("");
    fetch(
      `/api/quran/bn-translation?surah=${surah}&ayah=${ayah}&key=${encodeURIComponent(sourceId)}`,
    )
      .then(async (res) => {
        const j = (await res.json()) as { text?: string; error?: string };
        if (!res.ok) throw new Error(j.error ?? "request");
        return typeof j.text === "string" ? j.text : "";
      })
      .then((t) => {
        if (c) return;
        bnTextCache.set(k, t);
        setText(t);
      })
      .catch(() => {
        if (!c) setErr("অনুবাদ লোড হয়নি।");
      })
      .finally(() => {
        if (!c) setLoading(false);
      });
    return () => {
      c = true;
    };
  }, [surah, ayah, sourceId]);

  if (err) {
    return (
      <p className="text-sm text-red-700 dark:text-red-400" role="status">
        {err}
      </p>
    );
  }
  if (loading && !text) {
    return (
      <p className="text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400/80">
        লোড হচ্ছে…
      </p>
    );
  }
  return (
    <ClickableAyahText text={text} lang="bn" ayahRef={{ surah, ayah }} />
  );
}

/**
 * একাধিক বাংলা অনুবাদ — ভাঁজ সেগমেন্ট, মাইনাসে লুকোনো।
 */
export function BengaliTranslationStack({
  r,
  visibleSourceIds,
  primaryId,
  onHideSource,
  bengaliHighlightRanges,
}: Props) {
  return (
    <div className="space-y-3">
      {visibleSourceIds.map((sid) => {
        const meta = getBengaliSource(sid);
        if (!meta) return null;
        const isPrimary = sid === primaryId;
        const canHide = visibleSourceIds.length > 1;

        return (
          <section
            key={sid}
            className="overflow-hidden rounded-xl border border-[var(--islamic-teal)]/14 bg-[var(--islamic-parchment)]/35 shadow-sm ring-1 ring-[var(--islamic-gold)]/8 dark:border-teal-800/45 dark:bg-teal-950/35 dark:ring-amber-900/10"
            aria-label={`বাংলা — ${meta.labelBn}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--islamic-teal)]/10 px-3 py-2 dark:border-teal-800/45">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200 sm:text-sm">
                  {meta.labelBn}
                </span>
                {isPrimary ? (
                  <span className="rounded-full bg-[var(--islamic-gold)]/20 px-2 py-0.5 font-[family-name:var(--font-bn)] text-[0.65rem] font-medium text-[var(--islamic-teal-deep)] dark:bg-amber-900/45 dark:text-amber-100">
                    ডিফল্ট
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                disabled={!canHide}
                title={canHide ? "এই অনুবাদ স্তর লুকান" : "কমপক্ষে একটি স্তর থাকবে"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (canHide) onHideSource(sid);
                }}
                className="inline-flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[var(--islamic-teal)]/22 bg-white/80 text-lg font-bold leading-none text-[var(--islamic-teal-deep)] transition-colors hover:border-red-400/50 hover:bg-red-50/90 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-35 dark:border-teal-700/50 dark:bg-teal-900/60 dark:text-teal-100 dark:hover:border-red-500/40 dark:hover:bg-red-950/50 dark:hover:text-red-300"
              >
                −
              </button>
            </div>
            <div
              className="font-[family-name:var(--font-bn)] px-3 py-3 text-base leading-relaxed text-[var(--islamic-ink)] dark:text-teal-100/95 sm:text-lg sm:leading-[1.72]"
              role="paragraph"
            >
              {meta.kind === "local" ? (
                <ClickableAyahText
                  text={r.bengaliTranslation}
                  lang="bn"
                  ayahRef={{ surah: r.surah, ayah: r.ayah }}
                  highlightRanges={bengaliHighlightRanges ?? []}
                />
              ) : (
                <RemoteBnLine surah={r.surah} ayah={r.ayah} sourceId={sid} />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
