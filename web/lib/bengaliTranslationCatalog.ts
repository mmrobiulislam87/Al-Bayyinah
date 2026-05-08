/**
 * অতিরিক্ত বাংলা অনুবাদ — Quran.com অনুমোদিত সংস্থান থেকে (resource_id)।
 * @see https://api.quran.com/api/v4/resources/translations
 */

export type BengaliTranslationSource = {
  id: string;
  /** UI তে দেখানো নাম */
  labelBn: string;
  kind: "local" | "quran_com";
  /** Quran.com translations resource id */
  quranComResourceId?: number;
};

/** মোট ৫: ১ লোকাল + ৪ রিমোট (প্রত্যেক আলাদা অনুবাদক/প্রকাশনা)। */
export const BENGALI_TRANSLATION_SOURCES: BengaliTranslationSource[] = [
  {
    id: "local",
    labelBn: "প্রকল্প পাঠ (রিসান/ডিফল্ট)",
    kind: "local",
  },
  {
    id: "qc_zakaria",
    labelBn: "ড. আবু বকর মুহাম্মাদ জাকারিয়া",
    kind: "quran_com",
    quranComResourceId: 213,
  },
  {
    id: "qc_taisirul",
    labelBn: "তাইসীরুল কুরআন",
    kind: "quran_com",
    quranComResourceId: 161,
  },
  {
    id: "qc_mujib",
    labelBn: "শেখ মুজিবুর রহমান (দারুসসালাম)",
    kind: "quran_com",
    quranComResourceId: 163,
  },
  {
    id: "qc_rawai",
    labelBn: "রাওয়াই আল-বয়ান",
    kind: "quran_com",
    quranComResourceId: 162,
  },
];

const byId = new Map(
  BENGALI_TRANSLATION_SOURCES.map((s) => [s.id, s] as const),
);

export function getBengaliSource(id: string): BengaliTranslationSource | undefined {
  return byId.get(id);
}

export const DEFAULT_BENGALI_PRIMARY_ID = "local" as const;

/** প্রথম লোডে শুধু ডিফল্ট পাঠ দেখানো — বাকিগুলো ব্যবহারকারী যোগ করবে। */
export const DEFAULT_BENGALI_VISIBLE_IDS: string[] = [DEFAULT_BENGALI_PRIMARY_ID];
