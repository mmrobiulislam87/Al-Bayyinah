/**
 * লার্ন ল্যাবে শব্দ — এখন Web Speech ভিত্তিক। ভবিষ্যতে Howler দিয়ে MP3 ফেলে দেওয়া সহজ হবে এই আইডিয়ার ওপর।
 */

import {
  speakHijaiFormalArabic,
  speakArabicSurface,
} from "@/lib/hijaiLetterSpeech";
import { speakBanglaPhraseAsync } from "@/lib/speechBnUtter";
import type { AlphabetPair } from "@/lib/learnAlphabetSets";
import { letterNameBn } from "@/lib/learnAlphabetSets";

export type LetterSoundKind = "formal_ar" | "arabic_example" | "bn_name";

export async function playLetterSound(opts: {
  pair: AlphabetPair;
  kind: LetterSoundKind;
}): Promise<void> {
  const { pair, kind } = opts;
  if (kind === "formal_ar") {
    const ok = await speakHijaiFormalArabic(pair.letter);
    if (!ok) {
      await speakBnForLetter(pair);
    }
    return;
  }
  if (kind === "arabic_example") {
    const ok = await speakArabicSurface(pair.arabicWord);
    if (!ok) await speakBnForLetter(pair);
    return;
  }
  await speakBnForLetter(pair);
}

async function speakBnForLetter(pair: AlphabetPair): Promise<void> {
  const line =
    pair.nameBn ?? letterNameBn(pair.letter) ?? `${pair.emoji} হরফ`;
  await speakBanglaPhraseAsync(`${line}। সংক্ষেপে, ${pair.wordBn.slice(0, 80)}`);
}
