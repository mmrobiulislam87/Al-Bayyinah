import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";

/**
 * সাইট-wide শীর্ষ বার — ইসলামি সবুজ ও সোনালি অ্যাকসেন্ট।
 */
export default function SiteHeader() {
  return (
    <header className="relative border-b-2 border-[var(--islamic-gold)] bg-gradient-to-b from-[var(--islamic-teal)] to-[var(--islamic-teal-deep)] text-white shadow-[0_4px_24px_-4px_rgba(15,76,68,0.45)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(105deg,transparent,transparent_12px,rgba(255,255,255,0.12)_12px,rgba(255,255,255,0.12)_13px)] opacity-[0.08]"
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-full flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5 sm:px-6 sm:py-5 lg:px-8 xl:px-10">
        <Link
          href="/"
          className="group flex min-h-11 touch-manipulation flex-col items-center gap-0.5 sm:min-h-0 sm:items-start"
        >
          <p
            className="text-xl leading-none text-[var(--islamic-gold)] [font-family:var(--font-quran-ar)] transition-colors group-hover:brightness-110 sm:text-2xl"
            dir="rtl"
          >
            الْقُرْآنُ
          </p>
          <span className="font-[family-name:var(--font-bn)] text-lg font-semibold tracking-wide text-white sm:text-xl">
            আল কুরআন
          </span>
        </Link>
        <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:items-end">
          <nav
            className="flex max-w-full flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm font-[family-name:var(--font-bn)] sm:justify-end sm:gap-x-2 sm:text-base"
            aria-label="প্রধান মেনু"
          >
            <Link
              href="/juz"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              জুজ
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/hizb"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              হিযব
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/bookmarks"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              বুকমার্ক
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/research"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              রিসার্চ
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/research/lab"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              গবেষণাগার
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/research/tafsir"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              তাফসীর
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/learn"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              শেখা
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/tutor"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              ভয়েস
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/wallet"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              ওয়ালেট
            </Link>
            <span className="text-teal-500">·</span>
            <Link
              href="/donors"
              className="min-h-11 touch-manipulation rounded-md px-3 py-2 text-teal-100/95 underline-offset-4 hover:text-amber-200 hover:underline sm:min-h-0 sm:px-2 sm:py-1.5"
            >
              ডোনার
            </Link>
            <span className="text-teal-500">·</span>
            <ThemeToggle />
          </nav>
          <p className="max-w-md text-center text-sm leading-relaxed text-teal-100/95 sm:text-right sm:text-base font-[family-name:var(--font-bn)]">
            অনুসন্ধান · রিসার্চ · গবেষণাগার · শেখা · ভয়েস · ওয়ালেট — বহুভাষায় কুরআন
          </p>
        </div>
      </div>
    </header>
  );
}
