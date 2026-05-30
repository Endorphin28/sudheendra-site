"use client";

import { useState } from "react";
import { faqs } from "@/lib/faq-data";

export default function FAQ() {
  // First item open by default so content is visible to crawlers
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">
            Frequently Asked Questions
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-paper-warm rounded-xl overflow-hidden bg-paper-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                aria-expanded={open === i}
              >
                <span className="text-sm font-medium text-ink">{faq.q}</span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-paper-warm flex items-center justify-center transition-transform ${open === i ? "rotate-45" : ""}`}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v8M1 5h8" stroke="#6b6a65" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-ink-muted leading-relaxed border-t border-paper-warm pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
