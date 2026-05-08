import { normalizeForSearch } from "@/lib/searchQuery";

/**
 * আরবি হরফে সাজেশন (কম্বাইনিং মার্ক ছাড়া) — রুট চেনার জন্য।
 */
export function stripArabicDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

export type CrossLangRoot = {
  id: string;
  /** অ্যাঙ্কর: আরবি স্লাইস */
  matchArabicSlice: (slice: string) => boolean;
  matchEnglishSlice: (slice: string) => boolean;
  matchBengaliSlice: (slice: string) => boolean;
  matchLatinSlice: (slice: string) => boolean;
  bengaliNeedles: string[];
  englishNeedles: string[];
  latinNeedles: string[];
};

function n(s: string): string {
  return normalizeForSearch(s);
}

const RX = {
  enPrayer: /prayer|salat|salah|solat/i,
  bnNamaz: /নামায|নামাজ|সলাত|সালাত/i,
  latSalat: /salat|ssalat|salati|salata|salah|ssalah/i,
};

/**
 * প্রচলিত কুরআনী ধারণা — আরবি মিল থেকে বাংলা/ইংরেজি/ল্যাটিন কীওয়ার্ড হাইলাইট।
 * (শব্দভান্ডার ধীরে ধীরে বাড়ানো যাবে।)
 */
export const QURAN_CROSS_ROOTS: CrossLangRoot[] = [
  {
    id: "salat",
    matchArabicSlice: (slice) => {
      const x = stripArabicDiacritics(n(slice));
      return /صل[وٓ]?[واٰتة]/.test(x) && /ل/.test(x);
    },
    matchEnglishSlice: (slice) => RX.enPrayer.test(slice),
    matchBengaliSlice: (slice) => RX.bnNamaz.test(slice),
    matchLatinSlice: (slice) => RX.latSalat.test(slice),
    bengaliNeedles: ["নামায", "নামাজ", "সলাত", "সালাত"],
    englishNeedles: ["prayer", "Prayer", "salat", "Salat", "salah", "Salah"],
    latinNeedles: ["salati", "ssalati", "salat", "ssalat", "salah", "ssalah"],
  },
  {
    id: "zakat",
    matchArabicSlice: (slice) => {
      const x = stripArabicDiacritics(n(slice));
      return /زك[واٰو]/.test(x) && /ت|ة/.test(x);
    },
    matchEnglishSlice: (slice) => /zakah|zakat|Zakah|Zakat/i.test(slice),
    matchBengaliSlice: (slice) => /যাকাত|জাকাত|জাকাত্/.test(slice),
    matchLatinSlice: (slice) => /zakat|zakati|zakah|zzakat/i.test(slice),
    bengaliNeedles: ["যাকাত", "জাকাত"],
    englishNeedles: ["zakah", "Zakah", "zakat", "Zakat"],
    latinNeedles: ["zakat", "zakati", "zakah", "zzakat"],
  },
  {
    id: "sabr",
    matchArabicSlice: (slice) => {
      const x = stripArabicDiacritics(n(slice));
      return /صبر/.test(x);
    },
    matchEnglishSlice: (slice) => /patience|endurance/i.test(slice),
    matchBengaliSlice: (slice) => /ধৈর্য|সব্র|ধৈর্য্য/.test(slice),
    matchLatinSlice: (slice) => /sabr|sabri|ssabri|alssabri/i.test(slice),
    bengaliNeedles: ["ধৈর্য", "ধৈর্য্য", "সব্র"],
    englishNeedles: ["patience", "Patience", "endurance"],
    latinNeedles: ["sabri", "sabr", "ssabri", "alssabri"],
  },
  {
    id: "rahma",
    matchArabicSlice: (slice) => {
      const x = stripArabicDiacritics(n(slice));
      return /رحم/.test(x);
    },
    matchEnglishSlice: (slice) =>
      /mercy|Merciful|merciful|compassion/i.test(slice),
    matchBengaliSlice: (slice) =>
      /রহমত|করুণা|দয়ালু|করুণাময়|রাহমান|রহীম/.test(slice),
    matchLatinSlice: (slice) =>
      /rahma|rahmah|rahman|raheem|lrrahman|r-rahmani/i.test(slice),
    bengaliNeedles: [
      "রহমত",
      "করুণা",
      "রাহমান",
      "রহীম",
      "করুণাময়",
      "দয়ালু",
    ],
    englishNeedles: ["mercy", "Mercy", "Merciful", "merciful", "compassion"],
    latinNeedles: [
      "rahmat",
      "rahmati",
      "rahman",
      "raheem",
      "alrrahman",
      "alrraheem",
    ],
  },
  {
    id: "allah",
    matchArabicSlice: (slice) => {
      const x = stripArabicDiacritics(n(slice));
      return /الل?ه/.test(x) || /ٱلل?ه/.test(n(slice));
    },
    matchEnglishSlice: (slice) => /\bAllah\b/i.test(slice),
    matchBengaliSlice: (slice) => /আল্লাহ/.test(slice),
    matchLatinSlice: (slice) => /Allah|llah|alil?lahi/i.test(slice),
    bengaliNeedles: ["আল্লাহ"],
    englishNeedles: ["Allah", "ALLAH"],
    latinNeedles: ["Allahu", "Allah", "lillahi", "alllahi"],
  },
];

export function crossRootsMatchingAnchor(
  anchorKey: "arabic" | "english" | "bengali" | "latin" | "bengaliScript",
  mergedAnchorSlice: string,
): CrossLangRoot[] {
  if (!mergedAnchorSlice.trim()) return [];
  return QURAN_CROSS_ROOTS.filter((root) => {
    switch (anchorKey) {
      case "arabic":
        return root.matchArabicSlice(mergedAnchorSlice);
      case "english":
        return root.matchEnglishSlice(mergedAnchorSlice);
      case "bengali":
      case "bengaliScript":
        return root.matchBengaliSlice(mergedAnchorSlice);
      case "latin":
        return root.matchLatinSlice(mergedAnchorSlice);
      default:
        return false;
    }
  });
}
