import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  { href: "/juz", label: "জুজ" },
  { href: "/hizb", label: "হিযব" },
  { href: "/bookmarks", label: "বুকমার্ক" },
  { href: "/research", label: "রিসার্চ" },
  { href: "/research/lab", label: "গবেষণাগার" },
  { href: "/research/tafsir", label: "তাফসীর" },
  { href: "/learn", label: "শেখা" },
  { href: "/tutor", label: "ভয়েস" },
  { href: "/wallet", label: "ওয়ালেট" },
  { href: "/donors", label: "ডোনার" },
] as const;

/**
 * সাইট-wide শীর্ষ বার — স্টিকি, স্পষ্ট শ্রেণিবিন্যাস, মোবাইল হরিজন্টাল স্ক্রল।
 */
export default function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--islamic-gold)]/35 bg-[var(--islamic-teal)] shadow-[0_1px_0_rgba(212,168,75,0.22),0_12px_40px_-12px_rgba(10,56,50,0.55)] transition-[box-shadow] duration-300 dark:border-[var(--islamic-gold)]/25 dark:shadow-[0_1px_0_rgba(224,184,92,0.15),0_16px_48px_-16px_rgba(0,0,0,0.4)]"
      style={{
        backgroundImage:
          "linear-gradient(165deg, var(--islamic-teal-muted) 0%, var(--islamic-teal) 44%, var(--islamic-teal-deep) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-40%,rgba(255,255,255,0.14),transparent_50%)] dark:bg-[radial-gradient(ellipse_100%_60%_at_80%_0%,rgba(224,184,92,0.08),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.05] [background-image:repeating-linear-gradient(105deg,transparent,transparent_11px,rgba(255,255,255,0.09)_11px,rgba(255,255,255,0.09)_12px)]"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-3 pt-3 sm:gap-4 sm:px-6 sm:pb-4 sm:pt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
        <div className="flex flex-col items-center gap-0.5 sm:items-start lg:min-w-0 lg:flex-shrink-0">
          <Link
            href="/"
            className="group relative flex flex-col items-center gap-1 rounded-xl py-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--islamic-gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--islamic-teal)] sm:items-start sm:focus-visible:ring-offset-[var(--islamic-teal-deep)]"
          >
            <span
              className="absolute -start-1 top-1/2 hidden h-[2.75rem] w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-[var(--islamic-gold-soft)] via-[var(--islamic-gold)] to-[var(--islamic-gold-soft)] opacity-90 shadow-[0_0_12px_rgba(232,201,122,0.35)] sm:block"
              aria-hidden
            />
            <p
              className="text-[1.35rem] leading-none tracking-tight text-[var(--islamic-gold-soft)] [font-family:var(--font-quran-ar)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[color,filter] duration-200 group-hover:text-white group-hover:drop-shadow-[0_0_14px_rgba(232,201,122,0.45)] sm:text-2xl sm:ps-3"
              dir="rtl"
            >
              الْقُرْآنُ
            </p>
            <div className="flex flex-col items-center gap-0 sm:items-start sm:ps-3">
              <span className="font-[family-name:var(--font-bn)] text-base font-semibold tracking-wide text-white sm:text-lg">
                আল কুরআন
              </span>
              <span className="font-[family-name:var(--font-geist-sans)] text-[0.65rem] font-medium uppercase tracking-[0.22em] text-teal-100/80 dark:text-teal-200/75">
                Al-Bayyinah · Read · Search · Study
              </span>
            </div>
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-2 lg:max-w-3xl xl:max-w-none">
          <nav
            className="font-[family-name:var(--font-bn)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex snap-x snap-mandatory items-center gap-1 overflow-x-auto overflow-y-visible pb-1 [-webkit-overflow-scrolling:touch] sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 lg:justify-end"
            aria-label="প্রধান মেনু"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="snap-start whitespace-nowrap rounded-full px-3 py-2 text-[0.8125rem] font-medium text-teal-50/95 outline-none ring-white/0 transition-[color,background-color,box-shadow,transform] duration-200 hover:bg-white/12 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--islamic-gold)]/70 sm:px-3.5 sm:py-1.5 sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
            <span
              className="mx-0.5 hidden h-5 w-px shrink-0 bg-white/20 sm:inline-block"
              aria-hidden
            />
            <div className="flex shrink-0 snap-start items-center ps-1 sm:ps-0">
              <ThemeToggle
                className="rounded-full border-white/30 bg-black/15 px-3.5 py-2 text-[0.8125rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:bg-black/25"
              />
            </div>
          </nav>
          <p className="text-center text-[0.75rem] leading-snug tracking-wide text-teal-100/88 sm:text-[0.8125rem] sm:text-right lg:text-right font-[family-name:var(--font-bn)] dark:text-teal-100/85">
            অনুসন্ধান · রিসার্চ · গবেষণাগার · শেখা · ভয়েস · ওয়ালেট — বহুভাষায় কুরআন
          </p>
        </div>
      </div>
    </header>
  );
}
