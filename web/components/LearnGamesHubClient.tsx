"use client";

import Link from "next/link";

export default function LearnGamesHubClient() {
  const cards = [
    {
      href: "/learn",
      title: "দৈনিক তিন ধাপ",
      desc: "মূল «শেখা» পেজে বড় ছবি, দ্রুত শুরু ও আজকের তিন ধাপ এক জায়গায়।",
      cta: "শেখার মূল পেজ খুলুন",
      accent:
        "border-[var(--islamic-teal)]/30 bg-white/85 dark:border-teal-800/45 dark:bg-teal-950/45",
    },
    {
      href: "/learn/games/extra-alphabet",
      title: "সম্পূর্ণ হরফ — চার রাউন্ড",
      desc: "হিজাই ক্রমে ২৮টি আলাদা হরফ। ছবি ও আরবি শব্দ একই হরফ দিয়ে শুরু। প্রতি রাউন্ডে সাতটি করে খেলা; রাউন্ড শেষে দৈনিক একবার করে হিকমাহ পয়েন্ট।",
      cta: "২৮ হরফের অনুশীলন খুলুন",
      accent:
        "border-[var(--islamic-gold)]/40 bg-[var(--islamic-parchment)]/50 dark:border-amber-700/45 dark:bg-teal-950/55",
    },
    {
      href: "/learn/games/ligatures",
      title: "যুক্তবর্ণ গ্যালারি",
      desc: "একাধিক লাম–আলিফ, ইয়া–আলিফ ইত্যাদি উদাহরণ স্লাইডে দেখুন। শেষ স্লাইডে দৈনিক পুরস্কার।",
      cta: "গ্যালারি খুলুন",
      accent:
        "border-[var(--islamic-teal-deep)]/35 bg-white/90 dark:border-teal-700/40 dark:bg-teal-950/60",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-[var(--islamic-ink)] dark:text-teal-100/95">
      <nav className="mb-6 font-[family-name:var(--font-bn)] text-sm">
        <Link
          href="/learn"
          className="text-[var(--islamic-teal)] underline-offset-4 hover:underline dark:text-teal-400"
        >
          ← শেখার মূল পেজ
        </Link>
      </nav>

      <header className="mb-10 border-b border-[var(--islamic-gold)]/35 pb-4 dark:border-amber-800/35">
        <h1 className="font-[family-name:var(--font-bn)] text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
          আরও খেলা ও অনুশীলন
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
          মূল পেজে তিন ধাপ শেষ করলেই ভিত; এখানে একই ধরনের কাজ আরও হরফ ও যুক্তবর্ণে —{" "}
          <strong className="font-semibold text-[var(--islamic-teal)] dark:text-teal-200">
            একদিনে সব শেষ করার দরকার নেই
          </strong>
          । যেটা মন চায় সেটা বেছে নিন।
        </p>
      </header>

      <ul className="flex flex-col gap-5">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className={`block rounded-2xl border-2 p-5 shadow-sm transition hover:brightness-[1.02] dark:hover:brightness-110 sm:p-6 ${c.accent}`}
            >
              <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
                {c.title}
              </h2>
              <p className="mt-2 font-[family-name:var(--font-bn)] text-sm leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
                {c.desc}
              </p>
              <span className="mt-4 inline-block font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal)] underline-offset-4 dark:text-amber-200/95">
                {c.cta} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
