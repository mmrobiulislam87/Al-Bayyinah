/**
 * মরফোলজি API-র «ভাব দুই স্তর»: (১) ধাতু/ভাষাগত ভিত্তি (২) কোরআনিক নিবন্ধনে প্রচলিত অর্থ।
 * ডাটা কোরআন ও আধুনিক আরবি লেক্সিকোগ্রাফি-স্তরের ব্যাখ্যা — হাদিস সংকলন বা ইসনād ঢোকানো হয় না।
 *
 * ক্রস-রুট আইডি `crossLanguageRoots.ts` এর `QURAN_CROSS_ROOTS[].id` এর সঙ্গে মিল রেখে বাড়ানো যাবে।
 */

export type MorphologySemanticEntry = {
  /** রুট অক্ষরের বর্ণনা (আরবি হরফ বা স্বল্প টীকা) */
  rootLettersNoteBn: string;
  /** ধাতু/লেক্সিক্যাল স্তর — «ভেতরের» অর্থ */
  lexicalGlossBn: string;
  /** কোরআনিক ব্যাবহারে স্থির পরিভাষা / অনুবাদে প্রচলিত ধারণা */
  quranicRegisterGlossBn: string;
};

const LAYERS: Record<string, MorphologySemanticEntry> = {
  salat: {
    rootLettersNoteBn: "ধাতু ص–ل–و (লিপ্যন্তর: س ، ل ، و)",
    lexicalGlossBn:
      "উৎপত্তিগতভাবে সংযোগ বা নৈকট্য, সম্পর্ক স্থাপন, এবং কল্যাণমুখী প্রার্থনা বা দোয়ার ধারণার সঙ্গে যুক্ত।",
    quranicRegisterGlossBn:
      "কোরআনের পরিভাষায় নির্দিষ্ট কাঠামোগত ইবাদত; বাংলায় প্রচলিত «নামাজ» শব্দটি প্রায়ই এই নিবন্ধিত অর্থের স্থানীয় প্রতিশব্দ হিসেবে বোঝায়।",
  },
  zakat: {
    rootLettersNoteBn: "ধাতু ز–ك–و",
    lexicalGlossBn:
      "পুষ্টি, বৃদ্ধি, পবিত্রতা বা পরিশোধনের সঙ্গে যুক্ত মৌলিক ধারণা থেকে আর্থিক-সামাজিক শুদ্ধিকরণের রূপান্তর।",
    quranicRegisterGlossBn:
      "কোরআনিক নিবন্ধনে নির্দিষ্ট বিধিবদ্ধ দান বা প্রদেয় ধন — সম্পদের উপর সামাজিক দায়বদ্ধতা হিসেবে।",
  },
  sabr: {
    rootLettersNoteBn: "ধাতু ص–ب–ر",
    lexicalGlossBn:
      "আয়োজন বা বেঁধে রাখা, সীমা বজায় রাখা ইত্যাদি থেকে «ধৈর্য» বা স্থিরতার ব্যাপক ধারণা।",
    quranicRegisterGlossBn:
      "কোরআনিক প্রেক্ষাপটে প্রতিকূলতা বা পরীক্ষায় আত্মনিয়ন্ত্রণ ও স্থির থাকার ভাব।",
  },
  rahma: {
    rootLettersNoteBn: "ধাতু ر–ح–م",
    lexicalGlossBn:
      "কোমলতা, স্নেহ, করুণা — মায়ের তুলনায় ব্যবহৃত আরবি প্রচলিত ধারণা থেকে প্রসারিত।",
    quranicRegisterGlossBn:
      "কোরআনে মহান আল্লাহর গুণ ও বিশেষণাবলির কেন্দ্রীয় ভাব — দয়া, ক্ষমা ও প্রত্যাশিত অনুগ্রহ।",
  },
  allah: {
    rootLettersNoteBn:
      "নির্দিষ্ট পবিত্র নাম — আরবি ভাষাশাস্ত্রে বিশেষ ব্যুৎপত্তি বিতর্ক থাকতে পারে; এখানে ব্যবহারিক সংকেত।",
    lexicalGlossBn:
      "ইসলামি সাহিত্যে একক সর্বোচ্চ সত্তা নির্দেশক নাম হিসেবে প্রতিষ্ঠিত পদ।",
    quranicRegisterGlossBn:
      "কোরআনে সর্বোচ্চ স্রষ্টা ও এক উপাস্য — সাধারণ অনুবাদে «গড» এর সাথে একেবারে মিলিয়ে নেওয়ার ঝুঁকি এড়িয়ে নির্দিষ্ট নাম হিসেবে ধরা ভালো।",
  },
};

export function getMorphologySemanticLayer(rootId: string): MorphologySemanticEntry | null {
  return LAYERS[rootId] ?? null;
}

export function listSemanticRootIds(): string[] {
  return Object.keys(LAYERS);
}
