"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BENGALI_TRANSLATION_SOURCES } from "@/lib/bengaliTranslationCatalog";
import { useBengaliTranslationPrefs } from "@/contexts/BengaliTranslationContext";

/**
 * বাংলা অনুবাদ পপআপ — ডিফল্ট বাছাই ও নতুন স্তর যোগ।
 */
export default function BengaliAddTranslationDialog() {
  const {
    primaryId,
    setPrimaryId,
    isAddTranslationModalOpen,
    closeAddTranslationModal,
    addVisible,
    visibleIds,
    hydrated,
  } = useBengaliTranslationPrefs();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openAnimKey, setOpenAnimKey] = useState(0);

  const addable = useMemo(
    () =>
      BENGALI_TRANSLATION_SOURCES.filter((s) => !visibleIds.includes(s.id)),
    [visibleIds],
  );

  useEffect(() => {
    const el = dialogRef.current;
    if (!el || !hydrated) return;
    if (isAddTranslationModalOpen) {
      if (!el.open) {
        setOpenAnimKey((k) => k + 1);
        el.showModal();
      }
    } else if (el.open) {
      el.close();
    }
  }, [isAddTranslationModalOpen, hydrated]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onClose = () => closeAddTranslationModal();
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [closeAddTranslationModal]);

  if (!hydrated) return null;

  return (
    <dialog
      ref={dialogRef}
      className="bn-add-dialog fixed inset-0 z-[100] m-auto h-fit w-[min(26rem,calc(100vw-1.5rem))] max-h-[min(40rem,90vh)] overflow-hidden rounded-2xl border border-[var(--islamic-teal)]/20 bg-[var(--islamic-parchment)] p-0 text-[var(--islamic-ink)] shadow-2xl shadow-black/25 ring-2 ring-[var(--islamic-gold)]/20 [&::backdrop]:bg-black/50 dark:border-teal-700/50 dark:bg-teal-950 dark:text-teal-50 dark:ring-amber-900/30 dark:[&::backdrop]:bg-black/70"
      onClick={(e) => {
        if (e.target === dialogRef.current) closeAddTranslationModal();
      }}
    >
      <div
        key={openAnimKey}
        className="bn-add-dialog-panel flex max-h-[min(40rem,90vh)] flex-col"
      >
        <div className="border-b border-[var(--islamic-teal)]/12 bg-white/90 px-4 py-3 dark:border-teal-800/45 dark:bg-teal-900/60">
          <h2 className="font-[family-name:var(--font-bn)] text-base font-bold text-[var(--islamic-teal-deep)] dark:text-teal-100">
            বাংলা অনুবাদ
          </h2>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-[family-name:var(--font-bn)] text-[0.65rem] font-medium uppercase tracking-wide text-[var(--islamic-teal)]/85 dark:text-teal-400">
              ডিফল্ট (প্রাথমিক)
            </span>
            <select
              value={primaryId}
              onChange={(e) => setPrimaryId(e.target.value)}
              className="min-h-11 w-full touch-manipulation rounded-lg border border-[var(--islamic-teal)]/22 bg-white/95 px-3 py-2.5 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink)] outline-none focus:border-[var(--islamic-gold)]/55 focus:ring-2 focus:ring-[var(--islamic-gold)]/22 dark:border-teal-700/50 dark:bg-teal-900/55 dark:text-teal-50"
            >
              {BENGALI_TRANSLATION_SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.labelBn}
                </option>
              ))}
            </select>
          </label>

          <div className="border-t border-[var(--islamic-teal)]/12 pt-4 dark:border-teal-800/45">
            <p className="mb-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
              আরও অনুবাদ স্তর
            </p>
            {addable.length === 0 ? (
              <p className="px-1 text-center font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
                সব অনুবাদ স্তর ইতিমধ্যে খোলা আছে।
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {addable.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        addVisible(s.id);
                        closeAddTranslationModal();
                      }}
                      className="w-full touch-manipulation rounded-xl border border-[var(--islamic-teal)]/16 bg-white/90 px-4 py-3 text-start font-[family-name:var(--font-bn)] text-sm font-medium leading-snug text-[var(--islamic-teal-deep)] shadow-sm transition-colors hover:border-[var(--islamic-gold)]/45 hover:bg-[#4a9d9d]/10 dark:border-teal-700/40 dark:bg-teal-900/40 dark:text-teal-50 dark:hover:border-amber-500/35 dark:hover:bg-teal-800/45"
                    >
                      <span
                        className="me-2 text-[var(--islamic-gold)]"
                        aria-hidden
                      >
                        ＋
                      </span>
                      {s.labelBn}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="border-t border-[var(--islamic-teal)]/12 bg-white/85 px-3 py-3 dark:border-teal-800/45 dark:bg-teal-950/80">
          <button
            type="button"
            onClick={() => closeAddTranslationModal()}
            className="min-h-11 w-full touch-manipulation rounded-xl border border-[var(--islamic-teal)]/22 bg-[var(--islamic-parchment)]/90 px-4 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] hover:bg-white dark:border-teal-700/50 dark:bg-teal-900/50 dark:text-teal-100"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </dialog>
  );
}
