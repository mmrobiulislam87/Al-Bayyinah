"use client";

import Link from "next/link";

import { ONTOLOGY_CONCEPTS, getOntologyConcept } from "@/lib/researchLab/ontologySeed";

export default function LabPanelOntology() {
  return (
    <section className="mb-6 space-y-4">
      <div className="rounded-lg border border-[var(--islamic-teal)]/20 bg-[var(--islamic-teal)]/6 p-4 dark:border-teal-800/40 dark:bg-teal-900/28">
        <h3 className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-200">
          ধারণা নেটওয়ার্ক (ভূমিকা ডেটা)
        </h3>
        <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-400/88">
          সম্পর্ক পরবর্তীতে গ্রাফ UI ও API তে ম্যাপ হবে। এখন কুরেটেড নোড ও লিঙ্কের
          নমুনা।
        </p>
      </div>
      <ul className="space-y-3">
        {ONTOLOGY_CONCEPTS.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--islamic-teal)]/15 bg-white/85 p-3 dark:border-teal-800/40 dark:bg-teal-950/50"
          >
            <p className="font-[family-name:var(--font-bn)] text-sm font-semibold text-[var(--islamic-teal-deep)] dark:text-teal-100">
              {c.labelBn}
            </p>
            <p className="mt-1 font-[family-name:var(--font-bn)] text-xs text-[var(--islamic-ink-soft)] dark:text-teal-300/88">
              {c.hintBn}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {c.searchHintsBn.map((h) => (
                <Link
                  key={h}
                  href={`/?q=${encodeURIComponent(h)}`}
                  className="rounded-full border border-[var(--islamic-gold)]/35 bg-[var(--islamic-teal)]/8 px-2.5 py-0.5 font-[family-name:var(--font-bn)] text-[11px] text-[var(--islamic-teal-deep)] hover:bg-[var(--islamic-teal)]/15 dark:border-amber-800/40 dark:text-teal-100 dark:hover:bg-teal-900/45"
                >
                  «{h}» — হোম সার্চ
                </Link>
              ))}
            </div>
            {c.related.length > 0 ? (
              <ul className="mt-2 space-y-1 border-t border-[var(--islamic-teal)]/10 pt-2 dark:border-teal-800/30">
                {c.related.map((rel) => {
                  const tgt = getOntologyConcept(rel.targetId);
                  return (
                    <li
                      key={`${c.id}-${rel.targetId}`}
                      className="font-[family-name:var(--font-bn)] text-[11px] text-[var(--islamic-ink)] dark:text-teal-100/85"
                    >
                      <span className="text-[var(--islamic-ink-soft)] dark:text-teal-400/80">
                        {rel.kind} ·
                      </span>{" "}
                      {rel.labelBn}
                      {tgt ? (
                        <>
                          {" "}
                          (
                          <span className="font-medium">{tgt.labelBn}</span>
                          )
                        </>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
