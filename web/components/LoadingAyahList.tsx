/**
 * সূরা পৃষ্ঠায় আয়াত লোডের স্কেলেটন।
 */
export default function LoadingAyahList() {
  return (
    <div className="flex flex-col gap-4" aria-busy aria-label="আয়াত লোড হচ্ছে">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-[var(--islamic-teal)]/10 bg-white/70 p-4"
        >
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--islamic-teal)]/15" />
          <div className="h-8 w-full animate-pulse rounded bg-[var(--islamic-teal)]/10" />
          <div className="h-16 w-full animate-pulse rounded bg-[var(--islamic-teal)]/8" />
          <div className="h-12 w-full animate-pulse rounded bg-[var(--islamic-teal)]/8" />
        </div>
      ))}
    </div>
  );
}
