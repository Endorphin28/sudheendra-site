import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Dr. Sudheendra Huddar | Psychiatrist, Hubballi",
  description:
    "Dr. Sudheendra Huddar — Consultant Psychiatrist and De-Addiction Specialist in Hubballi. First DM Addiction Psychiatry super-specialist from Karnataka. Trained at NIMHANS & AIIMS Delhi.",
  alternates: { canonical: "https://doctorhuddar.com/about" },
  openGraph: {
    title: "About Dr. Sudheendra Huddar | Psychiatrist, Hubballi",
    description:
      "Consultant Psychiatrist trained at NIMHANS Bengaluru and AIIMS Delhi. First psychiatry super-specialist in Addiction Psychiatry from Karnataka.",
    url: "https://doctorhuddar.com/about",
  },
};

const qualifications = [
  { degree: "MBBS", institution: "BIMS Belagavi, RGUHS" },
  { degree: "MD Psychiatry", institution: "NIMHANS, Bengaluru" },
  { degree: "DM Addiction Psychiatry", institution: "NIMHANS, Bengaluru" },
];

const experience = [
  { role: "Senior Resident", place: "Centre for Addiction Medicine, NIMHANS Bengaluru" },
  { role: "Senior Resident", place: "NDDTC, AIIMS Delhi" },
  { role: "Consultant Psychiatrist", place: "Nanavati Hospital, Mumbai" },
  { role: "Consultant Psychiatrist", place: "Masina Hospital, Mumbai" },
  { role: "Consultant Psychiatrist", place: "K. J. Somaiya Hospital & Research Centre, Mumbai" },
];

const expertise = [
  "Substance Use Disorders",
  "Behavioural Addiction",
  "Gaming & Gambling Addiction",
  "ADHD",
  "Personality Disorders",
  "Dual Diagnosis",
];

const languages = ["English", "Hindi", "Kannada"];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">
              About
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-ink mb-6">
              Dr. Sudheendra
              <br />
              <span className="italic text-ink-soft">Huddar</span>
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed">
              Consultant Psychiatrist and De-Addiction Specialist — one of the
              few addiction psychiatrists in India, and the first psychiatry
              super-specialist trained in Addiction Psychiatry from Karnataka.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-72 rounded-2xl overflow-hidden col-span-2">
              <Image src="/images/doctor/dr-wide.jpg" alt="Dr. Sudheendra Huddar at his clinic" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image src="/images/doctor/dr-writing-1.jpg" alt="Dr. Sudheendra Huddar" fill sizes="25vw" className="object-cover object-top" />
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image src="/images/doctor/dr-writing-2.jpg" alt="Dr. Sudheendra Huddar" fill sizes="25vw" className="object-cover object-top" />
            </div>
          </div>
        </div>

        {/* Bio + Sidebar */}
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl text-ink mb-5">About me</h2>
            <div className="space-y-5 text-ink-muted leading-relaxed">
              <p>
                I am a Consultant Psychiatrist and De-addiction Specialist based in
                Hubballi, Karnataka. I completed my MD in Psychiatry and DM in
                Addiction Psychiatry from NIMHANS, Bengaluru, and I am the first
                psychiatry super-specialist trained in the field of Addiction
                Psychiatry from Karnataka.
              </p>
              <p>
                Before setting up my independent clinical practice, I trained as a
                Senior Resident at the Centre for Addiction Medicine, NIMHANS
                Bengaluru, and at the National Drug Dependence Treatment Centre,
                AIIMS Delhi — two of India&apos;s leading institutions for addiction
                medicine. This training shaped my approach to addiction care:
                structured, evidence-based, compassionate, and tailored to each
                patient&apos;s clinical and personal context.
              </p>
              <p>
                I have also worked with several reputed hospitals in Mumbai,
                including Nanavati Hospital, Masina Hospital, and K. J. Somaiya
                Hospital and Research Centre.
              </p>
              <p>
                My clinical approach is built on comprehensive, science-driven care.
                I begin with a detailed understanding of each person&apos;s concerns and
                develop personalised treatment strategies that account for individual
                differences, family context, motivation, co-existing mental health
                conditions, and long-term recovery needs. I believe effective
                treatment must be clinically sound, practical, and individually
                tailored.
              </p>
              <p>
                Beyond clinical practice, I am also building health-tech tools that
                I wish existed in my own clinic — software designed to make
                psychiatric care more efficient, accessible, and human.
              </p>
            </div>

            {/* Languages */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-3">Languages</p>
              <div className="flex gap-3">
                {languages.map((l) => (
                  <span key={l} className="text-sm border border-paper-warm text-ink-muted px-4 py-1.5 rounded-full">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Qualifications */}
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-4">Qualifications</p>
              <ul className="space-y-4">
                {qualifications.map((q) => (
                  <li key={q.degree} className="border-l-2 border-accent pl-4">
                    <p className="text-sm font-medium text-ink">{q.degree}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{q.institution}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience */}
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-4">Experience</p>
              <ul className="space-y-4">
                {experience.map((e, i) => (
                  <li key={i} className="border-l-2 border-paper-warm pl-4">
                    <p className="text-sm font-medium text-ink">{e.role}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{e.place}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas of expertise */}
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-4">Areas of Expertise</p>
              <ul className="space-y-2">
                {expertise.map((e) => (
                  <li key={e} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div className="border-t border-paper-warm pt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink mb-1">Want to book a consultation?</p>
            <p className="text-sm text-ink-muted">Available Mon–Sat, 11am–2pm & 3pm–8pm. Online consultations also available.</p>
          </div>
          <Link
            href="/services#contact"
            className="flex-shrink-0 bg-accent text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors"
          >
            Book appointment →
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
