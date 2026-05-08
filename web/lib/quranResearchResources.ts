/**
 * বাহ্যিক কোরআন-গবেষণা সম্পদ — ডেভেলপমেন্ট ও ইন্টিগ্রেশন পরিকল্পনার জন্য।
 * লাইসেন্স/অ্যাট্রিবিউশন প্রোডাকশনের আগে প্রত্যেক উৎসে যাচাই করুন।
 */

export type QuranResearchCategory =
  | "primary_text"
  | "morphology"
  | "lexicon"
  | "search_api"
  | "tafsir_reference"
  | "methodology";

export type QuranResearchResource = {
  id: string;
  titleBn: string;
  category: QuranResearchCategory;
  url: string;
  summaryBn: string;
  /** সংক্ষিপ্ত লাইসেন্স বা ব্যবহার শর্তের ইঙ্গিত */
  licenseNoteBn: string;
};

export const QURAN_RESEARCH_CATEGORY_LABELS: Record<
  QuranResearchCategory,
  string
> = {
  primary_text: "প্রাথমিক পাঠ ও কর্পাস",
  morphology: "মরফোলজি ও টোকেনাইজেশন",
  lexicon: "ভাষাবিজ্ঞান ও অভিধান",
  search_api: "API ও অনুসন্ধান",
  tafsir_reference: "তাফসীর ও সহগ্রন্থ",
  methodology: "গবেষণা পদ্ধতি ও ইনফ্রা",
};

