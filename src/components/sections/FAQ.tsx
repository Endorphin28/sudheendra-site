"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How does an in-person consultation work?",
    a: "You can walk in directly during OPD hours (Monday to Saturday, 11am–2pm and 3pm–8pm) at Sukhibhava Healthcare, Deshpande Nagar, Hubballi. No prior appointment is required, though calling ahead is recommended to avoid wait times. At the clinic, you will be seen by Dr. Sudheendra Huddar in a private consultation room. The session typically lasts 20–45 minutes depending on your needs. A prescription and any necessary referrals will be provided at the end of the consultation. Please carry any previous medical records, reports, or prescriptions if available.",
  },
  {
    q: "How does an online consultation work?",
    a: "After booking and payment, you receive a Google Meet link instantly. At your appointment time, simply click the link to join the video call. The consultation is 30 minutes and fully confidential.",
  },
  {
    q: "Will I receive a prescription after the online consultation?",
    a: "Yes. Dr. Huddar will share a prescription digitally after the consultation. You can use this at any pharmacy.",
  },
  {
    q: "Is my consultation completely confidential?",
    a: "Absolutely. All consultations — online or in-person — are strictly confidential. Patient privacy is our priority.",
  },
  {
    q: "What is de-addiction treatment and how long does it take?",
    a: "De-addiction treatment is a structured, evidence-based program to help individuals overcome dependence on substances or behaviours. Duration varies — outpatient programs can range from weeks to months, while inpatient admission at Parivartan-VGH is typically 2–4 weeks depending on clinical need.",
  },
  {
    q: "Do you offer inpatient (admission) facilities?",
    a: "Yes. We offer 24×7 inpatient psychiatric care and an exclusive de-addiction admission facility at Parivartan-VGH in collaboration with Vivekananda General Hospital, Hubballi.",
  },
  {
    q: "Can family members consult for a patient who refuses treatment?",
    a: "Yes. Family counselling and guidance sessions are available. Dr. Huddar can advise families on how to approach and support a patient who is reluctant to seek help.",
  },
  {
    q: "What are your OPD timings?",
    a: "Monday to Saturday, 11am–2pm and 3pm–8pm at Sukhibhava Healthcare, Deshpande Nagar, Hubballi. Online consultations are available Monday, Wednesday and Friday.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

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
