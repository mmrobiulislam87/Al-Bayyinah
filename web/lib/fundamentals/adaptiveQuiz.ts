import type { AlphabetPair } from "@/lib/learnAlphabetSets";

/** Adaptive sampling: ওজন অনুযায়ী টার্গেট হরফ বাছুন */
export function pickWeightedLetter(
  pool: AlphabetPair[],
  mistakeWeight: Record<string, number>,
  rand: () => number = Math.random,
): AlphabetPair {
  let total = 0;
  const w = pool.map((p) => {
    const base = 1 + (mistakeWeight[p.letter] ?? 0) * 0.35;
    total += base;
    return base;
  });
  let r = rand() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= w[i]!;
    if (r <= 0) return pool[i]!;
  }
  return pool[pool.length - 1]!;
}

/** ডিসট্রাক্টর: টার্গেট ছাড়া র‍্যান্ডম */
export function pickDistractors(
  pool: AlphabetPair[],
  target: AlphabetPair,
  count: number,
  rand: () => number = Math.random,
): AlphabetPair[] {
  const others = pool.filter((p) => p.letter !== target.letter);
  const copy = [...others];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export function shuffleInPlace<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
