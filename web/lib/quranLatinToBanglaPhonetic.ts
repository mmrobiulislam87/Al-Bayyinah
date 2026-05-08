/**
 * Quran.com-স্টাইলের ল্যাটিন ট্রান্সলিটারেশনকে বাংলা লিপিতে
 * পড়ার সহায়ক ধ্বনি-রূপে রূপান্তর (অনুমানিক; আরবি ধ্বনির পূর্ণ নির্ভুলতা নয়)।
 */

const PUA = {
  AIN: "\uE000",
  AIN_MED: "\uE001",
  THAL: "\uE002",
  KHA: "\uE003",
  GHAIN: "\uE004",
  SHEEN: "\uE005",
  DHA: "\uE006",
} as const;

/** টোকেন থেকে অভিধান কী (PUA → ল্যাটিন কোয়ান্টা) */
function tokenToDictKey(prot: string): string {
  return prot
    .replace(/\uE000/g, "aa")
    .replace(/\uE001/g, "a")
    .replace(/\uE002/g, "th")
    .replace(/\uE003/g, "kh")
    .replace(/\uE004/g, "gh")
    .replace(/\uE005/g, "sh")
    .replace(/\uE006/g, "dh");
}

/** উচ্চারণ-নির্দিষ্ট ঘন ঘন শব্দ (কোরআন.কম ল্যাটিন কী → বাংলা ধ্বনি) */
export const QURAN_LATIN_PHONETIC_EXACT: Record<string, string> = {
  bismi: "বিসমি",
  allahi: "আল্লাহি",
  allahu: "আল্লাহু",
  allaha: "আল্লাহা",
  allah: "আল্লাহ",
  alhamdu: "আলহামদু",
  lillahi: "লিল্লাহি",
  rabbi: "রাব্বি",
  alaaalameena: "আলামিন",
  alrrahmani: "আর্‌রাহমানি",
  alrraheemi: "আর্‌রাহীমি",
  maliki: "মালিকি",
  yawmi: "য়াওমি",
  alddeeni: "আদ্‌দীনি",
  iyyaka: "ইয়্যাকা",
  naabudu: "না‘আবুদু",
  waiyyaka: "ওয়াইয়্যাকা",
  nastaaeenu: "নাস্‌তা‘ঈনু",
  ihdina: "ইহ্‌দিনা",
  alssirata: "আস্‌সিরাতা",
  almustaqeema: "আল্‌মুস্‌তাকীম",
  sirata: "সিরাতা",
  allatheena: "আল্‌লাযীন",
  anaamta: "আন্‌‘আম্‌তা",
  aaalayhim: "আলাইহিম",
  ghayri: "ঘাইরি",
  almaghdoobi: "আল্‌মাগ্‌দূবি",
  wala: "ওয়ালা",
  alddalleena: "আদ্‌দাল্লীন",
};

/** ল্যাটিন টোকেন সুরক্ষা: AA=ع, একক A=ع (লোয়ার-লেটারের মাঝে), Th=ذ, ইত্যাদি */
function protectLatinToken(raw: string): string {
  let w = raw.trim();
  if (!w) return w;
  w = w.replace(/AA/g, PUA.AIN);
  w = w.replace(/Th/g, PUA.THAL);
  w = w.replace(/Kh/g, PUA.KHA);
  w = w.replace(/Gh/g, PUA.GHAIN);
  w = w.replace(/Sh/g, PUA.SHEEN);
  w = w.replace(/Dh/g, PUA.DHA);
  w = w.replace(/Ch/g, "চ");
  w = w.replace(/([a-z])A([a-z])/g, `$1${PUA.AIN_MED}$2`);
  return w.toLowerCase();
}

const BN: Record<string, string> = {
  b: "ব",
  t: "ত",
  th: "থ",
  j: "জ",
  h: "হ",
  kh: "খ",
  d: "দ",
  dh: "ধ",
  r: "র",
  z: "জ",
  s: "স",
  sh: "শ",
  gh: "ঘ",
  f: "ফ",
  q: "ক",
  k: "ক",
  l: "ল",
  m: "ম",
  n: "ন",
  w: "ও",
  y: "য়",
  g: "গ",
  p: "প",
  v: "ভ",
};

function bnCons(ch: string): string {
  return BN[ch] ?? ch;
}

/** al + সূর্যীয় স্পষ্টতা → আ + সবিশেষ রূপ */
function assimilatedArticle(prefix: string): string {
  const c = prefix[2];
  return "আ" + bnCons(c) + "্" + bnCons(c);
}

