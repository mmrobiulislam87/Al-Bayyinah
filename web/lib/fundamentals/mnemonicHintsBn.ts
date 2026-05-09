/** ফর্ম সংকেত (মেমোনিক) — সংক্ষেপ বাংলা; পূর্ণ ব্যাখ্যা `wordBn`-এ থাকবে। */

export const SHAPE_HINT_BN: Record<string, string> = {
  ب: "নৌকার ডেকের মতো দুটি বাঁক",
  ج: "আকারে হুক বা খাঁড়ার মতো বাঁক",
  و: "তরঙ বা খাঁজের লাইন",
  ح: "মুখ খোলা বৃত্তের খানিকটা",
  د: "সোজা ড্যাশের মতো সহজ এক আকৃতি",
  ر: "নিচে এক টুকরো খুচরো বাঁক",
};

export function mnemonicLineBn(letter: string, fallbackEmojiLine: string): string {
  return SHAPE_HINT_BN[letter] ?? fallbackEmojiLine;
}
