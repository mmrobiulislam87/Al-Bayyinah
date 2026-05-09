"use client";

/**
 * ট্রেস ল্যাব — ক্যানভাস ট্রেসিং ও চাপ অ্যানিম ভবিষ্যৎ; এখন স্থাপত্য স্থান।
 */

export default function WritingTracePlaceholder() {
  return (
    <section className="rounded-2xl border border-dashed border-[var(--islamic-teal)]/30 bg-white/55 p-6 text-center dark:border-teal-800/55 dark:bg-teal-950/35">
      <h3 className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
        হাতের স্মৃতি · ট্রেস ল্যাব
      </h3>
      <p className="mt-2 font-[family-name:var(--font-bn)] text-xs leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-400/92">
        মাউস/আঙুল দিয়ে স্ট্রোক অনুসরণ, চাপ অনুকরণ ও ধীরে ধীরে সঠিকতা বিশ্লেষণ — এই ব্লকে শীগ্রই
        সংযোগ হবে।
      </p>
    </section>
  );
}
