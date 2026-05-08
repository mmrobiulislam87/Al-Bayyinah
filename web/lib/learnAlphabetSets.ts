/**
 * হিজাই ক্রমে ২৮টি আলাদা হরফ। প্রতিটির ছবি ও আরবি শব্দ একই অক্ষর দিয়ে শুরু —
 * শিক্ষাগতভাবে নির্ভরযোগ্য মেনমোনিক।
 */
export type AlphabetPair = {
  letter: string;
  /** বাংলায় ছবি + সংক্ষিপ্ত ব্যাখ্যা */
  wordBn: string;
  emoji: string;
  /** আরবি শব্দ (এই হরফ দিয়ে শুরু) — দেখে মিলিয়ে নিন */
  arabicWord: string;
};

/** হিজাই আদেশ (২৮) — أ ব থেকে ي পর্যন্ত */
export const HIJAI_ALPHABET_28: AlphabetPair[] = [
  {
    letter: "أ",
    emoji: "🐰",
    arabicWord: "أرنب",
    wordBn:
      "খরগোশের ছবি · আরবি أرنب শব্দের একদম শুরুর হরফ হামজাযুক্ত আলিফ (أ)",
  },
  {
    letter: "ب",
    emoji: "🦆",
    arabicWord: "بطة",
    wordBn: "হাঁসের ছবি · আরবি بطة (হাঁস/ডেকখালের পাখি) শুরু হয় বা‘ (ب)",
  },
  {
    letter: "ت",
    emoji: "🍎",
    arabicWord: "تفاحة",
    wordBn: "আপেলের ছবি · আরবি تفاحة মানে আপেল — শুরুর হরফ তা‘ (ت)",
  },
  {
    letter: "ث",
    emoji: "🦊",
    arabicWord: "ثعلب",
    wordBn: "শিয়ালের ছবি · আরবি ثعلب মানে শিয়াল — শুরুর হরফ সা‘ (ث)",
  },
  {
    letter: "ج",
    emoji: "🐪",
    arabicWord: "جمل",
    wordBn: "উটের ছবি · আরবি جمل মানে উট — শুরুর হরফ জীম (ج)",
  },
  {
    letter: "ح",
    emoji: "🐴",
    arabicWord: "حصان",
    wordBn: "ঘোড়ার ছবি · আরবি حصان মানে ঘোড়া — শুরুর হরফ হা‘ (ح)",
  },
  {
    letter: "خ",
    emoji: "🐑",
    arabicWord: "خروف",
    wordBn: "ভেড়ার ছবি · আরবি خروف মানে ভেড়া — শুরুর হরফ খা‘ (خ)",
  },
  {
    letter: "د",
    emoji: "🐔",
    arabicWord: "دجاجة",
    wordBn: "মুরগির ছবি · আরবি دجاجة মানে মুরগি — শুরুর হরফ দাল (د)",
  },
  {
    letter: "ذ",
    emoji: "🐺",
    arabicWord: "ذئب",
    wordBn: "নেকড়ের ছবি · আরবি ذئب মানে নেকড়ে — শুরুর হরফ যাল (ذ)",
  },
  {
    letter: "ر",
    emoji: "👤",
    arabicWord: "رجل",
    wordBn: "মানুষের ছবি · আরবি رجل মানে লোক/পুরুষ — শুরুর হরফ রা‘ (ر)",
  },
  {
    letter: "ز",
    emoji: "🦒",
    arabicWord: "زرافة",
    wordBn: "জিরাফের ছবি · আরবি زرافة — শুরুর হরফ যায় (ز)",
  },
  {
    letter: "س",
    emoji: "🐟",
    arabicWord: "سمكة",
    wordBn: "মাছের ছবি · আরবি سمكة — শুরুর হরফ সীন (س)",
  },
  {
    letter: "ش",
    emoji: "☀️",
    arabicWord: "شمس",
    wordBn: "সূর্যের ছবি · আরবি شمس মানে সূর্য — শুরুর হরফ শীন (ش)",
  },
  {
    letter: "ص",
    emoji: "🦅",
    arabicWord: "صقر",
    wordBn: "ঈগল/বাজপাখির ছবি · আরবি صقر মানে বাজ — শুরুর হরফ সোদ (ص)",
  },
  {
    letter: "ض",
    emoji: "🐸",
    arabicWord: "ضفدع",
    wordBn: "ব্যাঙের ছবি · আরবি ضفدع — শুরুর হরফ দোদ (ض)",
  },
  {
    letter: "ط",
    emoji: "🦚",
    arabicWord: "طاووس",
    wordBn: "ময়ুরের ছবি · আরবি طاووس — শুরুর হরফ তোয় (ط)",
  },
  {
    letter: "ظ",
    emoji: "🦌",
    arabicWord: "ظبي",
    wordBn: "চিতল হরিণের ছবি · আরবি ظبي — শুরুর হরফ যোয় (ظ)",
  },
  {
    letter: "ع",
    emoji: "🍇",
    arabicWord: "عنب",
    wordBn: "আঙুরের ছবি · আরবি عنب মানে আঙুর — শুরুর হরফ আইন (ع)",
  },
  {
    letter: "غ",
    emoji: "☁️",
    arabicWord: "غيم",
    wordBn: "মেঘের ছবি · আরবি غيم মানে মেঘ — শুরুর হরফ গইন (غ)",
  },
  {
    letter: "ف",
    emoji: "🐘",
    arabicWord: "فيل",
    wordBn: "হাতির ছবি · আরবি فيل — শুরুর হরফ ফা‘ (ف)",
  },
  {
    letter: "ق",
    emoji: "🐈",
    arabicWord: "قطة",
    wordBn: "বিড়ালের ছবি · আরবি قطة — শুরুর হরফ কাফ (ق)",
  },
  {
    letter: "ك",
    emoji: "🐕",
    arabicWord: "كلب",
    wordBn: "কুকুরের ছবি · আরবি كلب — শুরুর হরফ কাফ (ك)",
  },
  {
    letter: "ل",
    emoji: "🍋",
    arabicWord: "ليمون",
    wordBn: "লেবুর ছবি · আরবি ليمون — শুরুর হরফ লাম (ل)",
  },
  {
    letter: "م",
    emoji: "🍌",
    arabicWord: "موز",
    wordBn: "কলার ছবি · আরবি موز — শুরুর হরফ মীম (م)",
  },
  {
    letter: "ن",
    emoji: "🐝",
    arabicWord: "نحلة",
    wordBn: "মৌমাছির ছবি · আরবি نحلة — শুরুর হরফ নূন (ن)",
  },
  {
    letter: "ه",
    emoji: "🌙",
    arabicWord: "هلال",
    wordBn: "আধচন্দ্রের ছবি · আরবি هلال মানে অর্ধচন্দ্র — শুরুর হরফ হা‘ (ه)",
  },
  {
    letter: "و",
    emoji: "🌹",
    arabicWord: "وردة",
    wordBn: "গোলাপের ছবি · আরবি وردة — শুরুর হরফ ওয়াও (و)",
  },
  {
    letter: "ي",
    emoji: "✋",
    arabicWord: "يد",
    wordBn: "হাতের ছবি · আরবি يد মানে হাত — শুরুর হরফ ইয়া‘ (ي)",
  },
];

/** দৈনিক ধাপ ২ — প্রথম চারটি হরফ (সহজ শুরু, একই পদ্ধতি) */
export const ALPHABET_DAILY_PAIRS: AlphabetPair[] = HIJAI_ALPHABET_28.slice(0, 4);

/** অনুশীলন: প্রতি রাউন্ডে ৭টি হরফ · মোট চার রাউন্ড = ২৮ */
export const ALPHABET_GAME_ROUNDS: AlphabetPair[][] = [0, 1, 2, 3].map((i) =>
  HIJAI_ALPHABET_28.slice(i * 7, i * 7 + 7),
);

export const ALPHABET_ROUND_TITLES_BN = [
  "রাউন্ড ১ — হরফ ১–৭ (أ … خ)",
  "রাউন্ড ২ — হরফ ৮–১৪ (د … ص)",
  "রাউন্ড ৩ — হরফ ১৫–২১ (ض … ق)",
  "রাউন্ড ৪ — হরফ ২২–২৮ (ك … ي)",
] as const;

/** পুরনো ইমপোর্ট নাম সাময়িক সামঞ্জস্য */
export const ALPHABET_PAIRS_SET1 = ALPHABET_DAILY_PAIRS;
