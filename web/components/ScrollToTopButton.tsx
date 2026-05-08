"use client";

/**
 * দীর্ঘ সূরায় দ্রুত উপরে ফেরার বোতাম।
 */
import { useEffect, useState } from "react";

type Props = {
  /** সূরা পেজের নিচের ফিক্সড প্লেয়ার থাকলে বোতাম একটু উপরে। */
  liftForAudioDock?: boolean;
};

export default function ScrollToTopButton({
  liftForAudioDock = false,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="পেজের শীর্ষে যান"
      className={`fixed right-4 z-20 rounded-full border-2 border-[var(--islamic-gold)]/70 bg-[var(--islamic-teal)] px-3 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-[var(--islamic-teal-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--islamic-gold)]/50 font-[family-name:var(--font-bn)] ${
        liftForAudioDock
          ? "bottom-28 sm:bottom-32"
          : "bottom-6"
      }`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑ উপরে
    </button>
  );
}
