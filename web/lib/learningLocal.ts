const STORAGE_KEY = "albayyinah_learning_v1";

export type LearningPersist = {
  lastStudyDate: string | null;
  streak: number;
};

function read(): LearningPersist {
  if (typeof window === "undefined") {
    return { lastStudyDate: null, streak: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastStudyDate: null, streak: 0 };
    const j = JSON.parse(raw) as Partial<LearningPersist>;
    return {
      lastStudyDate:
        typeof j.lastStudyDate === "string" ? j.lastStudyDate : null,
      streak: typeof j.streak === "number" && j.streak >= 0 ? j.streak : 0,
    };
  } catch {
    return { lastStudyDate: null, streak: 0 };
  }
}

function write(s: LearningPersist) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function isoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function prevDay(iso: string): string {
  const [y, mo, da] = iso.split("-").map(Number);
  const d = new Date(y!, mo! - 1, da!);
  d.setDate(d.getDate() - 1);
  return isoDateLocal(d);
}

const MISSIONS: { title: string; minutes: number }[] = [
  { title: "১০ মিনিট — একটি ছোট সূরা শুনে নিন ও অনুবাদ পড়ুন", minutes: 10 },
  { title: "১০ মিনিট — হোম থেকে একটি শব্দ সার্চ করে ৫টি আয়াত পড়ুন", minutes: 10 },
  { title: "১০ মিনিট — নতুন ৩টি আয়াত মুখস্থ চেষ্টা (তাজবীদ সহ)", minutes: 10 },
  { title: "১০ মিনিট — জুজ তালিকা থেকে আজকের পর্ব খুলে পড়ুন", minutes: 10 },
  { title: "১০ মিনিট — একটি আয়াত ইংরেজি ও বাংলা অনুবাদ তুলনা করুন", minutes: 10 },
];

export function dailyMissionForDate(d = new Date()) {
  const seed = isoDateLocal(d);
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h + seed.charCodeAt(i) * (i + 3)) % MISSIONS.length;
  }
  return { ...MISSIONS[h]!, dateKey: seed };
}

/** আজ “মিশন সম্পন্ন” চাপ দিলে স্ট্রিক আপডেট। */
export function completeTodayMissionWithMeta(): {
  state: LearningPersist;
  newlyMarkedComplete: boolean;
} {
  const today = isoDateLocal(new Date());
  const cur = read();
  if (cur.lastStudyDate === today) {
    return { state: cur, newlyMarkedComplete: false };
  }
  let streak = 1;
  if (cur.lastStudyDate === prevDay(today)) streak = cur.streak + 1;
  else if (cur.lastStudyDate) streak = 1;
  const next = { lastStudyDate: today, streak };
  write(next);
  return { state: next, newlyMarkedComplete: true };
}

export function completeTodayMission(): LearningPersist {
  return completeTodayMissionWithMeta().state;
}

export function getLearningState(): LearningPersist {
  return read();
}
