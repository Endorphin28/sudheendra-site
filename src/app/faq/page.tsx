import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "FAQs | Dr. Sudheendra Huddar",
  description:
    "Frequently asked questions about psychiatry consultations, de-addiction treatment, online consultations, and appointments at Sukhibhava Healthcare, Hubballi.",
  alternates: { canonical: "https://doctorhuddar.com/faq" },
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">
            FAQ
          </p>
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
