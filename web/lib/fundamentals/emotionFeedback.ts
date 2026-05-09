/** দুর্বল টানায় নরম টোন ও উৎসাহ — UI শ্রেণিবিন্যাসে ব্যবহার */

export type EncourageTone = "neutral" | "warm" | "gentle";

export function encourageToneBn(consecutiveWrong: number): {
  tone: EncourageTone;
  line: string | null;
  softenUi: boolean;
} {
  if (consecutiveWrong <= 2) {
    return { tone: "neutral", line: null, softenUi: false };
  }
  if (consecutiveWrong <= 4) {
    return {
      tone: "warm",
      line: "দারুন চেষ্টা। আরও একবার শুনুন — সাথে সাথে ধরতে পারবেন।",
      softenUi: true,
    };
  }
  return {
    tone: "gentle",
    line: "এখানে কোনো চাপ নেই। ধীরে ধীরেই ভালো লাগতে শুরু করবে।",
    softenUi: true,
  };
}
