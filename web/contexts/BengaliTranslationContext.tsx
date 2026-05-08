"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BENGALI_TRANSLATION_SOURCES,
  DEFAULT_BENGALI_PRIMARY_ID,
  DEFAULT_BENGALI_VISIBLE_IDS,
} from "@/lib/bengaliTranslationCatalog";
import {
  readBengaliPrimaryId,
  readBengaliVisibleIds,
  writeBengaliPrimaryId,
  writeBengaliVisibleIds,
} from "@/lib/bengaliTranslationPrefs";

export type BengaliTranslationContextValue = {
  primaryId: string;
  setPrimaryId: (id: string) => void;
  /** স্তম্ভের ক্রম */
  visibleIds: string[];
  addVisible: (id: string) => void;
  removeVisible: (id: string) => void;
  hydrated: boolean;
  /** অনুবাদ যোগ পপআপ */
  isAddTranslationModalOpen: boolean;
  openAddTranslationModal: () => void;
  closeAddTranslationModal: () => void;
};

const BengaliTranslationContext =
  createContext<BengaliTranslationContextValue | null>(null);

export function BengaliTranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [primaryId, setPrimaryIdState] = useState<string>(
    DEFAULT_BENGALI_PRIMARY_ID,
  );
  const [visibleIds, setVisibleIdsState] = useState<string[]>(() => [
    ...DEFAULT_BENGALI_VISIBLE_IDS,
  ]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    setPrimaryIdState(readBengaliPrimaryId());
    setVisibleIdsState(readBengaliVisibleIds());
    setHydrated(true);
  }, []);

  const setPrimaryId = useCallback((id: string) => {
    const ok = BENGALI_TRANSLATION_SOURCES.some((s) => s.id === id);
    if (!ok) return;
    setPrimaryIdState(id);
    writeBengaliPrimaryId(id);
    setVisibleIdsState((prev) => {
      const next = prev.includes(id) ? prev : [id, ...prev.filter((x) => x !== id)];
      const reordered = [
        id,
        ...next.filter((x) => x !== id),
      ];
      writeBengaliVisibleIds(reordered);
      return reordered;
    });
  }, []);

  const addVisible = useCallback((id: string) => {
    const ok = BENGALI_TRANSLATION_SOURCES.some((s) => s.id === id);
    if (!ok) return;
    setVisibleIdsState((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeBengaliVisibleIds(next);
      return next;
    });
  }, []);

  const removeVisible = useCallback((id: string) => {
    setVisibleIdsState((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((x) => x !== id);
      writeBengaliVisibleIds(next);
      return next;
    });
  }, []);

  const openAddTranslationModal = useCallback(() => setAddModalOpen(true), []);
  const closeAddTranslationModal = useCallback(() => setAddModalOpen(false), []);

  const value = useMemo(
    () =>
      ({
        primaryId,
        setPrimaryId,
        visibleIds,
        addVisible,
        removeVisible,
        hydrated,
        isAddTranslationModalOpen: addModalOpen,
        openAddTranslationModal,
        closeAddTranslationModal,
      }) satisfies BengaliTranslationContextValue,
    [
      primaryId,
      setPrimaryId,
      visibleIds,
      addVisible,
      removeVisible,
      hydrated,
      addModalOpen,
      openAddTranslationModal,
      closeAddTranslationModal,
    ],
  );

  return (
    <BengaliTranslationContext.Provider value={value}>
      {children}
    </BengaliTranslationContext.Provider>
  );
}

export function useBengaliTranslationPrefs(): BengaliTranslationContextValue {
  const ctx = useContext(BengaliTranslationContext);
  if (!ctx) {
    throw new Error("useBengaliTranslationPrefs must be used within provider");
  }
  return ctx;
}

export function useOptionalBengaliTranslationPrefs(): BengaliTranslationContextValue | null {
  return useContext(BengaliTranslationContext);
}
