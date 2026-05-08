"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { toBengaliDigits } from "@/lib/numberBn";

type Hit = {
  surah: number;
  ayah: number;
  previewBn: string;
  previewEn: string;
};

export default function LabPanelMeaningSearch() {
  const [q, setQ] = useState("human creation stages");
  const [mode, setMode] = useState<"partial" | "exact">("partial");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hits, setHits] = useState<Hit[]>([]);

  const run = useCallback(async () => {
    const t = q.trim();
    if (!t) {
      setHits([]);
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const u = new URL("/api/research/meaning-search", window.location.origin);
      u.searchParams.set("q", t);
      u.searchParams.set("mode", mode);
      u.searchParams.set("limit", "100");
      const res = await fetch(u.toString());
      if (!res.ok) throw new Error(String(res.status));
      const j = (await res.json()) as {
        hits?: Hit[];
        hintBn?: string;
        error?: string;
      };
      if (j.error) throw new Error(j.error);
      setHits(Array.isArray(j.hits) ? j.hits : []);
      setHint(typeof j.hintBn === "string" ? j.hintBn : null);
    } catch {
      setErr("অনুসন্ধান ব্যর্থ। আবার চেষ্টা করুন।");
      setHits([]);
    } finally {
      setBusy(false);
    }
  }, [q, mode]);

  return (
    <section className="mb-6 rounded-lg border border-[var(--islamic-teal)]/20 bg-[var(--islamic-teal)]/6 p-4 dark:border-teal-800/40 dark:bg-teal-900/28">
      <h3 className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
        অর্থ-সহায়ক অনুসন্ধান (অনুবাদ স্তর)
      </h3>
      <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/88">
        ইংরেজি বা বাংলা টোকেন দিলে `_searchText` ব্লবে মিল — ভেক্টর/pgvector এর
        পূর্ববর্তী ব্যবহারিক ধাপ; বিশুদ্ধ সিমান্টিক সার্চ পরে যোগ হবে।
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-h-11 flex-1 rounded-lg border border-[var(--islamic-teal)]/25 bg-white px-3 py-2 font-[family-name:var(--font-bn)] text-sm outline-none dark:border-teal-700/50 dark:bg-teal-950/70 dark:text-teal-50"
          placeholder="Stages of creation, water, patience…"
        />
        <div className="flex flex-wrap gap-2">
          <label className="font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
            <select
              value={mode}
              onChange={(e) =>
                setMode(e.target.value === "exact" ? "exact" : "partial")
              }
              className="ml-1 rounded border border-[var(--islamic-teal)]/30 bg-white px-2 py-1 dark:border-teal-700/50 dark:bg-teal-950/80 dark:text-teal-100"
            >
              <option value="partial">আংশিক</option>
              <option value="exact">টোকেন-সম্পূর্ণ মিল</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void run()}
            disabled={busy}
            className="rounded-lg bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-white disabled:opacity-60 dark:bg-teal-800"
          >
            {busy ? "খোঁজ…" : "খুঁজুন"}
          </button>
        </div>
      </div>
      {err ? (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{err}</p>
      ) : null}
      {hint ? (
        <p className="mt-2 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
          {hint}
        </p>
      ) : null}
      {hits.length > 0 ? (
        <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
          {hits.map((h) => (
            <li
              key={`${h.surah}:${h.ayah}`}
              className="rounded-md border border-[var(--islamic-teal)]/12 bg-white/90 p-2 text-sm dark:border-teal-800/35 dark:bg-teal-950/55"
            >
              <Link
                href={`/surah/${h.surah}#ayah-${h.ayah}`}
                className="font-[family-name:var(--font-bn)] font-semibold text-[var(--islamic-teal-deep)] underline-offset-2 hover:underline dark:text-amber-200"
              >
                {toBengaliDigits(h.surah)}:{toBengaliDigits(h.ayah)}
              </Link>
              <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink)] dark:text-teal-100/90">
                {h.previewBn || h.previewEn}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
