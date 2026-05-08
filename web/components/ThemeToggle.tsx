"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE = "al-bayyinah-theme";

function applyDark(on: boolean) {
  document.documentElement.classList.toggle("dark", on);
}

/**
 * সিস্টেম / লোকাল স্টোরেজ — রাতের মোড।
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE);
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const on =
      stored === "dark" ? true : stored === "light" ? false : prefersDark;
    setDark(on);
    applyDark(on);
  }, []);

  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem(STORAGE, next ? "dark" : "light");
      applyDark(next);
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <span className="inline-flex h-9 w-14 shrink-0 rounded-lg bg-teal-900/40" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-white/25 bg-teal-900/35 px-3 py-1.5 text-xs font-[family-name:var(--font-bn)] text-teal-50 transition-colors hover:bg-teal-900/55 hover:border-[var(--islamic-gold)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--islamic-gold)]/60"
      aria-pressed={dark}
      title={dark ? "দিনের মোড" : "রাতের মোড"}
    >
      {dark ? "☀ দিন" : "🌙 রাত"}
    </button>
  );
}
