import type { Metadata } from "next";

import DonorsClient from "./DonorsClient";

export const metadata: Metadata = {
  title: "ডোনার পোর্টাল",
};

/**
 * bKash Checkout (URL) ইন্টিগ্রেশন — env সেট থাকলে লাইভ; না থাকলে বাটন ত্রুটি দেখাবে।
 */
export default function DonorsPage() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-12 font-[family-name:var(--font-bn)] text-[var(--islamic-ink)] dark:text-teal-100/95">
      <h1 className="text-xl font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
        ডোনার পোর্টাল
      </h1>
      <p className="mt-4 leading-relaxed text-[var(--islamic-ink-soft)] dark:text-teal-300/90">
        সাদাকাহ ফান্ডে সরাসরি অনুদান — bKash PGW (Checkout URL)। লাইব্রেরিতে রিসিট/লেজার পরবর্তী
        ধাপে যুক্ত করা যাবে। ওয়ালেট পয়েন্ট ডেমো আলাদা; নগদ অনুদান এখানে।
      </p>

      <div className="mt-8">
        <DonorsClient />
      </div>
    </div>
  );
}
