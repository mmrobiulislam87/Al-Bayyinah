/**
 * গবেষণাগার (`/research/lab`) — মডিউল মেটাডেটা ও বাস্তবায়ন স্থিতি।
 * নথিবদ্ধ বিস্তারিত: `docs/RESEARCH_LAB.md`
 */

export type ResearchLabModuleId =
  | "linguistics"
  | "ontology"
  | "semantic"
  | "munasabah"
  | "chronology"
  | "qiraat"
  | "tafsir"
  | "workspace";

export type LabImplementationStatus = "shipped" | "in_progress" | "planned";

export type ResearchLabModule = {
  id: ResearchLabModuleId;
  titleBn: string;
  taglineBn: string;
  status: LabImplementationStatus;
  goalsBn: string[];
  technicalBn: string[];
  relatedHref?: string;
  relatedLabelBn?: string;
};

export const RESEARCH_LAB_MODULES: readonly ResearchLabModule[] = [
  {
    id: "linguistics",
    titleBn: "ভাষাতাত্ত্বিক ও ব্যাকরণ (ই‘রাব ও বালাগাহ)",
    taglineBn:
      "কর্তা, কর্ম, অব্যয় ও সিনট্যাক্স ট্রি; পরে বালাগাহ-সূচক ট্যাগ ও ফিল্টার।",
    status: "in_progress",
    goalsBn: [
      "প্রতিটি আয়াতে টোকেন-স্তরে ই‘রাব/স্ট্রাকচার ভিজ্যুয়ালাইজেশন।",
      "ফাইল, মাফঊল, হরফ ইত্যাদি কালার-কোড।",
      "রূপক, উপমা, মেটাফর ইত্যাদি চিহ্নিত করে অনুসন্ধান।",
    ],
    technicalBn: [
      "লাইসেন্সকৃত মরফো+ডিপেনডেন্সি কorpus ইমপোর্ট (পাইপলাইন `ROADMAP` অনুযায়ী)।",
      "বালাগাহ স্তর বিশেষজ্ঞ-কুরেটেড বা সূত্রযুক্ত ট্যাগ।",
    ],
    relatedHref: "/research",
    relatedLabelBn: "বর্তমান: টোকেন কনকর্ডেন্স ও ফ্রিকোয়েন্সি",
  },
  {
    id: "ontology",
    titleBn: "কোরআনিক অন্টোলোজি ও নলেজ গ্রাফ",
    taglineBn: "ধারণা → সম্পর্ক → আয়াত; থিম্যাটিক ক্লাস্টার ও ইন্টারঅ্যাক্টিভ গ্রাফ।",
    status: "in_progress",
    goalsBn: [
      "যেমন «তাকওয়া» সার্চে নোড-গ্রাফ: জান্নাত, সালাত, ক্ষমা ইত্যাদি সম্পর্ক।",
      "বিষয়ভিত্তিক গুচ্ছ: পানি চক্র, সৃষ্টি, উত্তরাধিকার আইন ইত্যাদি।",
    ],
    technicalBn: [
      "চালু: কুরেটেড `ontologySeed.ts` + গবেষণাগার UI।",
      "PostgreSQL: ধারণা, সম্পর্ক প্রকার, আয়াত-লিঙ্ক টেবিল (পরবর্তী)।",
    ],
  },
  {
    id: "semantic",
    titleBn: "সিমান্টিক সার্চ ও ভেক্টর এম্বেডিং",
    taglineBn:
      "শব্দ মিল নয় — অর্থমূলক কোয়েরি; pgvector / Supabase বিন্যাস।",
    status: "in_progress",
    goalsBn: [
      "ইংরেজি বা অন্য ভাষায় প্রশ্ন দিলে সংশ্লিষ্ট আয়াত র‍্যাঙ্কিং।",
      "আয়াত/অনুবাদ চ্যাঙ্ক → এম্বেডিং → কোসাইন সার্চ।",
    ],
    technicalBn: [
      "চালু: `/api/research/meaning-search` — অনুবাদ ব্লবে টোকেন মিল (ভেক্টর নয়)।",
      "Postgres `pgvector` পরবর্তী ধাপ।",
    ],
    relatedHref: "/research/lab?m=semantic",
    relatedLabelBn: "একই মডিউলে মিনিং-সার্চ UI",
  },
  {
    id: "munasabah",
    titleBn: "ইলমুল মুনাসাবাহ (পারস্পরিক সংযোগ)",
    taglineBn:
      "আয়াত ও সূরার মধ্যে যুক্তিসংগত ও সাহিত্যিক সংযোগ; ম্যাক্রো স্ট্রাকচার।",
    status: "in_progress",
    goalsBn: [
      "আয়াত পড়ার সময় সম্পর্কিত আয়াত/সূরার লিংক।",
      "সূরার মাইন্ড ম্যাপ, রিং কাঠামো বা chiasmus ভিজ্যুয়ালাইজেশন।",
    ],
    technicalBn: [
      "চালু: নমুনা লিঙ্ক `munasabahSeed.ts` (কুরেটেড)।",
      "কুরেটেড `ayah_ayah_link` + উৎস URI (প্রসারণ)।",
    ],
  },
  {
    id: "chronology",
    titleBn: "ক্রোনোলজি ও প্রেক্ষাপট",
    taglineBn:
      "মক্কী/মাদানী ও সূরাভিত্তিক সময়রেখা; প্রজেক্ট সীমা মেনে নুযুল-সূত্র।",
    status: "shipped",
    goalsBn: [
      "ইন্টারঅ্যাক্টিভ টাইমলাইন UI।",
      "আইন ও নির্দেশের ধাপবদ্ধ প্রকাশ প্রেক্ষাপট (নিরপেক্ষ/কুরেটেড)।",
    ],
    technicalBn: [
      "চালু: সূরাভিত্তিক মক্কী/মাদানী টেবিল (`surahRevelation`)।",
      "হাদিস বর্ণনা অ্যাপ-কন্টেন্ট নয়; বহিরাগত তাফসীর লিঙ্ক বা নিরপেক্ষ উপাত্ত।",
    ],
    relatedHref: "/research",
    relatedLabelBn: "ফ্রিকোয়েন্সি: মক্কী/মাদানী ভাগ",
  },
  {
    id: "qiraat",
    titleBn: "কিরাআত ও পাঠভেদ",
    taglineBn:
      "নির্বাচিত মুতাওয়াতির পাঠ; টেক্সট ও (লাইসেন্সসাপেক্ষে) অডিও।",
    status: "planned",
    goalsBn: [
      "কিরাআতভেদে শব্দ ও অর্ময় ব্যবহার পার্থক্যের নিরপক্ষ উপস্থাপন।",
    ],
    technicalBn: [
      "Tanzil ইত্যাদি লাইসেন্স মেনে তথ্য ইমপোর্ট।",
      "প্রতিটি পঠনের 레েবেল ও উৎস।",
    ],
  },
  {
    id: "tafsir",
    titleBn: "তুলনামূলক তাফসীর",
    taglineBn:
      "একই আয়াত — বহু কলাম; ক্লাসিক ও আধুনিক গ্রন্থভিত্তিক পাঠের তুলনা।",
    status: "in_progress",
    goalsBn: [
      "প্যারালাল রিডিং লেআউট।",
      "গ্রন্থপ্রতি স্বচ্ছ অ্যাট্রিবিউশন ও বহিরাগত লিঙ্ক (Iframe নয়)।",
    ],
    technicalBn: [
      "চালু: `/research/tafsir` হাব + সম্পদ তালিকা।",
      "লাইসেন্সকৃত স্নিপেট বা লিঙ্ক-অনলি মডেল।",
    ],
    relatedHref: "/research/tafsir",
    relatedLabelBn: "তাফসীর হাব",
  },
  {
    id: "workspace",
    titleBn: "গবেষকের ল্যাব (নোট ও সাইটেশন)",
    taglineBn:
      "হাইলাইট, ডিজিটাল নোট, APA/MLA এক্সপোর্ট — পরে ক্লাউড সিঙ্ক।",
    status: "shipped",
    goalsBn: [
      "আয়াতে অ্যানোটেশন ও সংরক্ষণ।",
      "গবেষণাপত্রের জন্য রেফারেন্স এক্সপোর্ট।",
    ],
    technicalBn: [
      "চালু: `researchWorkspaceLocal.ts` (localStorage) + APA/MLA খসড়া এক্সপোর্ট।",
      "পরে Supabase Auth + Postgres।",
    ],
  },
] as const;

export const RESEARCH_LAB_MODULE_IDS = RESEARCH_LAB_MODULES.map((m) => m.id);

export function parseLabModuleParam(
  raw: string | null | undefined,
): ResearchLabModuleId {
  const v = (raw ?? "").trim();
  const ids = RESEARCH_LAB_MODULE_IDS as readonly string[];
  if (ids.includes(v)) return v as ResearchLabModuleId;
  return "linguistics";
}
