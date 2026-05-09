"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { toBengaliDigits } from "@/lib/numberBn";
import {
  completeTodayMissionWithMeta,
  dailyMissionForDate,
  getLearningState,
  type LearningPersist,
} from "@/lib/learningLocal";
import {
  awardLearnStepIfFirstToday,
  learnRewardAmounts,
} from "@/lib/learnRewards";
import AlphabetDragExercise from "@/components/AlphabetDragExercise";
import HijaiLetterSoundboard from "@/components/HijaiLetterSoundboard";
import TajweedBatchInspiredPractice from "@/components/TajweedBatchInspiredPractice";
import LearnPathMasterPlan from "@/components/LearnPathMasterPlan";
import {
  ALPHABET_DAILY_PAIRS,
  hijaiLettersWithNames,
} from "@/lib/learnAlphabetSets";

const PAIRS = ALPHABET_DAILY_PAIRS;
const HIJAI_LETTERS = hijaiLettersWithNames();

const STEPS = [
  {
    id: 1 as const,
    short: "১ · একক হরফ",
    label:
      "ধাপ ১ — ১ম সূত্র: বর্ণমালা ২৯ হরফ; টিপে আরবি হরফনাম (৩ সারি, ডান→বাম)",
  },
  {
    id: 2 as const,
    short: "২ · মিলিয়ে খেলা",
    label: "ধাপ ২ — আধুনিক (এলোমেলো) বা হিজাই ক্রমে ড্র্যাগ করে মিল",
  },
  {
    id: 3 as const,
    short: "৩ · লাম–আলিফ",
    label: "ধাপ ৩ — লাম ও আলিফ মিলিয়ে যুক্ত রূপ (لا)",
  },
  {
    id: 4 as const,
    short: "৪ · আজকের মিশন",
    label: "ধাপ ৪ — এক লাইন কাজ টিক দিন, স্ট্রিক ও হিকমাহ",
  },
];

type StepId = (typeof STEPS)[number]["id"];

const LEARN_DEFAULT: LearningPersist = { lastStudyDate: null, streak: 0 };

const motionStageVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.08 },
  },
};

const motionGlyphVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 24 },
  },
};

