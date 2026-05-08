/**
 * সূরার প্রকাশস্থল — জনপ্রিয় শিক্ষাগত শ্রেণিবিন্যাস (মক্কী / মাদানী)।
 * নির্দিষ্ট সূরা নিয়ে মতভেদ থাকতে পারে; এখানে বেশিরভাগ তফসীর সূত্রের সাথে সামঞ্জস্যপূর্ণ একটি তালিকা।
 */

export type RevelationPlace = "makki" | "madani";

/** হিজরত পরবর্তী নাগাদ প্রধানত মাদানী হিসেবে গণিত সূরা নম্বরসমূহ। */
const MADANI_SURAH_NUMBERS = new Set<number>([
  2, 3, 4, 5, 8, 9, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65,
  66, 76, 98, 99, 110,
]);

export function getSurahRevelation(surahNumber: number): RevelationPlace {
  if (surahNumber < 1 || surahNumber > 114) return "makki";
  return MADANI_SURAH_NUMBERS.has(surahNumber) ? "madani" : "makki";
}

export function revelationLabelBn(place: RevelationPlace): string {
  return place === "makki" ? "মক্কী" : "মাদানী";
}
