import { getSurahMeta } from "@/lib/surahs";

/** ইন-টেক্সট উদ্ধৃতি — সংক্ষিপ্ত APA-সদৃশ (পূর্ণ APA গ্রন্থে প্রকাশক/সংস্করণ যোগ করুন)। */
export function citeQuranApaParenthetical(surah: number, ayah: number): string {
  const sm = getSurahMeta(surah);
  const surahBit = sm ? `${sm.nameEn} ${surah}` : `${surah}`;
  return `(Qur'an ${surahBit}:${ayah})`;
}

/** সংক্ষিপ্ত MLA-সদৃশ ইন-টেক্সট। */
export function citeQuranMlaParenthetical(surah: number, ayah: number): string {
  const sm = getSurahMeta(surah);
  const name = sm?.nameEn ?? `Surah ${surah}`;
  return `(Qur'an ${name} ${surah}:${ayah})`;
}

export function citeQuranBibliographyApaLine(
  surah: number,
  ayah: number,
): string {
  const sm = getSurahMeta(surah);
  const en = sm?.nameEn ?? `Surah ${surah}`;
  const bn = sm?.nameBn ?? "";
  return `The Qur'an, ${en} (${bn}) ${surah}:${ayah}. Uthmani text — cite manuscript/edition used in your paper.`;
}

export function citeQuranBibliographyMlaLine(
  surah: number,
  ayah: number,
): string {
  const sm = getSurahMeta(surah);
  const en = sm?.nameEn ?? `Surah ${surah}`;
  return `The Holy Qur'an, ${en}, surah ${surah}, ayah ${ayah}. Trans. per your edition.`;
}
