"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  deleteResearchLabNote,
  exportResearchNotesDelimited,
  isValidResearchVerseKey,
  listResearchLabNotes,
  upsertResearchLabNote,
} from "@/lib/researchWorkspaceLocal";
import { toBengaliDigits } from "@/lib/numberBn";

type Props = {
  /** URL `?v=সূরা:আয়াত` থেকে প্যারেন্ট পাস (গবেষক নোট দ্রুত লিঙ্ক)। */
  verseKeyFromUrl?: string | null;
};

export default function LabPanelWorkspace({ verseKeyFromUrl = null }: Props) {
  const [verseKey, setVerseKey] = useState("2:255");
  const [body, setBody] = useState("");
  const [tick, setTick] = useState(0);
  const [citationStyle, setCitationStyle] = useState<"apa" | "mla">("apa");

  useEffect(() => {
    const raw = verseKeyFromUrl?.trim() ?? "";
    if (!isValidResearchVerseKey(raw)) return;
    setVerseKey(raw);
    const existing = listResearchLabNotes().find((n) => n.verseKey === raw);
    setBody(existing?.body ?? "");
  }, [verseKeyFromUrl]);

  const notes = useMemo(() => {
    void tick;
    return listResearchLabNotes();
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const save = useCallback(() => {
    upsertResearchLabNote(verseKey, body);
    refresh();
  }, [verseKey, body, refresh]);

  const remove = useCallback(
    (key: string) => {
      deleteResearchLabNote(key);
      refresh();
    },
    [refresh],
  );

  const download = useCallback(() => {
    const text = exportResearchNotesDelimited(citationStyle);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `al-bayyinah-notes-${citationStyle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [citationStyle]);

  return (
    <section className="mb-6 space-y-4">
      <div className="rounded-lg border border-[var(--islamic-teal)]/20 bg-[var(--islamic-teal)]/6 p-4 dark:border-teal-800/40 dark:bg-teal-900/28">
        <h3 className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
          লোকাল নোট ও এক্সপোর্ট
        </h3>
        <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/88">
          ডাটা আপনার ব্রাউজারে সংরক্ষিত (localStorage)। সূরা পাতা থেকে «গবেষক
          নোট» চাপলে URL-এর{" "}
          <code className="rounded bg-black/8 px-1 font-mono text-[10px] dark:bg-white/12">
            ?v=সূরা:আয়াত
          </code>{" "}
          দিয়ে আয়াত ও সংরক্ষিত নোট (যদি থাকে) প্রিফিল হবে। চূড়ান্ত উদ্ধৃতি
          স্টাইল গাইড দিয়ে যাচাই করুন।
        </p>
      </div>

      <div className="rounded-lg border border-[var(--islamic-teal)]/15 bg-white/88 p-4 dark:border-teal-800/40 dark:bg-teal-950/50">
        <label className="block font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
          সূরা:আয়াত
          <input
            value={verseKey}
            onChange={(e) => setVerseKey(e.target.value.trim())}
            className="mt-1 w-full rounded-md border border-[var(--islamic-teal)]/25 bg-white px-2 py-2 font-mono text-sm dark:border-teal-700/50 dark:bg-teal-950/70 dark:text-teal-50"
            placeholder="2:255"
          />
        </label>
        <label className="mt-3 block font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
          নোট
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-[var(--islamic-teal)]/25 bg-white px-2 py-2 font-[family-name:var(--font-bn)] text-sm dark:border-teal-700/50 dark:bg-teal-950/70 dark:text-teal-50"
          />
        </label>
        <button
          type="button"
          onClick={save}
          className="mt-3 rounded-lg bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-white dark:bg-teal-800"
        >
          সংরক্ষণ / আপডেট
        </button>
      </div>

      <div className="rounded-lg border border-[var(--islamic-gold)]/25 bg-white/80 p-4 dark:border-amber-800/35 dark:bg-teal-950/45">
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink)] dark:text-teal-200">
            এক্সপোর্ট স্টাইল
            <select
              value={citationStyle}
              onChange={(e) =>
                setCitationStyle(e.target.value === "mla" ? "mla" : "apa")
              }
              className="ml-2 rounded border border-[var(--islamic-teal)]/30 bg-white px-2 py-1 dark:border-teal-700/50 dark:bg-teal-950/80 dark:text-teal-100"
            >
              <option value="apa">APA (সংক্ষিপ্ত টেমপ্লেট)</option>
              <option value="mla">MLA (সংগত)</option>
            </select>
          </label>
          <button
            type="button"
            onClick={download}
            disabled={notes.length === 0}
            className="rounded-lg border border-[var(--islamic-teal-deep)]/40 px-4 py-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal-deep)] disabled:opacity-50 dark:border-teal-500/50 dark:text-teal-200"
          >
            .txt ডাউনলোড
          </button>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
          সংরক্ষিত ({toBengaliDigits(notes.length)})
        </h4>
        {notes.length === 0 ? (
          <p className="font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
            এখনও নোট নেই।
          </p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {notes.map((n) => (
              <li
                key={n.verseKey}
                className="rounded-md border border-[var(--islamic-teal)]/12 bg-white/90 p-2 dark:border-teal-800/35 dark:bg-teal-950/55"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link
                    href={`/surah/${n.verseKey.split(":")[0]!}#ayah-${n.verseKey.split(":")[1]!}`}
                    className="font-mono text-sm font-semibold text-[var(--islamic-teal-deep)] underline-offset-2 hover:underline dark:text-amber-200"
                  >
                    {n.verseKey}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(n.verseKey)}
                    className="text-xs text-red-700 hover:underline dark:text-red-400"
                  >
                    মুছুন
                  </button>
                </div>
                <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink)] dark:text-teal-100/90">
                  {n.body || "—"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
