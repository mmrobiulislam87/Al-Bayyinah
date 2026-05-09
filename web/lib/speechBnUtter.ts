/**
 * ব্রাউজার Web Speech সিন্থ — বাংলায় হরফের নাম বা ছোট বাক্য শোনানো।
 * এনভায়র্নমেন্ট/ব্রাউজার অনুযায়ী উপলব্ধতা ও গুণ ভিন্ন হতে পারে (`/tutor` একই ধারা)।
 */
export function canUseSpeechSynth(): boolean {
  return typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";
}

/** সাফেল হলে সত্যীকৃত */
export function speakBanglaPhrase(text: string): boolean {
  if (!canUseSpeechSynth() || !text.trim()) return false;
  try {
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(text.trim());
    ut.lang = "bn-BD";
    ut.rate = 0.92;
    window.speechSynthesis.speak(ut);
    return true;
  } catch {
    return false;
  }
}

/** সাফেল হয়ে শুনানো সমাপ্ত পর্যন্ত অপেক্ষার জন্য । */
export function speakBanglaPhraseAsync(text: string): Promise<boolean> {
  if (!canUseSpeechSynth() || !text.trim()) return Promise.resolve(false);
  return new Promise((resolve) => {
    try {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(text.trim());
      ut.lang = "bn-BD";
      ut.rate = 0.92;
      ut.onend = () => resolve(true);
      ut.onerror = () => resolve(false);
      window.speechSynthesis.speak(ut);
    } catch {
      resolve(false);
    }
  });
}
