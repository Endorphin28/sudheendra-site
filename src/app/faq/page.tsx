import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FAQ from "@/components/sections/FAQ";
import { faqs } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "FAQs | Dr. Sudheendra Huddar",
  description:
    "Frequently asked questions about psychiatry consultations, de-addiction treatment, online and in-person consultations at Sukhibhava Healthcare, Hubballi.",
  alternates: { canonical: "https://doctorhuddar.com/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">FAQ</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink mb-4">
            Frequently Asked
            <br />
            <span className="italic text-ink-soft">Questions</span>
          </h1>
          <p className="text-lg text-ink-muted max-w-xl">
            Everything you need to know before your first consultation.
          </p>
        </div>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