const TAIL_SUFFIX: [RegExp, string][] = [
  [/eena$/, "ীন"],
  [/eeni$/, "ীনি"],
  [/eemu$/, "ীমু"],
  [/eeha$/, "ীহা"],
  [/eehi$/, "ীহি"],
  [/eehu$/, "ীহু"],
  [/oohi$/, "ূহি"],
  [/oona$/, "ূন"],
  [/ooni$/, "ূনি"],
  [/uuna$/, "ূন"],
  [/aoona$/, "ঊন"],
  [/ahum$/, "াহুম"],
  [/ihim$/, "িহিম"],
  [/uhum$/, "ুহুম"],
  [/ukum$/, "ুকুম"],
  [/akum$/, "াকুম"],
  [/ikum$/, "িকুম"],
  [/tum$/, "তুম"],
  [/kum$/, "কুম"],
  [/hum$/, "হুম"],
  [/him$/, "হিম"],
  [/hima$/, "হিমা"],
  [/himo$/, "হিমো"],
  [/hunna$/, "হুন্ন"],
  [/kunna$/, "কুন্ন"],
  [/naa$/, "না"],
  [/tuu$/, "তূ"],
  [/tan$/, "তান"],
  [/een$/, "ীন"],
  [/oom$/, "ূম"],
  [/oon$/, "ূন"],
  [/aam$/, "াম"],
  [/oomu$/, "ূমু"],
  [/aha$/, "াহা"],
  [/ahu$/, "াহু"],
  [/ihi$/, "িহি"],
];

function applySuffixRules(s: string): { head: string; tailBn: string } {
  const rest = s;
  for (const [re, rep] of TAIL_SUFFIX) {
    const m = rest.match(re);
    if (m && m.index !== undefined) {
      const head = rest.slice(0, m.index);
      return { head, tailBn: rep };
    }
  }
  return { head: rest, tailBn: "" };
}

/** দীর্ঘ/সংযুক্ত বর্ণের জন্য টোকেন প্রাক-প্রসেস */
function expandDigraphsInTail(s: string): string {
  let x = s;
  x = x.replace(/sh/g, PUA.SHEEN);
  x = x.replace(/gh/g, PUA.GHAIN);
  x = x.replace(/kh/g, PUA.KHA);
  x = x.replace(/th/g, PUA.THAL);
  x = x.replace(/dh/g, PUA.DHA);
  x = x.replace(/ch/g, "চ");
  x = x.replace(/ph/g, "ফ");
  x = x.replace(/qu/g, "কু");
  return x;
}

function unpua(ch: string): string {
  switch (ch) {
    case PUA.AIN:
    case PUA.AIN_MED:
      return "আ";
    case PUA.THAL:
      return "য";
    case PUA.KHA:
      return "খ";
    case PUA.GHAIN:
      return "ঘ";
    case PUA.SHEEN:
      return "শ";
    case PUA.DHA:
      return "ধ";
    default:
      return ch;
  }
}

/**
 * স্বরবর্ণ ও যুক্তাক্ষর ছাড়াই খ-চ-প ধরনের সরল স্ক্যান:
 * ধ্বনি অনুমানের জন্য সংক্ষিপ্ত 'a' মধ্যবর্তী ভোকাল ধরে নেয়।
 */
