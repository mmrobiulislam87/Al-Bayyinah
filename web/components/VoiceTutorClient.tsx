"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { arabicRoughSimilarity } from "@/lib/transcriptCompare";

const DEFAULT_REF =
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

/** টাইপস্ক্রিপ্ট ডম লিবে অনুপস্থিত এজেক্ট টাইপ। */
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export default function VoiceTutorClient() {
  const [reference, setReference] = useState(DEFAULT_REF);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recUrl, setRecUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const score = useMemo(
    () => arabicRoughSimilarity(reference, transcript),
    [reference, transcript],
  );
  const feedback =
    transcript.length === 0
      ? null
      : score >= 0.72
        ? "good"
        : "bad";

  const startListen = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR =
      (
        window as unknown as {
          SpeechRecognition?: new () => SpeechRecognitionLike;
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        }
      ).webkitSpeechRecognition;
    if (!SR) {
      setTranscript("(এই ব্রাউজারে স্পিচ রেকগনিশন নেই — Chrome চেষ্টা করুন)");
      return;
    }
    const rec = new SR();
    rec.lang = "ar-SA";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev) => {
      const r0 = ev.results[0];
      const alt = r0 && r0[0];
      const text = alt?.transcript ?? "";
      setTranscript(text.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }, []);

  const toggleRecord = useCallback(async () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        mediaRecorderRef.current = null;
      };
      mr.start();
    } catch {
      setTranscript("(মাইক্রোফোন অনুমতি দিন)");
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="mb-8 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          AI ভয়েস টিউটর (ডেমো)
        </h1>
        <p className="mt-1 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
          ব্রাউজার স্পিচ-টু-টেক্সট ও রেকর্ডিং। Whisper API পরে সংযুক্ত করুন।
        </p>
      </header>

      <section className="mb-6 space-y-3 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/85 p-4 dark:border-teal-800/45 dark:bg-teal-950/50">
        <label className="block font-[family-name:var(--font-bn)] text-sm font-semibold">
          লক্ষ্য আয়াত (আরবি)
        </label>
        <textarea
          dir="rtl"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[var(--islamic-teal)]/25 bg-white p-3 text-lg dark:bg-teal-950/70 dark:text-teal-50"
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void startListen()}
          disabled={listening}
          className="rounded-lg bg-[var(--islamic-teal-deep)] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-60 dark:bg-teal-800"
        >
          {listening ? "শুনছি…" : "স্পিচ শুনুন"}
        </button>
        <button
          type="button"
          onClick={() => void toggleRecord()}
          className="rounded-lg border border-[var(--islamic-gold)]/55 bg-[var(--islamic-parchment)] px-4 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:bg-teal-900/50 dark:text-teal-100"
        >
          অডিও রেকর্ড
        </button>
      </div>

      <section className="mt-8 rounded-xl border border-[var(--islamic-teal)]/15 bg-white/80 p-4 dark:border-teal-800/40 dark:bg-teal-950/40">
        <h2 className="mb-2 font-[family-name:var(--font-bn)] text-sm font-semibold">
          স্বীকৃত টেক্সট
        </h2>
        <p dir="rtl" className="text-lg leading-relaxed">
          {transcript || "…"}
        </p>
        {feedback === "good" ? (
          <p className="mt-4 rounded-md bg-green-600/15 px-3 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">
            ভালো মিল — চালিয়ে যান (সবুজ)
          </p>
        ) : null}
        {feedback === "bad" ? (
          <p className="mt-4 rounded-md bg-red-600/15 px-3 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">
            আরও অনুশীলন — লাল মার্কার (খসড়া তুলনা)
          </p>
        ) : null}
        <p className="mt-2 text-xs text-[var(--islamic-ink-soft)] dark:text-teal-500/90">
          স্কোর (খসড়া): {(score * 100).toFixed(0)}%
        </p>
      </section>

      {recUrl ? (
        <div className="mt-6">
          <p className="mb-2 font-[family-name:var(--font-bn)] text-sm">রেকর্ডিং প্লেব্যাক</p>
          <audio controls src={recUrl} className="w-full" />
        </div>
      ) : null}
    </div>
  );
}
