import { addPoints } from "@/lib/walletLocal";

const REWARD_KEY = "albayyinah_daily_learn_rewards_v1";

export type LearnRewardStep =
  | "mission"
  | "hijai_listen"
  | "alphabet"
  | "motion"
  | "alphabet_round_1"
  | "alphabet_round_2"
  | "alphabet_round_3"
  | "alphabet_round_4"
  | "ligatures_round"
  | "fundamentals_l1_gate";

/** প্রতিটি ধাপে প্রথম সম্পন্নের জন্য হিকমাহ (একই ক্যালেন্ডার দিনে একবার)। */
const AMOUNTS: Record<LearnRewardStep, number> = {
  mission: 15,
  hijai_listen: 18,
  alphabet: 25,
  motion: 15,
  alphabet_round_1: 10,
  alphabet_round_2: 10,
  alphabet_round_3: 10,
  alphabet_round_4: 10,
  ligatures_round: 14,
  fundamentals_l1_gate: 28,
};

function isoDateLocal(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type Bag = {
  date: string;
  mission: boolean;
  hijai_listen: boolean;
  alphabet: boolean;
  motion: boolean;
  alphabet_round_1: boolean;
  alphabet_round_2: boolean;
  alphabet_round_3: boolean;
  alphabet_round_4: boolean;
  ligatures_round: boolean;
  fundamentals_l1_gate: boolean;
};

function emptyBag(date: string): Bag {
  return {
    date,
    mission: false,
    hijai_listen: false,
    alphabet: false,
    motion: false,
    alphabet_round_1: false,
    alphabet_round_2: false,
    alphabet_round_3: false,
    alphabet_round_4: false,
    ligatures_round: false,
    fundamentals_l1_gate: false,
  };
}

function readBag(): Bag {
  if (typeof window === "undefined") return emptyBag("");
  try {
    const raw = localStorage.getItem(REWARD_KEY);
    if (!raw) return emptyBag(isoDateLocal());
    const j = JSON.parse(raw) as Partial<Bag>;
    const today = isoDateLocal();
    if (j.date !== today || typeof j.date !== "string") {
      return emptyBag(today);
    }
    return {
      date: today,
      mission: Boolean(j.mission),
      hijai_listen: Boolean(j.hijai_listen),
      alphabet: Boolean(j.alphabet),
      motion: Boolean(j.motion),
      alphabet_round_1: Boolean(j.alphabet_round_1),
      alphabet_round_2: Boolean(j.alphabet_round_2),
      alphabet_round_3: Boolean(j.alphabet_round_3),
      alphabet_round_4: Boolean(j.alphabet_round_4),
      ligatures_round: Boolean(j.ligatures_round),
      fundamentals_l1_gate: Boolean(j.fundamentals_l1_gate),
    };
  } catch {
    return emptyBag(isoDateLocal());
  }
}

function writeBag(b: Bag) {
  localStorage.setItem(REWARD_KEY, JSON.stringify(b));
}

/**
 * আজকের জন্য নির্দিষ্ট ধাপে প্রথমবার পুরস্কার দিলে পয়েন্ট সংখ্যা, নয়তো ০।
 */
export function awardLearnStepIfFirstToday(step: LearnRewardStep): number {
  if (typeof window === "undefined") return 0;
  const amt = AMOUNTS[step];
  if (amt <= 0) return 0;

  const bag = readBag();
  if (bag[step]) return 0;

  const next: Bag = { ...bag, [step]: true };
  writeBag(next);
  addPoints(amt);
  return amt;
}

export function learnRewardAmounts(): Readonly<typeof AMOUNTS> {
  return AMOUNTS;
}
