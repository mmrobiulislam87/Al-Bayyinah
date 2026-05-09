/**
 * স্মৃতি টিকিয়ে রাখতে সাদামাটা ব্যবধান (interval) ভিত্তিক প্রাথমিক স্কোর —
 * শুধু রিভিউ ক্রম সাজানো।
 */

const REVIEW_GAP_MS = 12 * 60 * 60 * 1000; // ~১২ ঘণ্টা

export function srsScore(
  letter: string,
  mistakeWeight: Record<string, number>,
  lastSeenMs: Record<string, number>,
  now: number,
): number {
  const mw = mistakeWeight[letter] ?? 0;
  const last = lastSeenMs[letter] ?? 0;
  const elapsed = Math.max(0, now - last);
  const overdueBoost = elapsed > REVIEW_GAP_MS ? 2.4 : elapsed / REVIEW_GAP_MS;
  return mw * 1.25 + overdueBoost;
}

/** উচ্চ স্কোর = আগে রিভিউ */
export function reviewOrder(
  letters: string[],
  mistakeWeight: Record<string, number>,
  lastSeenMs: Record<string, number>,
  now: number,
): string[] {
  return [...letters].sort(
    (a, b) => srsScore(b, mistakeWeight, lastSeenMs, now) - srsScore(a, mistakeWeight, lastSeenMs, now),
  );
}
