/**
 * মুনাসাবাহ v0 — কুরেটেড আয়াত-সংযোগ (নমুনা)। তত্ত্ব দাবি নয়; পাঠ-পর্যবেক্ষণের সূত্র।
 * হাদিস বা রिवायात পাঠ এখানে নেই।
 */

export type MunasabahLink = {
  id: string;
  fromSurah: number;
  fromAyah: number;
  toSurah: number;
  toAyah: number;
  labelBn: string;
  noteBn: string;
};

export const MUNASABAH_SAMPLE_LINKS: readonly MunasabahLink[] = [
  {
    id: "opening-guidance",
    fromSurah: 1,
    fromAyah: 6,
    toSurah: 2,
    toAyah: 2,
    labelBn: "হিদায়াত ও মুত্তাকীদের সংযোগ",
    noteBn:
      "আল-ফাতিহার «হিদায়াত»-ভাব আল-বাক্বারায় «মুত্তাকী»-এর পথ বর্ণনার সাথে কথ্যভাবে সংগত।",
  },
  {
    id: "throne-continuation",
    fromSurah: 2,
    fromAyah: 255,
    toSurah: 2,
    toAyah: 256,
    labelBn: "কুরসীয়ো-আয়াতের পরবর্তী আয়াত",
    noteBn:
      "একই রাশিভুক্ত প্রবাহ: বিশ্বাস ও সাহায্যের ভাব পরপর আয়াতে প্রসারিত।",
  },
  {
    id: "creation-sign-ya-sin",
    fromSurah: 36,
    fromAyah: 12,
    toSurah: 36,
    toAyah: 13,
    labelBn: "সৃষ্টি ও পুনরুত্থানের বর্ণনা-সূত্র",
    noteBn:
      "আয়াত-ক্রমে «নিদর্শন» ভাব থেকে আখিরাতের প্রমাণ ভাবের দিকে প্রবাহ।",
  },
  {
    id: "water-life-theme",
    fromSurah: 21,
    fromAyah: 30,
    toSurah: 24,
    toAyah: 45,
    labelBn: "পানি–জীবন থিম (ক্রস-সূরা সূচক)",
    noteBn:
      "পৃথিবীর আবির্ভাব ও বৃষ্টি-জীবন ভাব বিভিন্ন সূরায় প্রত্যাবর্তিত — থিম্যাটিক পড়া।",
  },
];