/** অগ্রাধিকার: অ্যাপে ইমপোর্ট/লিঙ্কের জন্য কুরেটেড তালিকা */
export const QURAN_RESEARCH_RESOURCES: QuranResearchResource[] = [
  {
    id: "tanzil",
    titleBn: "Tanzil — কোরআনের ইউনিকোড পাঠ (Uthmani)",
    category: "primary_text",
    url: "https://tanzil.net/",
    summaryBn:
      "বহুল ব্যবহৃত উথমানী রাসম; ডিজিটাল পোর্টাল ও ডাটা ফাইল। ভিত্তি পাঠ ট্র্যাক করতে গবেষণায় স্ট্যান্ডার্ড রেফারেন্স।",
    licenseNoteBn:
      "সাইট অনুযায়ী ব্যবহারের শর্ত; পুনঃবণ্টন/কমার্শিয়াল আগে নিশ্চিত করুন।",
  },
  {
    id: "quran-com-api",
    titleBn: "Quran.com API — আয়াত, অনুবাদ, রিসাইটেশন মেটাডেটা",
    category: "search_api",
    url: "https://quran.api-docs.io/",
    summaryBn:
      "রেস্ট API দিয়ে বহু ভাষার অনুবাদ, অডিও, সূরা/আয়াত আইডি। অ্যাপে বহুস্তরীয় অনুবাদ ও অডিওর জন্য উপযোগী।",
    licenseNoteBn:
      "API টার্মস ও রেট লিমিট মেনে চলতে হবে; অ্যাট্রিবিউশন নীতি দেখুন।",
  },
  {
    id: "quranic-arabic-corpus",
    titleBn: "The Quranic Arabic Corpus — শব্দ ও মরফোলজি ট্যাগ",
    category: "morphology",
    url: "https://corpus.quran.com/",
    summaryBn:
      "ইংরেজি ইন্টারফেসে রুট,Lemma,ব্যাকরণ ট্যাগ; concordance-স্টাইল গবেষণার ভিত্তি। অল বয়য়িনাহর word-corpus/সার্চের সাথে যাচাই ও সম্প্রসারণের জন্য মূল্যবান।",
    licenseNoteBn:
      "কর্পাসের ওয়েব/API নিয়ম; ডাটা পুনরায় বিতরণ সীমিত হতে পারে।",
  },
  {
    id: "kfgqpc",
    titleBn: "King Fahd Complex — পাঠ, তেলাওয়াত ও ডিজিটাল সম্পদ",
    category: "primary_text",
    url: "https://qurancomplex.gov.sa/",
    summaryBn:
      "রাসিকৃত উথমানী পাঠ, মুদ্রণ ও অফিসিয়াল ডিজিটাল সম্পদ। পাঠবিষয়ক দাবির ভিত্তি যাচাইয়ের রেফারেন্স।",
    licenseNoteBn:
      "কপিরাইট ও ব্যবহার পলিসি সাইটে; বাণিজ্যিক ব্যবহার পৃথক অনুমতি।",
  },
  {
    id: "qurananalysis",
    titleBn: "Quran Analysis — শব্দ ও গঠন বিশ্লেষণ (ওয়েব টুল)",
    category: "methodology",
    url: "https://qurananalysis.com/",
    summaryBn:
      "আরবি টেক্সট বিভাজন ও পুনরাবৃত্তি পর্যবেক্ষণের জন্য তৃতীয় পক্ষ পোর্টাল; নিজস্ব ফলাফল আল-বয়্যিনাহ কর্পাসের সাথে যাচাই করুন।",
    licenseNoteBn:
      "তৃতীয় পক্ষ সেবার শর্তাবলী প্রযোজ্য।",
  },
  {
    id: "openiti",
    titleBn: "OpenITI — ইসলামি টেক্সট কর্পাস (একাডেমিক)",
    category: "methodology",
    url: "https://github.com/OpenITI",
    summaryBn:
      "হাজার হাজার গ্রন্থের TEI/XML; কোরআন পেরিফেরাল সাহিত্য ও তাফসীর পাঠ ট্র্যাকিংয়ে মিলিয়ে পড়ার কৌশল।",
    licenseNoteBn:
      "গ্রন্থভেদে লাইসেন্স; ক্রস-রেফারেন্স পাইপলাইনে শোধরাংশ।",
  },
  {
    id: "corpus-quran-download",
    titleBn: "Quranic Arabic Corpus — ডেটা ডাউনলোড/ডকুমেন্টেশন",
    category: "morphology",
    url: "https://corpus.quran.com/download/",
    summaryBn:
      "আনুষ্ঠানিক ডাউনলোড পৃষ্ঠা ও ব্যাকরণ কোডিং স্কিম; নিজস্ব ফ্রিকোয়েন্সি/কনকর্ডেন্স টুল তৈরিতে।",
    licenseNoteBn:
      "ব্যক্তিগত/শিক্ষাগত বনাম পুনর্বিতরণ — শর্ত পড়ুন।",
  },
  {
    id: "al-qalam-buckwalter",
    titleBn: "Buckwalter Arabic Morphological Analyzer (প্রযুক্তিবিদ্যা)",
    category: "lexicon",
    url: "https://camel-tools.readthedocs.io/",
    summaryBn:
      "CAMeL Tools ইকোসিস্টেম — আধুনিক আরবি NLP; কুরআনি শব্দকে সাধারণ আরবি মডেলে ম্যাপ করার সময় সতর্কতা (সংস্কৃত ভিন্নতা)।",
    licenseNoteBn:
      "প্যাকেজ লাইসেন্স (GPL/LGPL ইত্যাদি) টুলচেইন অনুযায়ী।",
  },
  {
    id: "semantic-quran-scholarly",
    titleBn: "Semantic scholar / Crossref (বিষয়ভিত্তিক সাহিত্য)",
    category: "methodology",
    url: "https://www.semanticscholar.org/",
    summaryBn:
      "কোরআন স্টাডিজ, exegesis, linguistics — পিয়ার রিভিউ আর্টিকেল খুঁজে পদ্ধতি ও ইন্সট্রুমেন্ট পরিচিতি।",
    licenseNoteBn:
      "মেটাডেটা ও পূর্ণ-পাঠ পাবলিকেশনভেদে।",
  },
  {
    id: "altafsir-com",
    titleBn: "Altafsir.com — তাফসীর একত্রীকরণ (রেফারেন্স)",
    category: "tafsir_reference",
    url: "https://www.altafsir.com/",
    summaryBn:
      "ক্লাসিকাল তাফসীর স্তর খুলে দেখার জন্য; গবেষণায় সূরা/আয়াত কনটেক্সট মেলাতে।",
    licenseNoteBn:
      "ওয়েব ব্যবহার বনাম API/স্ক্র্যাপিং — সাইট নীতি মেনে চলুন।",
  },
  {
    id: "usul-methodology",
    titleBn: "Academic journals (ISL, JAIS, BSOAS ইত্যাদি)",
    category: "methodology",
    url: "https://www.jstor.org/",
    summaryBn:
      "কোরআনিক স্টাডিজ, আরবিক লিঙ্গুইস্টিকস, টেক্সচুয়াল ক্রিটিসিজম — পদ্ধতিগত মান।",
    licenseNoteBn:
      "ইনস্টিটিউশনাল সাবস্ক্রিপ্শন প্রায়ই প্রয়োজন।",
  },
  {
    id: "verses-by-theme",
    titleBn: "Thematic indices (মুসহাফ/ইনডেক্স সম্পদ)",
    category: "methodology",
    url: "https://tanzil.net/docs/",
    summaryBn:
      "আয়াত-বিষয় ম্যাপিংয়ের জন্য বাহ্যিক সূচি/ডাটাসেট একত্রিত করা; নিজের থিম ট্যাগিং স্কিম তৈরি।",
    licenseNoteBn:
      "উৎস অনুযায়ী; Tanzil ডকুমেন্টেশন থেকে শুরু।",
  },
];

export function groupResourcesByCategory(
  list: QuranResearchResource[],
): Map<QuranResearchCategory, QuranResearchResource[]> {
  const m = new Map<QuranResearchCategory, QuranResearchResource[]>();
  for (const r of list) {
    const arr = m.get(r.category);
    if (arr) arr.push(r);
    else m.set(r.category, [r]);
  }
  return m;
}
