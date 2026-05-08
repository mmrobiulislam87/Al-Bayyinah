/** ক্লায়েন্ট → `/api/dictionary` — লোকাল মিসের পর Wiktionary / Free Dictionary। */

export type RemoteDictionaryOk = {
  ok: true;
  source: string;
  text?: string;
  glossEn?: string;
  glossBn?: string;
  titleUsed?: string;
};

export type RemoteDictionaryResult = RemoteDictionaryOk | { ok: false };

export async function fetchRemoteDictionary(
  word: string,
  lang: "ar" | "bn" | "en",
): Promise<RemoteDictionaryResult> {
  const params = new URLSearchParams({ q: word, lang });
  try {
    const res = await fetch(`/api/dictionary?${params}`);
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as RemoteDictionaryResult;
    if (!data || typeof data !== "object" || !("ok" in data) || !data.ok) {
      return { ok: false };
    }
    return data;
  } catch {
    return { ok: false };
  }
}
