"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { BookmarkEntry } from "@/lib/bookmarks";
import { getBookmarks, removeBookmark } from "@/lib/bookmarks";
import { formatAyahHash } from "@/lib/juz";
import { toBengaliDigits } from "@/lib/numberBn";
import { getSurahMeta } from "@/lib/surahs";

function formatTime(ts: number): string {
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export default function BookmarksClient() {
  const [list, setList] = useState<BookmarkEntry[]>([]);

  const refresh = useCallback(() => {
    setList(getBookmarks());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <h1 className="mb-2 font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
        বুকমার্ক
      </h1>
      <p className="mb-6 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
        এই ডিভাইসের ব্রাউজারে সংরক্ষিত (লোকাল স্টোরেজ)।
      </p>
      {list.length === 0 ? (
        <p className="text-[var(--islamic-ink-soft)] dark:text-teal-300/80">
          এখনও কোনো বুকমার্ক নেই। সূরা পাঠ বা অনুসন্ধানে আয়াতের পাশে{" "}
          <strong className="text-[var(--islamic-teal)] dark:text-teal-300">
            বুকমার্ক
          </strong>{" "}
          চাপুন।
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((b) => {
            const sm = getSurahMeta(b.surah);
            const hash = formatAyahHash(b.ayah);
            return (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--islamic-teal)]/15 bg-white/90 px-4 py-3 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/55"
              >
                <div className="min-w-0 font-[family-name:var(--font-bn)]">
                  <Link
                    href={`/surah/${b.surah}#${hash}`}
                    className="font-medium text-[var(--islamic-teal-deep)] underline decoration-[var(--islamic-gold)]/45 underline-offset-4 hover:text-[var(--islamic-teal)] dark:text-teal-100 dark:hover:text-amber-200"
                  >
                    {sm?.nameBn ?? `সূরা ${toBengaliDigits(b.surah)}`} — আয়াত{" "}
                    {toBengaliDigits(b.ayah)}
                  </Link>
                  <p className="mt-1 text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/80">
                    {formatTime(b.at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeBookmark(b.id);
                    refresh();
                  }}
                  className="shrink-0 rounded-lg border border-red-200/90 bg-red-50 px-3 py-1.5 text-xs font-[family-name:var(--font-bn)] text-red-800 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/70"
                >
                  মুছুন
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-8">
        <Link
          href="/"
          className="text-sm font-[family-name:var(--font-bn)] text-[var(--islamic-teal)] underline dark:text-teal-300"
        >
          ← হোম
        </Link>
      </p>
    </div>
  );
}
