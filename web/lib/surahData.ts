import type { AyahRecord } from "@/lib/types";

/** ইন-মেমোরি সূরা ক্যাশ। */
const cache = new Map<number, AyahRecord[]>();

/**
 * এক সূরার JSON (/data/surah/n.json) ক্যাশসহ ফেচ।
 */
export async function fetchSurahAyahs(surah: number): Promise<AyahRecord[]> {
  if (cache.has(surah)) return cache.get(surah)!;
  const res = await fetch(`/data/surah/${surah}.json`);
  if (!res.ok) throw new Error(`সূরা ${surah} লোড ব্যর্থ (${res.status})`);
  const data = (await res.json()) as AyahRecord[];
  cache.set(surah, data);
  return data;
}

/**
 * নির্দিষ্ট সূরা ও আয়াতের পূর্ণ রেকর্ড।
 */
export async function fetchAyahRecord(
  surah: number,
  ayah: number,
): Promise<AyahRecord | undefined> {
  const rows = await fetchSurahAyahs(surah);
  return rows.find((r) => r.ayah === ayah);
}

/**
 * একাধিক (সূরা,আয়াত) একসাথে রিজল্ভ — সূরা ফেচ একবার।
 */
export async function fetchAyahRecords(
  keys: { surah: number; ayah: number }[],
): Promise<(AyahRecord | undefined)[]> {
  const byS = new Map<number, Set<number>>();
  for (const { surah, ayah } of keys) {
    if (!byS.has(surah)) byS.set(surah, new Set());
    byS.get(surah)!.add(ayah);
  }
  const surahData = new Map<number, AyahRecord[]>();
  await Promise.all(
    [...byS.keys()].map(async (s) => {
      surahData.set(s, await fetchSurahAyahs(s));
    }),
  );
  return keys.map(({ surah, ayah }) =>
    surahData.get(surah)?.find((r) => r.ayah === ayah),
  );
}
