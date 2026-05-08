import Link from "next/link";

/**
 * ৪০৪ — রুট লেআউটের হেডার/ফুটারের ভিতরে শুধু কন্টেন্ট।
 */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p
        className="font-[family-name:var(--font-quran-ar)] text-3xl text-[var(--islamic-gold)]"
        dir="rtl"
      >
        ﴿
      </p>
      <h1 className="font-[family-name:var(--font-bn)] text-2xl font-semibold text-[var(--islamic-teal-deep)]">
        পৃষ্ঠা পাওয়া যায়নি
      </h1>
      <p className="max-w-md text-sm text-[var(--islamic-ink-soft)]">
        লিংক ভুল হতে পারে, অথবা পৃষ্ঠাটি সরানো হয়েছে। হোম থেকে আবার শুরু করুন।
      </p>
      <Link
        href="/"
        className="rounded-xl border border-[var(--islamic-teal)]/25 bg-[var(--islamic-teal)] px-6 py-2.5 font-[family-name:var(--font-bn)] text-sm font-medium text-white shadow-md transition hover:bg-[var(--islamic-teal-deep)]"
      >
        হোমে ফিরুন
      </Link>
    </div>
  );
}
