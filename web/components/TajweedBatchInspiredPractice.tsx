"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  primeSpeechSynthVoices,
  speakArabicSurface,
} from "@/lib/hijaiLetterSpeech";
import { canUseSpeechSynth, speakBanglaPhraseAsync } from "@/lib/speechBnUtter";

type GlyphRow = {
  id: string;
  titleBn: string;
  subtitleBn: string;
  glyphs: readonly { ar: string; explainBn: string }[];
};

const HARAKAT_BA: GlyphRow = {
  id: "harakat",
  titleBn: "২য় খণ্ড — হরকত (৩টি আওয়াজ)",
  subtitleBn:
    "বেশিরভাগ টেবিলের মতোই তিনটি টান থাকে — বাটন টিপে পরীক্ষামূলক আরবি টিএসটি চালান অথবা ব্যাখ্যাটা পরুন ।",
  glyphs: [
    { ar: "بَ", explainBn: "ফাতহা / জবর — অক্ষরের উপর খোলা টান" },
    { ar: "بِ", explainBn: "কাসরা / যের — অক্ষরের নিচের টান" },
    { ar: "بُ", explainBn: "ডাম্মা / পেশ — অক্ষরের ওপর বেঁকে থাকা এক টান" },
  ],
};

const TANWEEN_BA: GlyphRow = {
  id: "tanween",
  titleBn: "৩য় খণ্ড — তানউইন (৩টি রূপ)",
  subtitleBn:
    "এক সাধারণ হরফে দুটি সঙ্কেত যুক্ত — পাঠস্থানে সাধারণত এই তিন খানা দেখাই । ওস্তাদের সাথে সঠিক মাখরাজ মিলাবেন ।",
  glyphs: [
    { ar: "بًا", explainBn: "তানউইনে ফাতহা (−য়ান)" },
    { ar: "بٍ", explainBn: "তানউইনে কাসরা (−য়িন)" },
    { ar: "بٌ", explainBn: "তানউইনে ডাম্মা (−য়ুন)" },
  ],
};

const SECTIONS = [HARAKAT_BA, TANWEEN_BA] as const;

export default function TajweedBatchInspiredPractice() {
  const [active, setActive] = useState<string>(SECTIONS[0]!.id);
  const synthOk =
    typeof window !== "undefined" ? canUseSpeechSynth() : true;

  useEffect(() => {
    primeSpeechSynthVoices();
  }, []);

  const row = useMemo(
    () => SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]!,
    [active],
  );

  const onTapGlyph = useCallback(async (ar: string, explainBn: string) => {
    const ok = await speakArabicSurface(ar);
    if (!ok && explainBn.trim()) await speakBanglaPhraseAsync(explainBn);
  }, []);

  return (
    <div className="mt-8 rounded-xl border border-[var(--islamic-teal)]/12 bg-[var(--islamic-parchment)]/35 p-4 dark:border-teal-800/38 dark:bg-teal-950/40">
      <h3 className="font-[family-name:var(--font-bn)] text-base font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
        পিডিএফ অনুপ্রাণিত — ২য় ও ৩য় খণ্ড (হরকত ও তানউইন)
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/92">
        উপরের বর্ণতালিকা “১ম” অংশ; এখানে খাতার দ্বিতীয় ও তৃতীয় খণ্ডের অনুরূপ করে ব এর ওপর হরকত ও তানউইন টিপে শুনুন বা বর্ণ দেখুন । যুক্ত আকার খেলুন:{" "}
        <Link
          href="/learn/games/ligatures"
          className="font-semibold text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-300"
        >
          যুক্ত বর্ণ খেলার পেজ
        </Link>
        ।
      </p>

      {!synthOk ? (
        <p
          role="status"
          className="mt-3 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 font-[family-name:var(--font-bn)] text-xs text-amber-950 dark:text-amber-200/95"
        >
          এই ব্রাউজারে টিএসটি নেই — নীচের বর্ণগুলোয় চোখ ও বাংলা ব্যাখ্যায় চর্চা চালান ।
        </p>
      ) : null}

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="হরকত বা তানউইন"
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active === s.id}
            onClick={() => setActive(s.id)}
            className={`rounded-lg border px-3 py-2 font-[family-name:var(--font-bn)] text-xs font-semibold transition ${
              active === s.id
                ? "border-[var(--islamic-gold)]/60 bg-[var(--islamic-gold)]/25 text-[var(--islamic-teal-deep)] dark:border-amber-500/55 dark:bg-amber-900/35 dark:text-amber-50"
                : "border-[var(--islamic-teal)]/22 bg-white/85 text-[var(--islamic-teal-deep)] hover:border-[var(--islamic-teal)]/45 dark:border-teal-800/55 dark:bg-teal-950/55 dark:text-teal-100"
            }`}
          >
            {s.id === "harakat" ? (
              <>
                হরকত{" "}
                <span dir="rtl" className="[font-family:var(--font-quran-ar)]">
                  {"(بَ بِ بُ)"}
                </span>
              </>
            ) : (
              <>
                তানউইন{" "}
                <span dir="rtl" className="[font-family:var(--font-quran-ar)]">
                  {"(بًا بٍ بٌ)"}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-4 space-y-2">
        <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
          {row.titleBn}
        </p>
        <p className="text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-400/92">
          {row.subtitleBn}
        </p>
        <div dir="rtl" className="grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
          {row.glyphs.map((g) => (
            <button
              key={g.ar}
              type="button"
              onClick={() => void onTapGlyph(g.ar, g.explainBn)}
              title={g.explainBn}
              aria-label={`${g.ar} শুনুন — ${g.explainBn}`}
              className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-[var(--islamic-gold)]/40 bg-white/92 px-1 py-2 text-center shadow-sm transition hover:border-[var(--islamic-teal)]/50 dark:border-amber-700/55 dark:bg-teal-900/72 dark:hover:border-teal-500/45"
            >
              <span className="[font-family:var(--font-quran-ar)] text-3xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-50">
                {g.ar}
              </span>
              <span className="mt-1 px-1 font-[family-name:var(--font-bn)] text-[9px] leading-snug text-[var(--islamic-ink-soft)] dark:text-teal-300/95">
                {g.explainBn}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