const motionFusionVariants = {
  hidden: { opacity: 0, scale: 0.75, rotate: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

const REWARD_AMTS = learnRewardAmounts();

export default function LearnModuleClient() {
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [soundboardEpoch, setSoundboardEpoch] = useState(0);
  const [soundCycleDone, setSoundCycleDone] = useState(false);
  const [bankOrder, setBankOrder] = useState<"shuffle" | "hijai">("shuffle");
  const [pointsToast, setPointsToast] = useState<string | null>(null);
  const [dailyAlphabetDone, setDailyAlphabetDone] = useState(false);
  const [learn, setLearn] = useState<LearningPersist>(LEARN_DEFAULT);
  const [mission, setMission] = useState<{ title: string; minutes: number } | null>(
    null,
  );
  const [motionReplayKey, setMotionReplayKey] = useState(0);

  const goStep = useCallback((id: StepId) => {
    setActiveStep((prev) => {
      if (id === 1 && prev !== 1) {
        setSoundboardEpoch((e) => e + 1);
        setSoundCycleDone(false);
      }
      return id;
    });
  }, []);

  useEffect(() => {
    setLearn(getLearningState());
    setMission(dailyMissionForDate());
  }, []);

  useEffect(() => {
    if (!pointsToast) return;
    const id = window.setTimeout(() => setPointsToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [pointsToast]);

  useEffect(() => {
    if (activeStep !== 2) setDailyAlphabetDone(false);
  }, [activeStep]);

  useEffect(() => {
    if (activeStep !== 1) setSoundCycleDone(false);
  }, [activeStep]);

  /** ধাপ ১ — ২৯ হরফের নাম টিচ সাইক্ল সমাপ্ত → পয়েন্ট + পরের ধাপ */
  useEffect(() => {
    if (!soundCycleDone || activeStep !== 1) return;
    const gained = awardLearnStepIfFirstToday("hijai_listen");
    if (gained > 0) {
      setPointsToast(
        `+${toBengaliDigits(gained)} হিকমাহ পয়েন্ট · হরফ শোনা সম্পূর্ণ`,
      );
    }
    const id = window.setTimeout(() => goStep(2), gained > 0 ? 900 : 700);
    return () => window.clearTimeout(id);
  }, [soundCycleDone, activeStep, goStep]);

  /** ধাপ ২ ড্র্যাগ খেলা শেষ → পয়েন্ট + লাম–আলিফের ধাপ */
  useEffect(() => {
    if (!dailyAlphabetDone || activeStep !== 2) return;
    const gained = awardLearnStepIfFirstToday("alphabet");
    if (gained > 0) {
      setPointsToast(
        `+${toBengaliDigits(gained)} হিকমাহ পয়েন্ট · ধাপ ২ সম্পন্ন`,
      );
    }
    const id = window.setTimeout(() => goStep(3), 750);
    return () => window.clearTimeout(id);
  }, [dailyAlphabetDone, activeStep, goStep]);

  /** ধাপ ৩ লাম–আলিফে প্রথম থাকলে আজ একবার পয়েন্ট */
  useEffect(() => {
    if (activeStep !== 3) return;
    const id = window.setTimeout(() => {
      const gained = awardLearnStepIfFirstToday("motion");
      if (gained > 0) {
        setPointsToast(
          `+${toBengaliDigits(gained)} হিকমাহ পয়েন্ট · ধাপ ৩ যুক্তবর্ণ`,
        );
      }
    }, 500);
    return () => window.clearTimeout(id);
  }, [activeStep]);

  const markMissionDone = useCallback(() => {
    const meta = completeTodayMissionWithMeta();
    setLearn(meta.state);
    const gained = awardLearnStepIfFirstToday("mission");
    if (gained > 0) {
      setPointsToast(
        `+${toBengaliDigits(gained)} হিকমাহ পয়েন্ট · আজকের মিশন টিক হয়েছে`,
      );
    }
  }, []);

  const goNext = useCallback(() => {
    setActiveStep((prev) => {
      if (prev >= 4) return prev;
      const n = (prev + 1) as StepId;
      if (n === 1 && prev !== 1) {
        setSoundboardEpoch((e) => e + 1);
        setSoundCycleDone(false);
      }
      return n;
    });
  }, []);

  const goPrev = useCallback(() => {
    setActiveStep((prev) => {
      if (prev <= 1) return prev;
      const n = (prev - 1) as StepId;
      if (n === 1 && prev !== 1) {
        setSoundboardEpoch((e) => e + 1);
        setSoundCycleDone(false);
      }
      return n;
    });
  }, []);

  const replayMotion = useCallback(() => {
    setMotionReplayKey((k) => k + 1);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="mb-6 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          শেখা — সহজে, ধাপে ধাপে
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
          <strong className="font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
            এই পৃষ্ঠায় খুললেই চার ধাপে শেখা চলে —
          </strong>{" "}
          প্রথমে হিজাই হরফ স্পষ্ট নাম ও উচ্চারণ, তারপর ছবিমিল খেলা, তারপর লাম–আলিফ, শেষে আজকের এক লাইন
          আর স্ট্রিক। আরও অনুশীলনে:{" "}
          <Link
            href="/learn/games"
            className="font-semibold text-[var(--islamic-teal-deep)] underline-offset-4 hover:underline dark:text-amber-200/95"
          >
            খেলার তালিকা
          </Link>
          ।
        </p>
      </header>

      {/* ধাপ ইন্ডিকেটর */}
      <nav
        id="daily-flow"
        className="mb-8 scroll-mt-24 rounded-2xl border border-[var(--islamic-teal)]/18 bg-white/75 p-3 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/45"
        aria-label="চার ধাপে আজকের শেখা"
      >
        <ol className="flex flex-wrap items-center justify-center gap-2 sm:justify-between sm:gap-3">
          {STEPS.map((step, i) => (
            <li key={step.id} className="flex flex-1 items-center gap-2 sm:min-w-0">
              <button
                type="button"
                onClick={() => goStep(step.id)}
                aria-current={activeStep === step.id ? "step" : undefined}
                className={`flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 text-center font-[family-name:var(--font-bn)] text-xs font-semibold transition sm:text-sm ${
                  activeStep === step.id
                    ? "bg-[var(--islamic-teal-deep)] text-white shadow-md ring-2 ring-[var(--islamic-gold)]/45 dark:bg-teal-800"
                    : "bg-[var(--islamic-parchment)]/70 text-[var(--islamic-teal-deep)] hover:brightness-95 dark:bg-teal-900/40 dark:text-teal-100"
                }`}
              >
                <span className="leading-tight">{step.short}</span>
              </button>
              {i < STEPS.length - 1 ? (
                <span
                  className="hidden text-[var(--islamic-gold)]/60 sm:inline"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-center font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
          এখন আপনি: {STEPS.find((s) => s.id === activeStep)?.label}
        </p>
        {pointsToast ? (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-[var(--islamic-gold)]/55 bg-[var(--islamic-gold)]/25 px-4 py-2 text-center font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:border-amber-600/45 dark:bg-amber-900/35 dark:text-amber-100"
          >
            {pointsToast}{" "}
            <span className="block text-xs font-normal opacity-90">
              ওয়ালেটে জমা হয়েছে — &quot;ওয়ালেট&quot; মেনু থেকে দেখুন।
            </span>
          </motion.p>
        ) : null}
      </nav>

      {/* ধাপ ১ · হরফ টিপে নাম ও উচ্চারণ */}
      {activeStep === 1 ? (
        <section className="mb-10 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/85 p-5 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/50">
          <h2 className="mb-2 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
            ১ম সূত্র — আরবী বর্ণমালা · তিনটি সারিতে উনত্রিশ টি একক হরফ
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-400/92">
          <p className="mb-5 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-400/92">
            তিন সারি বারো, দশ ও সাত খানায় মোট ২৯ টি হরফ; শেষ সারিতে و ه ء ي । ডান থেকে বাম মিলিয়ে দেখুন আরবি পড়ার দিক । টিপুন — আনুষ্ঠানিক আরবি নাম ও বাংলা সহায়ক লেখা; আরবি ভয়েস না থাকলে বাংলায় শুনুন । নীচে হরকত ও তানউইনের ডেমো; খাতার সম্পূর্ণ কাজ শিক্ষকের নির্দেশ । সব বোতাম একবার করে টিপা হলেই পরের ধাপ খুলবে বা বোতাম চাপুন ।
          </p>
          </p>
          <HijaiLetterSoundboard
            key={soundboardEpoch}
            letters={HIJAI_LETTERS}
            onFirstFullCoverage={() => setSoundCycleDone(true)}
          />
          <TajweedBatchInspiredPractice />
          <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-[var(--islamic-teal)]/10 pt-5 dark:border-teal-800/30">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="rounded-lg border border-[var(--islamic-teal)]/20 px-4 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] opacity-40 dark:border-teal-800/35 dark:text-teal-500"
            >
              এখানে আগের ধাপ নেই
            </button>
            <button
              type="button"
              disabled={!soundCycleDone}
              onClick={() => goStep(2)}
              className="rounded-lg bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-800"
            >
              পরের ধাপে যান · মিলিয়ে খেলা
            </button>
          </div>
          <p className="mt-4 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-500">
            টানা শেখার দিন: {toBengaliDigits(learn.streak)} · হরফ ধাপে আজই প্রথমবার সম্পূর্ণ হলে
            +{toBengaliDigits(REWARD_AMTS.hijai_listen)} হিকমাহ পর্যন্ত (দিনে একবার) ।
          </p>
        </section>
      ) : null}

      {/* ধাপ ২ */}
      {activeStep === 2 ? (
        <section className="mb-10 rounded-xl border border-[var(--islamic-teal)]/15 bg-white/80 p-5 dark:border-teal-800/40 dark:bg-teal-950/40">
          <div className="mb-4">
            <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold">
              চারটি হরফ — টেনে মিলান, টিপেও মিলান
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                role="radio"
                aria-checked={bankOrder === "shuffle"}
                onClick={() => setBankOrder("shuffle")}
                className={`rounded-xl border px-3 py-1.5 font-[family-name:var(--font-bn)] text-xs font-semibold transition ${
                  bankOrder === "shuffle"
                    ? "border-[var(--islamic-gold)]/70 bg-[var(--islamic-gold)]/20 text-[var(--islamic-teal-deep)] dark:border-amber-500/65 dark:bg-amber-900/35 dark:text-amber-100"
                    : "border-[var(--islamic-teal)]/20 bg-white/80 text-[var(--islamic-teal-deep)] hover:border-[var(--islamic-teal)]/45 dark:border-teal-800/55 dark:bg-teal-950/50"
                }`}
              >
                আধুনিক · হরফ ব্যাঙ্ক এলোমেলো
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={bankOrder === "hijai"}
                onClick={() => setBankOrder("hijai")}
                className={`rounded-xl border px-3 py-1.5 font-[family-name:var(--font-bn)] text-xs font-semibold transition ${
                  bankOrder === "hijai"
                    ? "border-[var(--islamic-gold)]/70 bg-[var(--islamic-gold)]/20 text-[var(--islamic-teal-deep)] dark:border-amber-500/65 dark:bg-amber-900/35 dark:text-amber-100"
                    : "border-[var(--islamic-teal)]/20 bg-white/80 text-[var(--islamic-teal-deep)] hover:border-[var(--islamic-teal)]/45 dark:border-teal-800/55 dark:bg-teal-950/50"
                }`}
              >
                ক্লাসিক · হিজাই ক্রমে সাজানো ব্যাঙ্ক
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
              আগে মুখস্থ করার চাপ নেই। শুধু{" "}
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/95">চারটা</strong> হরফ{" "}
              <span dir="rtl" className="[font-family:var(--font-quran-ar)] font-semibold">
                {"أ، ب، ت، ث"}
              </span>
              : যে ছবি আর যে খালি বাক্স <strong className="text-[var(--islamic-teal-deep)] dark:text-teal-200">এক আকারের</strong>, সেখানে
              একই সারির হরফ বসে। আরবি শব্দটা দেখুন — সাধারণত{" "}
              <strong className="text-[var(--islamic-teal-deep)] dark:text-teal-200">শুরুর হরফটাই</strong> মিল।
              নিচের হরফ টানুন বা টিপে খালি ঘরে পাঠান। বাকি হরফ{" "}
              <Link
                href="/learn/games/extra-alphabet"
                className="font-semibold text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-300"
              >
                আলাদা পেজে
              </Link>
              , ধীরে ধীরে। আজ প্রথমবার সেশন শেষ করলে{" "}
              <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/95">
                +{toBengaliDigits(REWARD_AMTS.alphabet)} হিকমাহ
              </strong>
              ; তারপর পরের ধাপ আসবে।
            </p>
          </div>

          <AlphabetDragExercise
            pairs={PAIRS}
            bankOrder={bankOrder}
            onSolved={() => setDailyAlphabetDone(true)}
            onReset={() => setDailyAlphabetDone(false)}
          />

          {dailyAlphabetDone ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4 rounded-xl border border-green-600/25 bg-green-600/10 px-4 py-3 dark:bg-green-500/15"
            >
              <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-green-800 dark:text-green-300">
                দারুণ! চারটা মিল ঠিক আছে। একটু পরেই লাম–আলিফের ধাপ নিজে খুলে যাবে; চাইলে নিচের বোতামেও
                যেতে পারেন।
              </p>
              <button
                type="button"
                onClick={() => goStep(3)}
                className="w-full rounded-xl border border-green-700/30 bg-white/90 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-green-900 shadow-sm hover:bg-white dark:border-green-600/40 dark:bg-teal-950/80 dark:text-green-200 sm:w-auto sm:px-6"
              >
                লাম–আলিফের ধাপে যান
              </button>
            </motion.div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-lg border border-[var(--islamic-teal)]/30 px-4 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal-deep)] hover:bg-[var(--islamic-parchment)]/60 dark:border-teal-700/50 dark:text-teal-200"
            >
              ← পূর্ববর্তী ধাপ
            </button>
            {!dailyAlphabetDone ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg px-4 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-300"
              >
                পরের ধাপ (শুধু দেখব)
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ধাপ ৩ — বড় মোশন স্টেজ + Framer Motion উল্লেখ */}
      {activeStep === 3 ? (
        <section className="rounded-2xl border-2 border-[var(--islamic-gold)]/45 bg-gradient-to-b from-white/95 to-[var(--islamic-parchment)]/80 p-6 shadow-lg dark:border-amber-700/45 dark:from-teal-950/90 dark:to-teal-950/60 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100 sm:text-xl">
                লাম + আলিফ = যুক্ত আকার{" "}
                <span dir="rtl" className="font-[family-name:var(--font-quran-ar)]">
                  (لا)
                </span>
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
                কুরআনে বার বার এই মিল দেখবেন। নিচে চলতে থাকা ছবিতে দুটি হরফ কাছে এসে এক রূপ নিচ্ছে
                — শুধু লক্ষ্য করুন, মুখস্থ করার চাপ নেই। আজ প্রথমবার এই ধাপে এলে{" "}
                <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/95">
                  +{toBengaliDigits(REWARD_AMTS.motion)} হিকমাহ
                </strong>{" "}
                যোগ হতে পারে। আবার দেখতে “চালান আবার” চাপুন।
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <span className="inline-flex items-center rounded-full border border-[var(--islamic-gold)]/55 bg-[var(--islamic-teal-deep)]/90 px-4 py-1.5 font-[family-name:var(--font-bn)] text-[10px] font-semibold text-[var(--islamic-gold)] dark:bg-teal-900/90">
                শুধু দেখা — পরীক্ষা নয়
              </span>
              <button
                type="button"
                onClick={replayMotion}
                className="rounded-xl border-2 border-[var(--islamic-teal)]/35 bg-white px-5 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] shadow-sm hover:bg-[var(--islamic-parchment)] dark:border-teal-700/50 dark:bg-teal-900/80 dark:text-teal-50"
              >
                ছবিটা আবার চালান
              </button>
            </div>
          </div>

          <div
            key={motionReplayKey}
            className="relative overflow-hidden rounded-2xl border border-[var(--islamic-teal)]/20 bg-white/90 py-10 dark:border-teal-800/50 dark:bg-teal-950/70"
          >
            <p className="absolute left-4 top-3 font-[family-name:var(--font-bn)] text-[10px] font-medium text-[var(--islamic-teal)]/55 dark:text-teal-500">
              নরম গতিতে — বুঝতে সুবিধা
            </p>
            <motion.div
              className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 px-4 pt-6 sm:gap-10"
              variants={motionStageVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                variants={motionGlyphVariants}
                className="rounded-2xl bg-teal-800/12 px-8 py-6 text-7xl shadow-inner dark:bg-teal-500/15 sm:text-8xl"
                dir="rtl"
              >
                ل
              </motion.span>
              <motion.span
                variants={motionGlyphVariants}
                className="select-none text-4xl text-[var(--islamic-gold)] sm:text-5xl"
              >
                +
              </motion.span>
              <motion.span
                variants={motionGlyphVariants}
                className="rounded-2xl bg-teal-800/12 px-8 py-6 text-7xl shadow-inner dark:bg-teal-500/15 sm:text-8xl"
                dir="rtl"
              >
                ا
              </motion.span>
              <motion.span
                variants={motionGlyphVariants}
                className="select-none text-4xl text-[var(--islamic-gold)] sm:text-5xl"
              >
                →
              </motion.span>
              <motion.div
                variants={motionFusionVariants}
                layoutId="lam-alif-fusion"
                className="rounded-2xl border-4 border-[var(--islamic-gold)]/70 bg-[var(--islamic-parchment)] px-10 py-7 text-8xl shadow-2xl dark:border-amber-400/50 dark:bg-teal-950/90 sm:px-14 sm:py-10 sm:text-9xl"
                dir="rtl"
              >
                لا
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-lg border border-[var(--islamic-teal)]/30 px-4 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal-deep)] hover:bg-white/80 dark:border-teal-700/50 dark:text-teal-200 dark:hover:bg-teal-900/50"
            >
              ← আগের ধাপ (মিল খেলা)
            </button>
            <button
              type="button"
              onClick={() => goStep(4)}
              className="w-full rounded-xl bg-[var(--islamic-teal-deep)] px-4 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow hover:brightness-110 dark:bg-teal-800 sm:w-auto"
            >
              এরপর · আজকের মিশন ও স্ট্রিক টিক দিন →
            </button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-[var(--islamic-teal)]/10 pt-4 dark:border-teal-800/35">
            <button
              type="button"
              onClick={() => goStep(1)}
              className="font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-300"
            >
              হরফ টিপে শোনা শুরুর ধাপে ফিরুন
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--islamic-teal)]/25 bg-white/70 px-4 py-3 dark:border-teal-700/40 dark:bg-teal-950/40">
            <p className="font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
              আরও হরফ ও যুক্তবর্ণ ধীরে ধীরে — একদিনে সব নয়।
            </p>
            <Link
              href="/learn/games"
              className="mt-2 inline-flex items-center font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] underline-offset-4 hover:underline dark:text-amber-200/95"
            >
              আরও খেলা ও অনুশীলন →
            </Link>
          </div>
        </section>
      ) : null}

      {/* ধাপ ৪ · আজকের মিশন ও স্ট্রিক */}
      {activeStep === 4 ? (
        <section className="mb-10 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/85 p-5 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/50">
          <p className="mb-3 rounded-lg border border-[var(--islamic-teal)]/15 bg-[var(--islamic-parchment)]/60 px-3 py-2 font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal-deep)] dark:border-teal-800/40 dark:bg-teal-900/35 dark:text-teal-100">
            <strong className="font-semibold">আজকের চূড়ান্ত টিক:</strong> এক লাইন পড়ে নিন, টিক চাপুন —
            টানা শেখার দিন বাড়বে ও হিকমাহ মিলতে পারে।
          </p>
          <h2 className="mb-3 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
            ছোট কাজ (
            {mission ? toBengaliDigits(mission.minutes) : toBengaliDigits(10)} মিনিটের মতো)
          </h2>
          <p className="font-[family-name:var(--font-bn)] text-[var(--islamic-ink)] dark:text-teal-50/95">
            {mission?.title ?? "মিশন লোড হচ্ছে…"}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={markMissionDone}
              className="rounded-lg bg-[var(--islamic-teal-deep)] px-4 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow hover:brightness-110 dark:bg-teal-800"
            >
              হয়ে গেছে — আজকের কাজ টিক দিন
            </button>
            <span className="font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-teal-deep)] dark:text-amber-200/95">
              টানা শেখার দিন: {toBengaliDigits(learn.streak)}
            </span>
          </div>
          <p className="mt-3 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
            আজ প্রথমবার এই টিক থেকে এক দিনের মধ্যে{" "}
            <strong className="text-[var(--islamic-teal-deep)] dark:text-amber-200/95">
              +{toBengaliDigits(REWARD_AMTS.mission)} হিকমাহ
            </strong>{" "}
            । বিস্তারিত ওয়ালেটে।
          </p>
          <div className="mt-6 border-t border-[var(--islamic-teal)]/10 pt-5 dark:border-teal-800/30">
            <Link
              href="/wallet"
              className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] underline-offset-4 hover:underline dark:text-amber-200/95"
            >
              ওয়ালেট খুলুন →
            </Link>
          </div>
        </section>
      ) : null}

      <details className="mt-12 rounded-2xl border border-[var(--islamic-teal)]/20 bg-white/60 dark:border-teal-800/45 dark:bg-teal-950/35">
        <summary className="cursor-pointer list-none px-4 py-3 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100 [&::-webkit-details-marker]:hidden">
          শেখার পুরো মানচিত্র · পরের পর্বসমূহ (খুললে লম্বা)
        </summary>
        <div className="border-t border-[var(--islamic-teal)]/10 px-3 pb-4 pt-3 dark:border-teal-800/35">
          <LearnPathMasterPlan streak={learn.streak} />
        </div>
      </details>

      {/* নিচের দিকে দ্রুত ধাপ পরিবর্তন (মোবাইল ফ্রেন্ডলি) */}
      <div className="mt-10 flex justify-center gap-3 border-t border-[var(--islamic-teal)]/12 pt-6 dark:border-teal-800/35">
        <button
          type="button"
          disabled={activeStep <= 1}
          onClick={goPrev}
          className="rounded-xl border border-[var(--islamic-teal)]/25 px-4 py-2 font-[family-name:var(--font-bn)] text-sm disabled:opacity-40 dark:border-teal-800/50"
        >
          পূর্ববর্তী
        </button>
        {activeStep === 4 ? (
          <Link
            href="/learn/games"
            className="rounded-xl bg-[var(--islamic-teal-deep)] px-5 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white hover:brightness-110 dark:bg-teal-800"
          >
            আরও খেলা ও অনুশীলন →
          </Link>
        ) : (
          <button
            type="button"
            disabled={activeStep >= 4}
            onClick={goNext}
            className="rounded-xl bg-[var(--islamic-teal-deep)] px-5 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white disabled:opacity-40 dark:bg-teal-800"
          >
            পরবর্তী ধাপ
          </button>
        )}
      </div>
    </div>
  );
}
