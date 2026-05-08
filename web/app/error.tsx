"use client";

/**
 * রুট সেগমেন্ট এরর বাউন্ডারি।
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-4 bg-[var(--islamic-cream)] p-6 text-[var(--islamic-ink)]">
      <h1 className="font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)]">
        কিছু ভুল হয়েছে
      </h1>
      <pre className="max-w-lg overflow-auto rounded-xl border border-[var(--islamic-teal)]/15 bg-white p-4 text-xs text-red-800 shadow-md">
        {error.message}
      </pre>
      {error.digest ? (
        <p className="text-xs text-[var(--islamic-ink-soft)]">
          digest: {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl border border-[var(--islamic-teal)]/30 bg-white px-4 py-2 text-sm font-medium text-[var(--islamic-teal)] shadow-sm transition-colors hover:border-[var(--islamic-gold)]/50 hover:bg-[var(--islamic-parchment)]"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}
