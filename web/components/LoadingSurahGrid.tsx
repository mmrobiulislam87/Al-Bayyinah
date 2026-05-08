/**
 * ডেটা লোডের সময় সূরা গ্রিডের স্থানধারক (স্কেলেটন)।
 */
export default function LoadingSurahGrid() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-busy aria-label="লোড হচ্ছে">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="h-[4.5rem] animate-pulse rounded-xl bg-[var(--islamic-teal)]/10"
        />
      ))}
    </div>
  );
}
