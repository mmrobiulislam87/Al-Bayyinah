import type { Metadata } from "next";
import Link from "next/link";

import SurahReadClient from "@/components/SurahReadClient";
import { getSurahMeta } from "@/lib/surahs";

type Props = {
  params: Promise<{ n: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const num = Number.parseInt(n, 10);
  const sm = getSurahMeta(num);
  if (!sm) {
    return { title: "সূরা — আল কুরআন" };
  }
  return {
    title: `${sm.nameBn} (${sm.nameEn}) — আল কুরআন`,
    description: `সূরা ${num}: ${sm.nameBn} — আরবি, বাংলা ও ইংরেজি অনুবাদসহ পাঠ।`,
  };
}

/** ডায়নামিক রাউট: /surah/1 … /surah/114 */
export default async function SurahPage({ params }: Props) {
  const { n } = await params;
  const num = Number.parseInt(n, 10);

  if (!Number.isInteger(num) || num < 1 || num > 114) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[var(--islamic-cream)] p-6">
        <p className="text-center font-[family-name:var(--font-bn)] text-[var(--islamic-ink)]">
          সূরা খুঁজে পাওয়া যায়নি। ১ থেকে ১১৪ এর মধ্যে নম্বর দিন।
        </p>
        <Link
          href="/"
          className="font-[family-name:var(--font-bn)] text-[var(--islamic-teal)] underline decoration-[var(--islamic-gold)]/50 underline-offset-4 hover:text-[var(--islamic-teal-deep)]"
        >
          হোমে ফিরুন
        </Link>
      </div>
    );
  }

  return <SurahReadClient surahNumber={num} />;
}
