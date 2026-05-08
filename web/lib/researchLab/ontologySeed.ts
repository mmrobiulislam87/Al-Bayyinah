/**
 * অন্টোলজি v0 — কুরেটেড ধারণা ও সম্পর্ক (ডেমো/স্টার্টার)।
 * পূর্ণ গ্রাফ Postgres বা JSON ইমপোর্টে প্রসারণযোগ্য।
 */

export type OntologyRelationKind =
  | "associated_with"
  | "entails"
  | "context_theme";

export type OntologyConcept = {
  id: string;
  labelBn: string;
  hintBn: string;
  searchHintsBn: string[];
  related: { targetId: string; kind: OntologyRelationKind; labelBn: string }[];
};

export const ONTOLOGY_CONCEPTS: readonly OntologyConcept[] = [
  {
    id: "taqwa",
    labelBn: "তাকওয়া (আল্লাহভীতি / সচেতনতা)",
    hintBn: "আল্লাহর সন্তুষ্টি লক্ষ্যে সীমাবদ্ধতা ও কর্তব্য — বহু আয়াতের কেন্দ্রীয় বিষয়।",
    searchHintsBn: ["তাকওয়া", "তাকী", "ইত্তাকু"],
    related: [
      { targetId: "salat", kind: "associated_with", labelBn: "সালাত/ইবাদত বিন্যাসের সাথে" },
      { targetId: "akhira", kind: "entails", labelBn: "আখিরাত-সচেতনতার সাথে" },
      { targetId: "maghfira", kind: "associated_with", labelBn: "ক্ষমা ও পুরস্কার ভাবনার সাথে" },
    ],
  },
  {
    id: "salat",
    labelBn: "সালাত (নামাজ)",
    hintBn: "নিয়মিত ইবাদত ও স্মরণ — সমাজ ও ব্যক্তি উভয় স্তরে গুরুত্ব।",
    searchHintsBn: ["সালাত", "صلاة", "নামায"],
    related: [
      { targetId: "taqwa", kind: "associated_with", labelBn: "তাকওয়ার বুনিয়াদ" },
      { targetId: "zakat", kind: "associated_with", labelBn: "যাকাত ও আর্থিক নৈতিকতা" },
    ],
  },
  {
    id: "akhira",
    labelBn: "আখিরাত",
    hintBn: "পরকালীন জবাবদিহি ও ফল — মাক্কী বক্তব্যের প্রায়শই কেন্দ্র।",
    searchHintsBn: ["আখিরাত", "পরকাল", "hereafter"],
    related: [
      { targetId: "taqwa", kind: "entails", labelBn: "তাকওয়ার প্রেরণা" },
    ],
  },
  {
    id: "maghfira",
    labelBn: "ক্ষমা (মাগফিরাহ)",
    hintBn: "তাওবাহ ও দয়ার প্রেক্ষাপটে বিচার ও মুক্তি।",
    searchHintsBn: ["ক্ষমা", "মাফ", "forgiveness"],
    related: [
      { targetId: "taqwa", kind: "associated_with", labelBn: "তাকওয়ার ফলাফলের কাছাকাছি ভাব" },
    ],
  },
  {
    id: "zakat",
    labelBn: "যাকাত",
    hintBn: "মাদানী প্রেক্ষাপটে সামাজিক ন্যায়বন্টন।",
    searchHintsBn: ["যাকাত", "জাকাত", "zakat"],
    related: [
      { targetId: "salat", kind: "associated_with", labelBn: "সালাতের সাথে প্রায়শই সজোড়ে" },
    ],
  },
  {
    id: "ma_un",
    labelBn: "পানি / বৃষ্টি / জীবন-চক্র",
    hintBn: "প্রকৃতি ও জীবনের নিয়ম — থিম্যাটিক গবেষণার নমুনা ধরন।",
    searchHintsBn: ["বৃষ্টি", "পানি", "মাআ", "জীবন", "rain", "water"],
    related: [],
  },
] as const;

export function getOntologyConcept(id: string): OntologyConcept | undefined {
  return ONTOLOGY_CONCEPTS.find((c) => c.id === id);
}
