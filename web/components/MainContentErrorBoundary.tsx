"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { error: Error | null };

/**
 * মূল কন্টেন্ট এলাকার ক্লায়েন্ট-সাইড এরর ধরে ধরে — একটি কম্পোনেন্ট ক্র্যাশ করলে হেডার/ফুটার অক্ষত থাকে।
 */
export default class MainContentErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV === "development") {
      console.error("[MainContentErrorBoundary]", error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[var(--islamic-cream)] px-4 py-16 text-[var(--islamic-ink)] dark:bg-teal-950/40 dark:text-teal-100">
          <h2 className="font-[family-name:var(--font-bn)] text-lg font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
            এই অংশ লোড করা যায়নি
          </h2>
          <p className="max-w-md text-center text-sm text-[var(--islamic-ink-soft)] dark:text-teal-300/85">
            একটি ত্রুটি ঘটেছে। নিচের বাটন চাপলে পৃষ্ঠাটি আবার লোড হবে। সমস্যা থাকলে অন্য মেনু ব্যবহার করে চালিয়ে যান।
          </p>
          <pre className="max-h-40 max-w-xl overflow-auto rounded-lg border border-red-200/80 bg-white p-3 text-left text-xs text-red-900 shadow-sm dark:border-red-900/50 dark:bg-teal-950/80 dark:text-red-300">
            {this.state.error.message}
          </pre>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="rounded-xl border border-[var(--islamic-teal)]/35 bg-white px-5 py-2 font-[family-name:var(--font-bn)] text-sm font-medium text-[var(--islamic-teal-deep)] shadow-sm hover:bg-[var(--islamic-parchment)] dark:bg-teal-900/60 dark:text-teal-50"
            >
              আবার চেষ্টা (একই পৃষ্ঠা)
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[var(--islamic-teal-deep)] px-5 py-2 font-[family-name:var(--font-bn)] text-sm font-semibold text-white shadow-md hover:brightness-110 dark:bg-teal-800"
            >
              পুরো পৃষ্ঠা রিফ্রেশ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
