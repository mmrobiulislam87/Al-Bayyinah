import { getSurahMeta } from "@/lib/surahs";

/**
 * পূর্ণ সূরা বা আয়াতপ্রতি তেলাওয়াত — Al Quran Cloud / Islamic Network CDN।
 * @see https://alquran.cloud/cdn
 */

export const QURAN_AUDIO_SURAH_BASE =
  "https://cdn.islamic.network/quran/audio-surah";

export const QURAN_AUDIO_AYAH_BASE =
  "https://cdn.islamic.network/quran/audio";

/** হাফস অনুসারে মোট আয়াত — `surahs.ts` এর গণনার সঙ্গে মিল। */
export const TOTAL_QURAN_AYAH = 6236 as const;

/** kbps — 128 সুস্থিত; ৬৪ ধীর নেটওয়ার্কের জন্য। */
export const DEFAULT_SURAH_AUDIO_BITRATE = 128 as const;

export type SurahReciterOption = {
  id: string;
  labelBn: string;
};

/** শ্রুতিমধুর ক্বারী — Al Quran Cloud `ar.*` আইডি, Islamic Network CDN। */
export const SURAH_RECITERS: SurahReciterOption[] = [
  { id: "ar.alafasy", labelBn: "মিশারি রাশিদ আল-আফাস্য" },
  { id: "ar.husary", labelBn: "মাহমূদ খলীল আল-হুসারী" },
  { id: "ar.mahermuaiqly", labelBn: "মাহের আল-মুআইকলি" },
  { id: "ar.abdurrahmaansudais", labelBn: "আবদুর রহমান আস-সুদাইস" },
  { id: "ar.abdullahbasfar", labelBn: "আব্দুল্লাহ আল-বাসফার" },
  { id: "ar.abdulbasitmurattal", labelBn: "আব্দুল বাসিত (মুরাত্তাল)" },
  { id: "ar.abdulsamad", labelBn: "আব্দুল বাসিত (আব্দুস সামাদ)" },
  { id: "ar.shaatree", labelBn: "আবু বাকার আশ-শাত্রী" },
  { id: "ar.ahmedajamy", labelBn: "আহমাদ ইবনে আলী আল-আজামি" },
  { id: "ar.husarymujawwad", labelBn: "আল-হুসারী (মুজাওয়াদ)" },
  { id: "ar.hudhaify", labelBn: "আলী আল-হুযাইফি" },
  { id: "ar.hanirifai", labelBn: "হানি আর-রিফাই" },
  { id: "ar.ibrahimakhbar", labelBn: "ইব্রাহীম আল-আখদার" },
  { id: "ar.minshawi", labelBn: "মুহাম্মাদ সিদ্দীক আল-মিনশাবী" },
  { id: "ar.minshawimujawwad", labelBn: "আল-মিনশাবী (মুজাওয়াদ)" },
  { id: "ar.muhammadayyoub", labelBn: "মুহাম্মাদ আইয়ূব" },
  { id: "ar.muhammadjibreel", labelBn: "মুহাম্মাদ জিবরীল" },
  { id: "ar.saoodshuraym", labelBn: "সউদ আশ-শুরাইম" },
  { id: "ar.aymanswoaid", labelBn: "আইমান সোয়াইদ" },
  { id: "ar.parhizgar", labelBn: "শেহরিয়ার পারহিজগার" },
];

export const DEFAULT_SURAH_RECITER_ID = "ar.alafasy";

const LS_RECITER_KEY = "al-bayyinah-surah-reciter-id";

export function readStoredSurahReciterId(): string {
  if (typeof window === "undefined") return DEFAULT_SURAH_RECITER_ID;
  try {
    const v = window.localStorage.getItem(LS_RECITER_KEY)?.trim();
    if (v && SURAH_RECITERS.some((r) => r.id === v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_SURAH_RECITER_ID;
}

export function writeStoredSurahReciterId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    if (SURAH_RECITERS.some((r) => r.id === id)) {
      window.localStorage.setItem(LS_RECITER_KEY, id);
    }
  } catch {
    /* ignore */
  }
}

/** সূরা ১–১১৪ সম্পূর্ণ ফাইলের HTTPS URL। */
export function surahAudioUrl(
  surahNumber: number,
  reciterId: string = DEFAULT_SURAH_RECITER_ID,
  bitrate: number = DEFAULT_SURAH_AUDIO_BITRATE,
): string {
  const n = Math.floor(surahNumber);
  if (n < 1 || n > 114) {
    throw new RangeError("surahNumber must be 1–114");
  }
  return `${QURAN_AUDIO_SURAH_BASE}/${bitrate}/${reciterId}/${n}.mp3`;
}

/**
 * কুরআনে আয়াতের ক্রমিক নাম্বার ১…৬২৩৬ (পূর্ববর্তী সূরাগুলোর আয়াত যোগ + স্থানীয় আয়াত)।
 */
export function globalQuranAyahIndex(
  surahNumber: number,
  localAyah: number,
): number {
  const s = Math.floor(surahNumber);
  const a = Math.floor(localAyah);
  if (s < 1 || s > 114 || a < 1) {
    throw new RangeError("Invalid surah or ayah");
  }
  const meta = getSurahMeta(s);
  if (!meta || a > meta.ayahCount) {
    throw new RangeError("Ayah out of range for this surah");
  }
  let offset = 0;
  for (let i = 1; i < s; i++) {
    const m = getSurahMeta(i);
    if (!m) throw new RangeError("Missing surah metadata");
    offset += m.ayahCount;
  }
  const g = offset + a;
  if (g < 1 || g > TOTAL_QURAN_AYAH) {
    throw new RangeError("Global ayah index out of range");
  }
  return g;
}

/** একক আয়াতের MP3 (গ্লোবাল ইন্ডেক্স ১–৬২৩৬)। */
export function ayahAudioUrlByGlobalIndex(
  globalAyahIndex: number,
  reciterId: string = DEFAULT_SURAH_RECITER_ID,
  bitrate: number = DEFAULT_SURAH_AUDIO_BITRATE,
): string {
  const n = Math.floor(globalAyahIndex);
  if (n < 1 || n > TOTAL_QURAN_AYAH) {
    throw new RangeError(`globalAyahIndex must be 1–${TOTAL_QURAN_AYAH}`);
  }
  return `${QURAN_AUDIO_AYAH_BASE}/${bitrate}/${reciterId}/${n}.mp3`;
}

export function ayahAudioUrlInSurah(
  surahNumber: number,
  localAyah: number,
  reciterId: string = DEFAULT_SURAH_RECITER_ID,
  bitrate: number = DEFAULT_SURAH_AUDIO_BITRATE,
): string {
  return ayahAudioUrlByGlobalIndex(
    globalQuranAyahIndex(surahNumber, localAyah),
    reciterId,
    bitrate,
  );
}
