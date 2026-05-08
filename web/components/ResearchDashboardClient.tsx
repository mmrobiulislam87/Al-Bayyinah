"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { toBengaliDigits } from "@/lib/numberBn";

import ResearchResourcesPanel from "@/components/ResearchResourcesPanel";

type ConcordanceHit = {
  surah: number;
  ayah: number;
  verseKey: string;
  arabicLine: string;
  matchIndices: number[];
  matched: {
    index: number;
    uthmani: string;
    glossBn: string;
    glossEn: string;
    transliteration: string;
  }[];
};

export default function ResearchDashboardClient() {
  const [needle, setNeedle] = useState("صلاة");
  const [tokenMode, setTokenMode] = useState<"partial" | "exact">("partial");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [makki, setMakki] = useState(0);
  const [madani, setMadani] = useState(0);
  const [concordance, setConcordance] = useState<ConcordanceHit[]>([]);

  const chartData = useMemo(
    () => [
      { name: "মক্কী সূরা", count: makki },
      { name: "মাদানী সূরা", count: madani },
    ],
    [makki, madani],
  );

  const run = useCallback(async () => {
    const t = needle.trim();
    if (!t) {
      setMakki(0);
      setMadani(0);
      setConcordance([]);
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const wfUrl = new URL("/api/research/word-frequency", window.location.origin);
      wfUrl.searchParams.set("needle", t);
      const ccUrl = new URL("/api/research/concordance", window.location.origin);
      ccUrl.searchParams.set("q", t);
      ccUrl.searchParams.set("mode", tokenMode);
      ccUrl.searchParams.set("limit", "800");

      const [wfRes, ccRes] = await Promise.all([
        fetch(wfUrl.toString()),
        fetch(ccUrl.toString()),
      ]);
      if (!wfRes.ok) throw new Error(String(wfRes.status));
      if (!ccRes.ok) throw new Error(String(ccRes.status));
      const wf = (await wfRes.json()) as { makki?: number; madani?: number };
      const cc = (await ccRes.json()) as { hits?: ConcordanceHit[] };
      setMakki(Number(wf.makki ?? 0));
      setMadani(Number(wf.madani ?? 0));
      setConcordance(Array.isArray(cc.hits) ? cc.hits : []);
    } catch {
      setErr("ডাটা আনা যায়নি। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }, [needle, tokenMode]);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <header className="mb-8 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          রিসার্চ ড্যাশবোর্ড
        </h1>
        <p className="mt-1 text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
          হোমের অনুসন্ধানে মিলিত আয়াত, এই পৃষ্ঠায় টোকেন-ফ্রিকোয়েন্সি আর আয়াত-ভিত্তিক
          কনকর্ডেন্স (প্রতিটি মিলে সূরা-আয়াত, পূর্ণ উথমানী লাইন ও শব্দ সূচী)। নিচে
          বাহ্যিক গবেষণা সম্পদের তালিকা।
        </p>
        <p className="mt-3">
          <Link
            href="/research/lab"
            className="inline-flex rounded-lg border border-[var(--islamic-gold)]/40 bg-[var(--islamic-teal)]/10 px-3 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] transition hover:bg-[var(--islamic-teal)]/18 dark:border-amber-700/45 dark:bg-teal-900/35 dark:text-teal-100 dark:hover:bg-teal-900/50"
          >
            কোরআন গবেষণাগার — মাস্টার মডিউল ও রোডম্যাপ হাব
          </Link>
        </p>
      </header>

      <section className="mb-8 rounded-xl border border-[var(--islamic-teal)]/18 bg-white/85 p-4 shadow-sm dark:border-teal-800/45 dark:bg-teal-950/50">
        <label
          htmlFor="needle"
          className="mb-2 block font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200"
        >
          আরবি শব্দ বা অংশ (উথমানী টেক্সটের সাথে মেলানো হয়)
        </label>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="needle"
              dir="rtl"
              value={needle}
              onChange={(e) => setNeedle(e.target.value)}
              className="min-h-[44px] flex-1 rounded-lg border border-[var(--islamic-teal)]/25 bg-white px-3 py-2 text-lg outline-none ring-[var(--islamic-teal)]/15 focus:ring-2 dark:border-teal-700/50 dark:bg-teal-950/70 dark:text-teal-50"
              placeholder="مثلاً صلاة"
            />
            <button
              type="button"
              onClick={() => void run()}
              disabled={busy}
              className="rounded-lg bg-[var(--islamic-teal-deep)] px-5 py-2.5 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:opacity-60 dark:bg-teal-800"
            >
              {busy ? "হিসাব…" : "আপডেট (গ্রাফ + কনকর্ডেন্স)"}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
            <span className="font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
              টোকেন মিলের ধরন:
            </span>
            <label className="inline-flex cursor-pointer items-center gap-1.5">
              <input
                type="radio"
                name="tokmode"
                checked={tokenMode === "partial"}
                onChange={() => setTokenMode("partial")}
              />
              আংশিক (রুটময় প্যাটার্ন/সাবস্ট্রিং)
            </label>
            <label className="inline-flex cursor-pointer items-center gap-1.5">
              <input
                type="radio"
                name="tokmode"
                checked={tokenMode === "exact"}
                onChange={() => setTokenMode("exact")}
              />
              ঠিক টোকেন (নর্মালাইজড সম্পূর্ণ মিল)
            </label>
          </div>
        </div>
        {err ? (
          <p className="mt-3 text-sm text-red-700 dark:text-red-400">{err}</p>
        ) : null}
      </section>

      <section className="rounded-xl border border-[var(--islamic-teal)]/15 bg-white/80 p-4 shadow-inner dark:border-teal-800/40 dark:bg-teal-950/40">
        <h2 className="mb-4 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
          শব্দ ব্যবহারের গ্রাফ
        </h2>
        <div className="h-72 w-full min-h-[288px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) =>
                  value === undefined
                    ? [ "", "" ]
                    : [toBengaliDigits(Number(value)), "টোকেন মিল"]
                }
              />
              <Bar dataKey="count" fill="var(--islamic-teal-deep)" radius={[6, 6, 0, 0]} name="সংখ্যা" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
          মোট টোকেন মিল:{" "}
          <span className="font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-200">
            {toBengaliDigits(makki + madani)}
          </span>{" "}
          (মক্কী {toBengaliDigits(makki)}, মাদানী {toBengaliDigits(madani)})
        </p>
        <p className="mt-2 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
          সূরা মক্কী/মাদানী শ্রেণি নির্ণয়ে ভিন্ন মত থাকতে পারে; ফলটি গবেষণার প্রাথমিক সূচক।
        </p>
      </section>

      <section className="mb-8 rounded-xl border border-[var(--islamic-teal)]/15 bg-white/80 p-4 shadow-inner dark:border-teal-800/40 dark:bg-teal-950/40">
        <h2 className="mb-2 font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
          আয়াত-কনকর্ডেন্স (টোকেন সূচী সহ)
        </h2>
        <p className="mb-3 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
          প্রতিটি সারিতে কোন শব্দ সূচীতে মিলেছে, বাংলা/ইংরেজি গজ ও প্রতিবর্ণ — একই
          কোয়েরিতে ফ্রিকোয়েন্সি গ্রাফের সাথে যাচাই করুন। আনুষ্ঠানিক আরবি মূল (root)
          ট্যাগ পরবর্তী মরফো ইমপোর্টের পর যোগ করা যাবে।
        </p>
        {concordance.length === 0 ? (
          <p className="font-[family-name:var(--font-bn)] text-sm text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
            উপরে আরবি লিখে আপডেট চাপুন।
          </p>
        ) : (
          <ul className="max-h-[min(70vh,560px)] space-y-3 overflow-y-auto pr-1">
            {concordance.map((h) => (
              <li
                key={h.verseKey}
                className="rounded-lg border border-[var(--islamic-teal)]/12 bg-white/90 p-3 dark:border-teal-800/35 dark:bg-teal-950/55"
              >
                <div className="mb-1 flex flex-wrap items-baseline gap-2 font-[family-name:var(--font-bn)] text-xs font-semibold text-[var(--islamic-teal-deep)] dark:text-amber-200">
                  <span>
                    {toBengaliDigits(h.surah)}:{toBengaliDigits(h.ayah)}
                  </span>
                  <span className="font-normal text-[var(--islamic-ink-soft)] dark:text-teal-400/85">
                    শব্দ ক্রম{" "}
                    {h.matchIndices.map((i) => toBengaliDigits(i + 1)).join(", ")}
                  </span>
                </div>
                <p
                  dir="rtl"
                  className="mb-2 text-lg leading-relaxed text-[var(--islamic-ink)] dark:text-teal-50"
                >
                  {h.arabicLine}
                </p>
                <ul className="space-y-1.5 border-t border-[var(--islamic-teal)]/10 pt-2 dark:border-teal-800/30">
                  {h.matched.map((w) => (
                    <li
                      key={`${h.verseKey}-${w.index}`}
                      className="font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink)] dark:text-teal-100/90"
                    >
                      <span className="font-semibold text-[var(--islamic-teal)] dark:text-teal-300">
                        [{toBengaliDigits(w.index + 1)}]
                      </span>{" "}
                      <span dir="rtl" className="text-base">
                        {w.uthmani}
                      </span>
                      {" — "}
                      <span className="text-[var(--islamic-ink-soft)] dark:text-teal-400/90">
                        {w.glossBn || w.glossEn}
                        {w.transliteration ? ` (${w.transliteration})` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ResearchResourcesPanel />
    </div>
  );
}
