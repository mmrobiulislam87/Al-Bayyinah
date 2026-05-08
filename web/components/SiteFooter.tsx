import Link from "next/link";

/**
 * সাইট-wide পাদ দপ্তর — গভীর সবুজ ভিত্তি ও স্বীকৃতি।
 */
export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-[var(--islamic-gold)]/55 bg-[var(--islamic-teal-deep)] text-teal-100/95">
      <div className="mx-auto w-full max-w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 font-[family-name:var(--font-bn)]">
            <p className="text-sm font-medium text-white">দ্রুত লিংক</p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link
                href="/"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                হোম ও অনুসন্ধান
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/juz"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                জুজ
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/hizb"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                হিযব
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/bookmarks"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                বুকমার্ক
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/research"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                রিসার্চ
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/research/lab"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                গবেষণাগার
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/research/tafsir"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                তাফসীর হাব
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/learn"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                শেখা
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/tutor"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                ভয়েস
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/wallet"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                ওয়ালেট
              </Link>
              <span className="text-teal-500">|</span>
              <Link
                href="/donors"
                className="text-[var(--islamic-gold)] decoration-[var(--islamic-gold)]/40 underline-offset-4 transition-colors hover:text-amber-200 hover:underline"
              >
                ডোনার
              </Link>
            </nav>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-teal-200/75 font-[family-name:var(--font-bn)]">
            ডেটার আরবি ও অনুবাদ অন্য উৎস থেকে মিলিয়ে যোগ করা হয়েছে। বিস্তারিত স্বীকৃতি
            প্রজেক্টের{" "}
            <a
              href="https://github.com/risan/quran-json"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--islamic-gold)] underline-offset-2 hover:text-amber-200 hover:underline"
            >
              quran-json
            </a>{" "}
            — রিপোজিটরির লাইসেন্স দেখুন।
          </p>
        </div>
        <p className="mt-6 border-t border-teal-700/80 pt-4 text-center text-[0.7rem] text-teal-300/60">
          আল হামদু লিল্লাহ · শান্ত মনে কুরআন পড়ুন
        </p>
      </div>
    </footer>
  );
}