function scanTailToBangla(tail: string): string {
  const x = expandDigraphsInTail(tail);
  const { head, tailBn } = applySuffixRules(x);
  const core = head;
  let out = "";
  /** শেষ বর্ণ কি বাংলা ব্যঞজনবর্ণ — এর পর মাত্রা (া, ি…) লাগানো ঠিক */
  let canTakeMatra = false;

  const eatVowelSeq = (i: number): { len: number; matra: string } => {
    const slice = core.slice(i);
    if (slice.startsWith("aa")) return { len: 2, matra: "া" };
    if (slice.startsWith("ee")) return { len: 2, matra: "ী" };
    if (slice.startsWith("oo")) return { len: 2, matra: "ু" };
    if (slice.startsWith("uu")) return { len: 2, matra: "ূ" };
    if (slice.startsWith("ai")) return { len: 2, matra: "য়" };
    if (slice.startsWith("au")) return { len: 2, matra: "ৌ" };
    const c0 = slice[0];
    if (c0 === "a") return { len: 1, matra: "া" };
    if (c0 === "i") return { len: 1, matra: "ি" };
    if (c0 === "u") return { len: 1, matra: "ু" };
    if (c0 === "e") return { len: 1, matra: "ে" };
    if (c0 === "o") return { len: 1, matra: "ো" };
    return { len: 0, matra: "" };
  };

  const vowelOutput = (vs: { len: number; matra: string }, atWordStart: boolean): string => {
    if (atWordStart || !canTakeMatra) {
      switch (vs.matra) {
        case "া":
          return "আ";
        case "ি":
          return "ই";
        case "ু":
          return "উ";
        case "ী":
          return "ঈ";
        case "ূ":
          return "ঊ";
        case "ে":
          return "এ";
        case "ো":
          return "ও";
        case "য়":
          return "ঐ";
        case "ৌ":
          return "ঔ";
        default:
          return vs.matra;
      }
    }
    return vs.matra;
  };

  const consumeOptionalVowels = (atWordStart: boolean): void => {
    const vs = eatVowelSeq(i);
    if (!vs.len) return;
    out += vowelOutput(vs, atWordStart);
    i += vs.len;
    canTakeMatra = false;
  };

  let i = 0;
  while (i < core.length) {
    const ch = core[i];
    const atStart = i === 0 && out.length === 0;

    if (/[aeiou]/.test(ch)) {
      const vs = eatVowelSeq(i);
      if (vs.len) {
        out += vowelOutput(vs, atStart);
        i += vs.len;
        canTakeMatra = false;
        continue;
      }
    }

    if (ch === PUA.AIN || ch === PUA.AIN_MED) {
      out += unpua(ch);
      i += 1;
      canTakeMatra = false;
      consumeOptionalVowels(false);
      continue;
    }
    if ("চফ".includes(ch)) {
      out += ch;
      i += 1;
      canTakeMatra = true;
      consumeOptionalVowels(false);
      continue;
    }

    const isPuaSpecial = Object.values(PUA).includes(ch as (typeof PUA)[keyof typeof PUA]);
    if (isPuaSpecial) {
      out += unpua(ch);
      i += 1;
      canTakeMatra = true;
      consumeOptionalVowels(false);
      continue;
    }

    if (!/[a-z]/.test(ch)) {
      i += 1;
      continue;
    }

    if (i + 1 < core.length && core[i + 1] === core[i] && /[a-z]/.test(ch)) {
      const c0 = bnCons(ch);
      out += c0 + "্" + c0;
      i += 2;
      canTakeMatra = true;
      continue;
    }

    const c0 = bnCons(ch);
    out += c0;
    i += 1;
    canTakeMatra = true;
  }

  return out + tailBn;
}

function stripLeadingArticle(rest: string): { article: string; tail: string } {
  const asm = rest.match(/^al([a-z])\1(.*)$/);
  if (asm) {
    return { article: assimilatedArticle(rest.slice(0, 4)), tail: asm[2] ?? "" };
  }
  if (rest.startsWith("all") && rest.length > 3 && rest[3] !== "l") {
    return { article: "আল্‌ল", tail: rest.slice(3) };
  }
  const alAin = rest.match(/^al([\uE000\uE001])(.*)$/);
  if (alAin) {
    return { article: "আল" + unpua(alAin[1]), tail: alAin[2] ?? "" };
  }
  if (rest.startsWith("al") && rest.length > 2) {
    return { article: "আল", tail: rest.slice(2) };
  }
  return { article: "", tail: rest };
}

export function latinTokenToBanglaPhonetic(raw: string): string {
  const prot = protectLatinToken(raw.replace(/^[^\p{L}\p{N}]*/u, "").replace(/[^\p{L}\p{N}]*$/u, ""));
  if (!prot) return "";

  const fullKey = tokenToDictKey(prot);
  const exactFull = QURAN_LATIN_PHONETIC_EXACT[fullKey];
  if (exactFull) return exactFull;

  let rest = prot;
  let prefix = "";

  const wa = rest.match(/^(wa|fa|sa|ta|la|bi|li|ka)(.+)$/);
  if (wa && wa[1].length <= 2 && wa[2] && /[a-z\uE000-\uE006]/.test(wa[2][0])) {
    const p = wa[1];
    const mapWa: Record<string, string> = {
      wa: "ওয়া",
      fa: "ফা",
      sa: "সা",
      ta: "তা",
      la: "লা",
      bi: "বি",
      li: "লি",
      ka: "কা",
    };
    prefix = mapWa[p] ?? "";
    rest = wa[2];
  }

  const dk = tokenToDictKey(rest);
  const exactHit = QURAN_LATIN_PHONETIC_EXACT[dk];
  if (exactHit) return (prefix || "") + exactHit;

  const { article, tail } = stripLeadingArticle(rest);
  const body = scanTailToBangla(tail);
  return (prefix || "") + (article || "") + body;
}

/**
 * সম্পূর্ণ আয়াতের ল্যাটিন লাইন → বাংলা ধ্বনিলিপি; স্পেস/আন্তঃবিরাম চাপিয়ে যায়।
 */
export function latinQuranLineToBanglaPhonetic(line: string): string {
  const parts = line.trim().split(/(\s+)/);
  return parts
    .map((p) => {
      if (/^\s+$/.test(p)) return p;
      const m = p.match(/^([^A-Za-z0-9']*)([A-Za-z0-9']+)([^A-Za-z0-9']*)$/);
      if (!m) return p;
      const [, pre, mid, post] = m;
      const bn = latinTokenToBanglaPhonetic(mid);
      return bn ? pre + bn + post : p;
    })
    .join("");
}
