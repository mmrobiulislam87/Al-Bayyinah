/**
 * হিজাই হরফের আনুষ্ঠানিক আরবি নাম (تَشْكِيل সহ) —
 * ডিভাইসের আরবি টিএস টি ভয়েস ব্যবহার করে উচ্চারণ ।
 */

import { speakBanglaPhraseAsync, canUseSpeechSynth } from "@/lib/speechBnUtter";

/** আনুষ্ঠানিক হরফনাম লিখিত আরবি । */
export const HIJAI_FORMAL_NAME_AR: Record<string, string> = {
  أ: "أَلِف",
  ب: "بَاء",
  ت: "تَاء",
  ث: "ثَاء",
  ج: "جِيم",
  ح: "حَاء",
  خ: "خَاء",
  د: "دَال",
  ذ: "ذَال",
  ر: "رَاء",
  ز: "زَاي",
  س: "سِين",
  ش: "شِين",
  ص: "صَاد",
  ض: "ضَاد",
  ط: "طَاء",
  ظ: "ظَاء",
  ع: "عَيْن",
  غ: "غَيْن",
  ف: "فَاء",
  ق: "قَاف",
  ك: "كَاف",
  ل: "لَام",
  م: "مِيم",
  ن: "نُون",
  ه: "هَاء",
  و: "وَاو",
  ي: "يَاء",
  ء: "هَمْزَة",
};

function pickArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const list = window.speechSynthesis.getVoices();
  return (
    list.find((v) => /^(ar-SA|ar-AE|ar-EG)/i.test(v.lang)) ??
    list.find((v) => v.lang.startsWith("ar")) ??
    null
  );
}

/** আরবি ভয়েস দিয়ে আনুষ্ঠানিক নাম। সফেল হয়নি মনে করলে false। */
export function speakHijaiFormalArabic(letter: string): Promise<boolean> {
  const phrase = HIJAI_FORMAL_NAME_AR[letter];
  if (!phrase?.trim()) return Promise.resolve(false);
  return new Promise((resolve) => {
    if (!canUseSpeechSynth()) {
      resolve(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(phrase);
      ut.lang = "ar-SA";
      const arV = pickArabicVoice();
      if (arV) ut.voice = arV;
      ut.rate = 0.8;
      ut.pitch = 1;
      ut.onend = () => resolve(true);
      ut.onerror = () => resolve(false);
      window.speechSynthesis.speak(ut);
    } catch {
      resolve(false);
    }
  });
}

/** আরবি টেক্সট (যেমন হরকতসহ খণ্ড) আরবি ভয়েসে পড়ান। সফল হয়নি মনে করলে false। */
export function speakArabicSurface(text: string): Promise<boolean> {
  const phrase = text.trim();
  if (!phrase) return Promise.resolve(false);
  return new Promise((resolve) => {
    if (!canUseSpeechSynth()) {
      resolve(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(phrase);
      ut.lang = "ar-SA";
      const arV = pickArabicVoice();
      if (arV) ut.voice = arV;
      ut.rate = 0.82;
      ut.pitch = 1;
      ut.onend = () => resolve(true);
      ut.onerror = () => resolve(false);
      window.speechSynthesis.speak(ut);
    } catch {
      resolve(false);
    }
  });
}

/** আরবি টিএস টি; না হলে বাংলা নাম । */
export async function pronounceHijaiLetter(
  letter: string,
  nameBnFallback: string | undefined,
): Promise<void> {
  const okArabic = await speakHijaiFormalArabic(letter);
  if (okArabic) return;
  if (nameBnFallback?.trim())
    await speakBanglaPhraseAsync(`${nameBnFallback.trim()}`);
}

/** ডিভাইসের ভয়েস তালিকা দ্রুত লোডের জন্য getVoices() ডাক । */
export function primeSpeechSynthVoices(): void {
  if (typeof window === "undefined") return;
  window.speechSynthesis.getVoices();
}
