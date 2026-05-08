import { stripArabicDiacritics } from "@/lib/crossLanguageRoots";
import { normalizeForSearch } from "@/lib/searchQuery";

export type DictionaryEntry = {
  /** আরবি মূল (প্রদর্শনের জন্য; সহজ রূপ) */
  lemmaAr: string;
  glossBn: string;
  glossEn: string;
  /** UI: সূক্ষ্ম ট্যাগ (যেমন শব্দে শব্দে কorpus) */
  sourceLabel?: string;
};

export type DictionaryLookup = {
  entry: DictionaryEntry;
  /** কোন ভাষার কী দিয়ে মিলেছে */
  matchedAs: "ar" | "bn" | "en";
};

/** আরবি লিমা কী (ডায়াক্রিটিক্স ছাড়া + আলিফ নর্মালাইজ) */
function normalizeArKey(s: string): string {
  const t = normalizeForSearch(stripArabicDiacritics(s)).trim();
  return t.replace(/[\u0640\u200c\u200d]/g, "");
}

function normalizeBnKey(s: string): string {
  return s
    .normalize("NFC")
    .replace(/^[\s\u0964\u0965.,;:!?'"()[\]{}«»।]+|[\s\u0964\u0965.,;:!?'"()[\]{}«»।]+$/gu, "")
    .trim();
}

function normalizeEnKey(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFC")
    .replace(/^[\s.,;:!?'"()[\]{}«»।]+|[\s.,;:!?'"()[\]{}«»।]+$/gu, "")
    .trim();
}

const arByKey = new Map<string, DictionaryEntry>();
const bnByKey = new Map<string, DictionaryEntry>();
const enByKey = new Map<string, DictionaryEntry>();

function register(e: DictionaryEntry, arForms: string[], bnForms: string[], enForms: string[]) {
  const add = (map: Map<string, DictionaryEntry>, keys: string[], asLang: "ar" | "bn" | "en") => {
    for (const raw of keys) {
      if (!raw) continue;
      const k =
        asLang === "ar"
          ? normalizeArKey(raw)
          : asLang === "bn"
            ? normalizeBnKey(raw)
            : normalizeEnKey(raw);
      if (!k) continue;
      if (!map.has(k)) map.set(k, e);
    }
  };
  add(arByKey, arForms, "ar");
  add(bnByKey, bnForms, "bn");
  add(enByKey, enForms, "en");
}

type RawRow = {
  lemmaAr: string;
  glossBn: string;
  glossEn: string;
  arMore?: string[];
  bnMore?: string[];
  enMore?: string[];
};

/**
 * কুরআন পাঠে বারবার আসা শব্দ — আরবি ↔ বাংলা ↔ ইংরেজি সংক্ষিপ্ত অর্থ।
 * (শব্দভান্ডার ধীরে ধীরে বাড়ানো যাবে।)
 */
const ROWS: RawRow[] = [
  {
    lemmaAr: "الله",
    glossBn: "আল্লাহ; এক মাত্র উপাস্য।",
    glossEn: "Allah; God (the One worthy of worship).",
    bnMore: ["আল্লাহ", "আল্লাহ্", "আল্লাহর"],
    enMore: ["allah", "god", "god's"],
  },
  {
    lemmaAr: "رب",
    glossBn: "প্রভু; পালনকর্তা; অধিপতি।",
    glossEn: "Lord; Master; Sustainer.",
    bnMore: ["রব", "রাব্ব", "প্রভু", "পালনকর্তা"],
    enMore: ["lord", "rab", "rabb", "master", "sustainer"],
  },
  {
    lemmaAr: "صلاة",
    glossBn: "নামাজ; আনুষ্ঠানিক সালাত (নির্দিষ্ট রুকনসহ ইবাদত)।",
    glossEn: "Prayer; salat (the prescribed ritual prayer).",
    arMore: ["الصلاة", "صلوة"],
    bnMore: ["নামায", "নামাজ", "নামাযের", "নামাজের", "সলাত", "সালাত"],
    enMore: ["prayer", "salat", "salah", "prayers"],
  },
  {
    lemmaAr: "زكاة",
    glossBn: "যাকাত; নির্দিষ্ট সম্পদে নির্ধারিত দান।",
    glossEn: "Zakah; obligatory almsgiving.",
    arMore: ["زكوة", "الزكاة"],
    bnMore: ["যাকাত", "জাকাত", "জাকাতের"],
    enMore: ["zakat", "zakah", "alms"],
  },
  {
    lemmaAr: "صبر",
    glossBn: "ধৈর্য; অবিচলতা কষ্টের সময়।",
    glossEn: "Patience; steadfast endurance.",
    bnMore: ["ধৈর্য", "ধৈর্য্য", "সব্র"],
    enMore: ["patience", "endure", "endurance", "patient"],
  },
  {
    lemmaAr: "رحمة",
    glossBn: "রহমত; করুণা; দয়া।",
    glossEn: "Mercy; compassion.",
    arMore: ["رحم", "الرحمن", "الرحيم"],
    bnMore: ["রাহমাত", "রহমত", "করুণা", "দয়া"],
    enMore: ["mercy", "merciful", "compassion", "compassionate", "rahman", "raheem", "the most merciful"],
  },
  {
    lemmaAr: "كتاب",
    glossBn: "কিতাব; লিখিত গ্রন্থ; বিশেষত আল্লাহর প্রকাশিত গ্রন্থ।",
    glossEn: "Book; Scripture (often the revealed Book).",
    arMore: ["الكتاب"],
    bnMore: ["কিতাব", "কিতাবে"],
    enMore: ["book", "scripture", "writings"],
  },
  {
    lemmaAr: "آية",
    glossBn: "আয়াত; চিহ্ন; নিদর্শন; কুরআনের এক একক verse।",
    glossEn: "Sign; verse (of the Qur'an).",
    arMore: ["اية"],
    bnMore: ["আয়াত", "আয়াতে"],
    enMore: ["sign", "verse", "ayat", "ayah", "ayas"],
  },
  {
    lemmaAr: "سورة",
    glossBn: "সূরা; কুরআনের অধ্যায়।",
    glossEn: "Surah; a chapter of the Qur'an.",
    arMore: ["سوره"],
    bnMore: ["সূরা", "সুরা"],
    enMore: ["surah", "chapter"],
  },
  {
    lemmaAr: "جنة",
    glossBn: "জান্নাত; মুক্তির উদ্যান।",
    glossEn: "Paradise; Garden (of bliss).",
    arMore: ["الجنة"],
    bnMore: ["জান্নাত", "জান্নাতে"],
    enMore: ["paradise", "garden", "heaven"],
  },
  {
    lemmaAr: "نار",
    glossBn: "আগুন; জাহান্নামের আগুন।",
    glossEn: "Fire; Hellfire.",
    arMore: ["النار"],
    bnMore: ["জাহান্নাম", "আগুন"],
    enMore: ["fire", "hellfire", "hell"],
  },
  {
    lemmaAr: "إيمان",
    glossBn: "ঈমান; আল্লাহ ও তাঁর বাণীর প্রতি বিশ্বাস ও মেনে নেওয়া।",
    glossEn: "Faith; belief (in Allah and His message).",
    arMore: ["ايمان"],
    bnMore: ["ঈমান", "বিশ্বাস"],
    enMore: ["faith", "belief", "believe"],
  },
  {
    lemmaAr: "كفر",
    glossBn: "কুফর; অস্বীকার; কুফরি।",
    glossEn: "Disbelief; ingratitude; rejection (of truth).",
    bnMore: ["কাফির", "অবিশ্বাসী"],
    enMore: ["disbelief", "disbelieve", "unbelief", "reject"],
  },
  {
    lemmaAr: "نبي",
    glossBn: "নবি; আল্লাহর বাণী বহনকারী রাসূল।",
    glossEn: "Prophet (one sent with revelation).",
    arMore: ["نبى", "النبي", "انبياء"],
    bnMore: ["নবি", "নবির"],
    enMore: ["prophet", "prophets"],
  },
  {
    lemmaAr: "رسول",
    glossBn: "রাসূল; প্রেরিত বার্তাবাহক।",
    glossEn: "Messenger; Apostle.",
    arMore: ["الرسول", "رسل"],
    bnMore: ["রাসূল", "রাসুল", "বার্তাবাহক"],
    enMore: ["messenger", "messengers", "apostle"],
  },
  {
    lemmaAr: "آخرة",
    glossBn: "আখেরাত; পরকাল; মৃত্যুর পরের জীবন।",
    glossEn: "Hereafter; the Last Life.",
    arMore: ["الاخرة"],
    bnMore: ["আখেরাত", "পরকাল"],
    enMore: ["hereafter", "afterlife", "last day"],
  },
  {
    lemmaAr: "دنيا",
    glossBn: "দুনিয়া; জাগতিক জীবন।",
    glossEn: "Worldly life; this world.",
    arMore: ["الدنيا"],
    bnMore: ["দুনিয়া", "পৃথিবী"],
    enMore: ["world", "life", "worldly"],
  },
  {
    lemmaAr: "عبادة",
    glossBn: "ইবাদত; আল্লাহর আনুগত্য ও উপাসনা।",
    glossEn: "Worship; servitude to Allah.",
    arMore: ["العبادة"],
    bnMore: ["ইবাদত", "উপাসনা"],
    enMore: ["worship", "serve", "devotion"],
  },
  {
    lemmaAr: "شرك",
    glossBn: "শিরক; আল্লাহর সাথে অংশী স্থাপন।",
    glossEn: "Shirk; associating partners with Allah.",
    bnMore: ["শিরক"],
    enMore: ["shirk", "associating partners"],
  },
  {
    lemmaAr: "مسجد",
    glossBn: "মসজিদ; সাজদাহ করার স্থান।",
    glossEn: "Mosque; place of prostration.",
    bnMore: ["মসজিদ"],
    enMore: ["mosque", "masjid"],
  },
  {
    lemmaAr: "حج",
    glossBn: "হজ; নির্দিষ্ট রীতিতে মক্কা তীর্থ।",
    glossEn: "Hajj; pilgrimage to Makkah.",
    bnMore: ["হজ", "হজ্ব"],
    enMore: ["hajj", "pilgrimage"],
  },
  {
    lemmaAr: "صوم",
    glossBn: "রোজা; নির্দিষ্ট সময়ে উপবাস।",
    glossEn: "Fasting (prescribed).",
    arMore: ["صيام"],
    bnMore: ["রোজা", "সওম"],
    enMore: ["fast", "fasting"],
  },
  {
    lemmaAr: "قتل",
    glossBn: "হত্যা; জীবন কেড়ে নেওয়া।",
    glossEn: "Killing; slaying.",
    bnMore: ["হত্যা"],
    enMore: ["kill", "killing", "slain", "slay"],
  },
  {
    lemmaAr: "حق",
    glossBn: "হক; সত্য; ন্যায়সঙ্গত অধিকার।",
    glossEn: "Truth; right; due.",
    bnMore: ["হক", "সত্য"],
    enMore: ["truth", "right", "true", "due"],
  },
  {
    lemmaAr: "باطل",
    glossBn: "বাতিল; মিথ্যা; অসার।",
    glossEn: "Falsehood; vain.",
    bnMore: ["বাতিল"],
    enMore: ["false", "falsehood", "vain"],
  },
  {
    lemmaAr: "هدى",
    glossBn: "হিদায়াত; সৎ পথ।",
    glossEn: "Guidance.",
    arMore: ["الهدى"],
    bnMore: ["হিদায়াত", "পথ"],
    enMore: ["guidance", "guide", "guided"],
  },
  {
    lemmaAr: "ضلال",
    glossBn: "গুমরাহি; বিপথগমন।",
    glossEn: "Misguidance; astray.",
    bnMore: ["গুমরাহ", "বিপথে"],
    enMore: ["astray", "misguidance", "lost"],
  },
  {
    lemmaAr: "تقوى",
    glossBn: "তাক్వা; আল্লাহকে ভয় ও তাঁর সীমার প্রতি সতর্কতা।",
    glossEn: "God-consciousness; piety (taqwa).",
    bnMore: ["তাক্বা", "খোদাভয়", "ভয়"],
    enMore: ["taqwa", "piety", "righteousness", "consciousness"],
  },
  {
    lemmaAr: "نور",
    glossBn: "নূর; আলো; বিশেষত দিশা-দানকারী আলো।",
    glossEn: "Light (guiding light).",
    bnMore: ["নূর", "আলো"],
    enMore: ["light", "illumination"],
  },
  {
    lemmaAr: "ظلم",
    glossBn: "জুলুম; অবিচার; অধিকারহরণ।",
    glossEn: "Wrongdoing; injustice; oppression.",
    bnMore: ["জুলুম", "অবিচার"],
    enMore: ["wrong", "wrongdoing", "injustice", "oppression", "oppress"],
  },
  {
    lemmaAr: "عدل",
    glossBn: "আদল; ন্যায়; সমান বিচার।",
    glossEn: "Justice; equity.",
    bnMore: ["আদল", "ন্যায়"],
    enMore: ["justice", "equity", "just"],
  },
  {
    lemmaAr: "قلب",
    glossBn: "হৃদয়; অন্তর (বোধ ও বিশ্বাসের কেন্দ্র হিসেবে)।",
    glossEn: "Heart (seat of faith and reflection).",
    bnMore: ["হৃদয়", "অন্তর"],
    enMore: ["heart", "hearts"],
  },
  {
    lemmaAr: "علم",
    glossBn: "ইলম; জ্ঞান; জানা।",
    glossEn: "Knowledge; knowing.",
    bnMore: ["ইলম", "জ্ঞান"],
    enMore: ["knowledge", "know", "known"],
  },
  {
    lemmaAr: "غفران",
    glossBn: "মাফ; ক্ষমা।",
    glossEn: "Forgiveness; pardon.",
    arMore: ["غفر", "مغفرة"],
    bnMore: ["মাফ", "ক্ষমা"],
    enMore: ["forgive", "forgiveness", "pardon"],
  },
  {
    lemmaAr: "شكر",
    glossBn: "শুকর; কৃতজ্ঞতা।",
    glossEn: "Thanks; gratitude.",
    bnMore: ["শুকর", "কৃতজ্ঞতা"],
    enMore: ["thanks", "thank", "grateful", "gratitude"],
  },
  {
    lemmaAr: "دين",
    glossBn: "দীন; জীবনব্যবস্থা ও আনুগত্য; বিচারের দিনও অর্থ হয়।",
    glossEn: "Religion; way of life; judgment (yawm al-din).",
    arMore: ["الدين", "دينا"],
    bnMore: ["দীন", "ধর্ম"],
    enMore: ["religion", "way", "debt", "judgment day"],
  },
  {
    lemmaAr: "يوم",
    glossBn: "দিন; দিবস; বিশেষত কিয়ামত/হিসাবের দিন।",
    glossEn: "Day (often the Day of Judgment).",
    arMore: ["اليوم", "ايام"],
    bnMore: ["দিন"],
    enMore: ["day", "days"],
  },
  {
    lemmaAr: "ملك",
    glossBn: "রাজ্য; সার্বভৌমত্ব; মালিকানা।",
    glossEn: "Kingdom; dominion; ownership.",
    arMore: ["الملك", "ملكوت"],
    bnMore: ["রাজ্য"],
    enMore: ["kingdom", "king", "dominion", "mulk"],
  },
  {
    lemmaAr: "خلق",
    glossBn: "সৃষ্টি; তৈরি করা।",
    glossEn: "Creation; to create.",
    bnMore: ["সৃষ্টি", "সৃষ্টিকর্তা"],
    enMore: ["create", "creation", "creature"],
  },
  {
    lemmaAr: "نفس",
    glossBn: "নফস; আত্মা; প্রাণ; ব্যক্তি।",
    glossEn: "Self; soul; person.",
    bnMore: ["নফস", "আত্মা", "প্রাণ"],
    enMore: ["soul", "self", "person", "nafs"],
  },
  {
    lemmaAr: "وجه",
    glossBn: "মুখমণ্ডল; সম্মুখ; সামনে।",
    glossEn: "Face; presence (before someone).",
    arMore: ["وجوه"],
    bnMore: ["মুখ"],
    enMore: ["face", "countenance"],
  },
  {
    lemmaAr: "سمع",
    glossBn: "শোনা; শ্রবণ।",
    glossEn: "Hearing; to hear.",
    arMore: ["سماع"],
    bnMore: ["শোনা", "শুনে"],
    enMore: ["hear", "hearing", "listen"],
  },
  {
    lemmaAr: "بصر",
    glossBn: "দেখা; দৃষ্টি।",
    glossEn: "Sight; vision.",
    bnMore: ["দেখা", "দৃষ্টি"],
    enMore: ["see", "sight", "vision", "eyes"],
  },
];

for (const row of ROWS) {
  const entry: DictionaryEntry = {
    lemmaAr: row.lemmaAr,
    glossBn: row.glossBn,
    glossEn: row.glossEn,
  };
  const arForms = [row.lemmaAr, ...(row.arMore ?? [])];
  const bnForms = [...(row.bnMore ?? [])];
  const enForms = [...(row.enMore ?? [])];
  register(entry, arForms, bnForms, enForms);
}

/** আরবি টোকেনের সম্ভাব্য রূপ — স্থানীয় মানচিত্রে মিলের হার বাড়াতে। */
function arabicTokenVariants(surface: string): string[] {
  const k = normalizeArKey(surface.trim());
  const out: string[] = [];
  const add = (s: string) => {
    const t = normalizeArKey(s);
    if (t && !out.includes(t)) out.push(t);
  };
  add(surface);
  if (k) {
    if (k.length > 2 && k.startsWith("ال")) add(k.slice(2));
    for (const p of ["و", "ف", "ب", "ل", "ك", "س"]) {
      if (k.startsWith(p) && k.length > 2) add(k.slice(p.length));
    }
  }
  return out;
}

function lookupArabic(word: string): DictionaryEntry | null {
  const seen = new Set<string>();
  for (const raw of arabicTokenVariants(word)) {
    if (seen.has(raw)) continue;
    seen.add(raw);
    const a = arByKey.get(raw);
    if (a) return a;
    const stripped = raw.replace(/^ال/, "");
    if (stripped && stripped !== raw) {
      const b = arByKey.get(stripped);
      if (b) return b;
    }
  }
  return null;
}

function lookupBengali(word: string): DictionaryEntry | null {
  const k = normalizeBnKey(word);
  if (!k) return null;
  const direct = bnByKey.get(k);
  if (direct) return direct;
  if (k.length > 3 && k.endsWith("ের")) {
    const stem = k.slice(0, -2);
    return bnByKey.get(stem) ?? null;
  }
  if (k.length > 2 && (k.endsWith("ে") || k.endsWith("তে"))) {
    const stem = k.endsWith("তে") ? k.slice(0, -2) : k.slice(0, -1);
    return bnByKey.get(stem) ?? null;
  }
  return null;
}

function lookupEnglish(word: string): DictionaryEntry | null {
  const k = normalizeEnKey(word);
  if (!k) return null;
  const direct = enByKey.get(k);
  if (direct) return direct;
  if (k.endsWith("'s") || k.endsWith("s")) {
    const stem = k.replace(/'s$/, "").replace(/s$/, "");
    if (stem !== k) return enByKey.get(stem) ?? null;
  }
  return null;
}

/**
 * ক্লিক করা পৃষ্ঠ শব্দের জন্য শব্দকোষ অনুসন্ধান।
 */
export function lookupWord(
  surface: string,
  lang: "ar" | "bn" | "en",
): DictionaryLookup | null {
  const entry =
    lang === "ar"
      ? lookupArabic(surface)
      : lang === "bn"
        ? lookupBengali(surface)
        : lookupEnglish(surface);
  if (!entry) return null;
  return { entry, matchedAs: lang };
}
