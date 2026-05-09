import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "albayyinah_learn_fundamentals_v1";

export type FundamentalLevelId = "L1" | "L2" | "L3" | "L4" | "L5";

type GateMap = Partial<Record<FundamentalLevelId, boolean>>;

export type QuizModeId = "hear_pick" | "match_shape";

export interface LearnFundamentalsState {
  version: number;
  xp: number;
  lastActiveDay: string | null;
  gates: GateMap;
  letterExposureCount: Record<string, number>;
  mistakeWeight: Record<string, number>;
  lastSeenMs: Record<string, number>;
  consecutiveWrongQuiz: number;
  totalQuizCorrect: number;
  totalQuizWrong: number;
  /** শুনে বাছুন মোডে বর্তমান ধারাবাহিক সঠিক */
  rollingHearPickCorrect: number;
  hearPickStreakBest: number;
  tracingStrokesLogged: Record<string, number>;

  touchLetterExplore: (letter: string) => void;
  reportQuizOutcome: (
    letter: string,
    correct: boolean,
    mode: QuizModeId,
  ) => void;
  tryClearLevel1Gate: () => boolean;
  ensureDailySession: () => void;
  resetProgress: () => void;
}

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const initialGates: GateMap = { L1: true, L2: false, L3: false, L4: false, L5: false };

function clampWeight(delta: number) {
  return Math.max(0, Math.min(24, delta));
}

function bumpWeight(m: Record<string, number>, letter: string, delta: number): Record<string, number> {
  const next = { ...m };
  const prev = next[letter] ?? 0;
  next[letter] = clampWeight(prev + delta);
  return next;
}

const memoryStorage: Storage = (() => {
  let store: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      store = {};
    },
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
  };
})();

export const useLearnFundamentalsStore = create<LearnFundamentalsState>()(
  persist(
    (set, get) => ({
      version: 1,
      xp: 0,
      lastActiveDay: null,
      gates: { ...initialGates },
      letterExposureCount: {},
      mistakeWeight: {},
      lastSeenMs: {},
      consecutiveWrongQuiz: 0,
      totalQuizCorrect: 0,
      totalQuizWrong: 0,
      rollingHearPickCorrect: 0,
      hearPickStreakBest: 0,
      tracingStrokesLogged: {},

      ensureDailySession: () => {
        const day = todayIso();
        set((s) => {
          if (s.lastActiveDay === day) return s;
          return {
            lastActiveDay: day,
            consecutiveWrongQuiz: 0,
            rollingHearPickCorrect: 0,
          };
        });
      },

      touchLetterExplore: (letter) => {
        get().ensureDailySession();
        set((s) => ({
          letterExposureCount: {
            ...s.letterExposureCount,
            [letter]: (s.letterExposureCount[letter] ?? 0) + 1,
          },
          lastSeenMs: { ...s.lastSeenMs, [letter]: Date.now() },
          xp: s.xp + 1,
        }));
      },

      reportQuizOutcome: (letter, correct, mode) => {
        get().ensureDailySession();
        set((s) => {
          let rollingHear = s.rollingHearPickCorrect;
          if (mode === "hear_pick") {
            rollingHear = correct ? rollingHear + 1 : 0;
          }
          const mistakeWeightNext = bumpWeight(
            s.mistakeWeight,
            letter,
            correct ? -1 : 3,
          );
          const hearBest = Math.max(s.hearPickStreakBest, rollingHear);

          return {
            mistakeWeight: mistakeWeightNext,
            consecutiveWrongQuiz: correct ? 0 : s.consecutiveWrongQuiz + 1,
            totalQuizCorrect: correct ? s.totalQuizCorrect + 1 : s.totalQuizCorrect,
            totalQuizWrong: correct ? s.totalQuizWrong : s.totalQuizWrong + 1,
            lastSeenMs: { ...s.lastSeenMs, [letter]: Date.now() },
            xp: s.xp + (correct ? 12 : 2),
            rollingHearPickCorrect: rollingHear,
            hearPickStreakBest: hearBest,
          };
        });
      },

      tryClearLevel1Gate: () => {
        const s = get();
        const totalExposureTouches = Object.values(s.letterExposureCount).reduce(
          (a, b) => a + b,
          0,
        );
        const enoughExplore = totalExposureTouches >= 18;
        const enoughQuiz =
          s.totalQuizCorrect >= 10 && s.hearPickStreakBest >= 4;
        if ((enoughExplore && enoughQuiz) || s.totalQuizCorrect >= 22) {
          set((st) => ({
            gates: { ...st.gates, L2: true },
          }));
          return true;
        }
        return Boolean(s.gates.L2);
      },

      resetProgress: () =>
        set({
          version: 1,
          xp: 0,
          lastActiveDay: null,
          gates: { ...initialGates },
          letterExposureCount: {},
          mistakeWeight: {},
          lastSeenMs: {},
          consecutiveWrongQuiz: 0,
          totalQuizCorrect: 0,
          totalQuizWrong: 0,
          rollingHearPickCorrect: 0,
          hearPickStreakBest: 0,
          tracingStrokesLogged: {},
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : localStorage,
      ),
      partialize: (s) => ({
        version: s.version,
        xp: s.xp,
        lastActiveDay: s.lastActiveDay,
        gates: s.gates,
        letterExposureCount: s.letterExposureCount,
        mistakeWeight: s.mistakeWeight,
        lastSeenMs: s.lastSeenMs,
        consecutiveWrongQuiz: s.consecutiveWrongQuiz,
        totalQuizCorrect: s.totalQuizCorrect,
        totalQuizWrong: s.totalQuizWrong,
        rollingHearPickCorrect: s.rollingHearPickCorrect,
        hearPickStreakBest: s.hearPickStreakBest,
        tracingStrokesLogged: s.tracingStrokesLogged,
      }),
      skipHydration: true,
    },
  ),
);
