import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import PhotoCarousel from "@/components/ui/PhotoCarousel";

export const metadata: Metadata = {
  title: "Services | Psychiatry & De-Addiction Centre, Hubballi",
  description:
    "Outpatient psychiatry, 24/7 inpatient care, and exclusive de-addiction services at Sukhibhava Healthcare & Parivartan-VGH in Hubballi, Karnataka. OPD Mon–Sat, 11am–8pm.",
  alternates: { canonical: "https://doctorhuddar.com/services" },
  openGraph: {
    title: "Clinical Services | Dr. Sudheendra Huddar, Hubballi",
    description:
      "Psychiatry OPD, 24/7 inpatient care, ECT, Ketamine infusion, and de-addiction treatment at Sukhibhava Healthcare, Hubballi.",
    url: "https://doctorhuddar.com/services",
  },
};

// ── Photo sets ────────────────────────────────────────────────────────────────

const sukhibhavaPhotos = [
  { src: "/images/doctor/dr-wide.jpg",                           label: "Consultation Room" },
  { src: "/images/sukhibhava/consultation-room-overview.jpg",    label: "Consultation Room — Overview" },
  { src: "/images/sukhibhava/clinic-9.jpg",                      label: "Consultation Room — Patient Seating" },
  { src: "/images/sukhibhava/waiting-area-2b.jpg",               label: "Patient Waiting Area 1" },
  { src: "/images/sukhibhava/waiting-area-2a.jpg",               label: "Patient Waiting Area 2" },
  { src: "/images/sukhibhava/reception-1.jpg",                   label: "Reception" },
  { src: "/images/sukhibhava/reception-2.jpg",                   label: "Reception — Entrance View" },
];

const inpatientPhotos = [
  { src: "/images/inpatient/inpatient-2.jpg",  label: "General Ward" },
  { src: "/images/inpatient/inpatient-8.jpg",  label: "Private Room" },
  { src: "/images/inpatient/inpatient-5.jpg",  label: "Recreation & Therapy Room" },
  { src: "/images/inpatient/inpatient-6.jpg",  label: "Common Room with TV" },
  { src: "/images/inpatient/inpatient-1.jpg",  label: "Ward Corridor" },
  { src: "/images/inpatient/inpatient-3.jpg",  label: "Private Wing Corridor" },
  { src: "/images/inpatient/inpatient-7.jpg",  label: "Main Corridor" },
];

const parivartanPhotos = [
  { src: "/images/parivartan/parivartan-3.jpg", label: "Day Room — Parivartan VGH" },
  { src: "/images/parivartan/parivartan-2.jpg", label: "Lounge & Waiting Area" },
  { src: "/images/parivartan/parivartan-1.jpg", label: "Ward Corridor" },
];

const sukhibhavaServices = [
  "Depression & Anxiety", "Stress Management", "OCD", "Headache",
  "Sexual Problems", "Chronic Pain", "Marital Discord", "Adult ADHD",
  "Childhood ADHD", "Sleep Disorders", "Epilepsy", "Mood Disorders",
];

const deaddictionServices = [
  "Alcohol Addiction", "Tobacco Addiction", "Cannabis & Other Drugs",
  "Internet / Mobile Addiction", "Gaming Addiction", "Gambling Addiction",
];

const inpatientServices = [
  "All Psychiatric Emergencies",
  "Electroconvulsive Therapy (ECT)",
  "Ketamine Infusion",
  "Schizophrenia",
  "Bipolar Affective Disorder",
  "Substance Use Disorders & Co-morbid Conditions",
];

// ── Service cards ─────────────────────────────────────────────────────────────

const serviceCards = [
  {
    id: "sukhibhava",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#2d6a4f" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 22V12h6v10" stroke="#2d6a4f" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Outpatient Clinic",
    subtitle: "Sukhibhava Healthcare",
    desc: "OPD psychiatry, de-addiction counselling and outpatient care. Mon–Sat, 11am–8pm.",
  },
  {
    id: "inpatient",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="#2d6a4f" strokeWidth="1.8"/>
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#2d6a4f" strokeWidth="1.8"/>
        <path d="M12 12v4M10 14h4" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Acute Care & Psychiatry",
    subtitle: "In-patient Centre",
    desc: "24×7 inpatient psychiatric care, ECT, Ketamine infusion and emergency services.",
  },
  {
    id: "parivartan",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#2d6a4f" strokeWidth="1.8"/>
        <circle cx="12" cy="9" r="2.5" stroke="#2d6a4f" strokeWidth="1.8"/>
      </svg>
    ),
    title: "Exclusive De-addiction Centre",
    subtitle: "Parivartan-VGH",
    desc: "Dedicated de-addiction centre in collaboration with Vivekananda General Hospital.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">
            Clinical Services · Hubballi, Karnataka
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-ink mb-6">
            Psychiatry & De-Addiction<br />
            <span className="italic text-ink-soft">Services, Hubballi</span>
          </h1>
          <p className="text-lg text-ink-muted max-w-xl leading-relaxed">
            Outpatient, inpatient, and exclusive de-addiction services across three facilities.
          </p>
        </div>

        {/* ── 3 Icon Cards ── */}
        <div className="grid md:grid-cols-3 gap-4 mb-24">
          {serviceCards.map((card) => (
            <a
              key={card.id}
              href={`#${card.id}`}
              className="group bg-paper-white border border-paper-warm rounded-2xl p-6 hover:border-accent hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                {card.icon}
              </div>
              <h2 className="font-display text-lg text-ink mb-0.5">{card.title}</h2>
              <p className="text-xs text-accent font-medium mb-3">{card.subtitle}</p>
              <p className="text-sm text-ink-muted leading-relaxed">{card.desc}</p>
              <p className="mt-4 text-xs text-accent font-medium group-hover:underline">View details ↓</p>
            </a>
          ))}
        </div>

        {/* ── Section 1: Sukhibhava Healthcare ── */}
        <section id="sukhibhava" className="mb-24 scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Outpatient Clinic</p>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/images/logo/sukhibhava-logo.png"
              alt="Sukhibhava Healthcare Logo"
              width={56}
              height={70}
              className="object-contain flex-shrink-0"
            />
            <h2 className="font-display text-3xl md:text-4xl text-ink">Sukhibhava Healthcare</h2>
          </div>
          <p className="text-ink-muted mb-8 max-w-2xl leading-relaxed">
            Our outpatient clinic in Deshpande Nagar, Hubballi offers comprehensive psychiatric
            consultation, counselling, and de-addiction treatment in a private, professional environment.
            Walk in during OPD hours or book an appointment online.
          </p>

          {/* Photo carousel */}
          <div className="mb-10">
            <PhotoCarousel photos={sukhibhavaPhotos} />
          </div>

          {/* Info strip */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 rounded-2xl bg-paper-white border border-paper-warm">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">OPD Timings</p>
              <p className="text-sm text-ink font-semibold">11am – 2pm</p>
              <p className="text-sm text-ink font-semibold">3pm – 8pm</p>
              <p className="text-xs text-ink-muted mt-1">Monday to Saturday</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Consultation Fees</p>
              <p className="text-sm text-ink">First visit — <span className="font-semibold text-accent">₹850</span></p>
              <p className="text-sm text-ink">Follow-up — <span className="font-semibold text-accent">₹500</span></p>
              <p className="text-sm text-ink">Counselling — <span className="font-semibold text-accent">₹1,500</span></p>
              <p className="text-xs text-ink-muted mt-0.5">Online — ₹1,200 / 30 min</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Contact</p>
              <a href="tel:+918073398651" className="text-sm text-ink font-medium hover:text-accent transition-colors block">80733 98651</a>
              <a href="tel:+918363509005" className="text-sm text-ink font-medium hover:text-accent transition-colors block">0836-3509005</a>
              <a href="mailto:consultdrhuddar@gmail.com" className="text-xs text-ink-muted hover:text-accent transition-colors mt-1 block">consultdrhuddar@gmail.com</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Address</p>
              <p className="text-sm text-ink leading-relaxed mb-2">
                #17, 18, Ground Floor, Ramdhoot Apartment Complex,
                Opp. Sawai Gandharva Hall, Deshpande Nagar, Hubballi – 580029
              </p>
              <a href="https://share.google/ozC7F3JAP8iYPZ8G5" target="_blank" rel="noopener noreferrer"
                className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
                📍 Get Directions
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="grid md:grid-cols-2 gap-10 mb-8">
            <div>
              <h3 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">Psychiatric Consultation & Counselling</h3>
              <ul className="grid grid-cols-2 gap-2">
                {sukhibhavaServices.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">De-addiction Treatment & Counselling</h3>
              <ul className="space-y-2">
                {deaddictionServices.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="bg-accent text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors font-medium">
              Book Appointment →
            </Link>
            <a href="tel:+918073398651" className="border border-ink-muted text-ink-soft text-sm px-6 py-3 rounded-full hover:border-ink hover:text-ink transition-colors">
              Call 80733 98651
            </a>
            <a href="https://wa.me/918073398651" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#25D366] text-[#25D366] text-sm px-5 py-3 rounded-full hover:bg-[#25D366] hover:text-white transition-colors font-medium">
              Enquire on WhatsApp
            </a>
          </div>
        </section>

        <div className="border-t border-paper-warm mb-24" />

        {/* ── Section 2: In-patient ── */}
        <section id="inpatient" className="mb-24 scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Acute Care & In-patient</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-3">Psychiatry In-patient Care</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block text-xs font-medium bg-accent text-white px-4 py-1.5 rounded-full">24 × 7 Available</span>
          </div>
          <p className="text-ink-muted mb-6 max-w-2xl leading-relaxed">
            Round-the-clock inpatient psychiatric services for emergencies, severe psychiatric illness,
            and advanced procedures including ECT and Ketamine infusion. Our inpatient facility
            ensures a safe, structured environment for recovery with continuous clinical monitoring.
          </p>

          {/* Location */}
          <div className="flex items-start gap-2 mb-8 p-4 rounded-xl bg-paper-white border border-paper-warm max-w-md">
            <span className="text-accent mt-0.5">📍</span>
            <div>
              <p className="text-sm font-medium text-ink">First Floor, Dr. R. B. Patil Hospital</p>
              <p className="text-sm text-ink-muted">Vidyanagar, Hubballi</p>
            </div>
          </div>

          <div className="mb-10">
            <PhotoCarousel photos={inpatientPhotos} />
          </div>

          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            {inpatientServices.map((s) => (
              <li key={s} className="flex items-center gap-3 bg-paper-white border border-paper-warm rounded-xl px-5 py-4 text-sm text-ink-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />{s}
              </li>
            ))}
          </ul>

          <a href="tel:+918073398651"
            className="inline-flex items-center gap-2 bg-accent text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors font-medium">
            Enquire about Admission
          </a>
        </section>

        <div className="border-t border-paper-warm mb-24" />

        {/* ── Section 3: Parivartan-VGH ── */}
        <section id="parivartan" className="mb-24 scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Exclusive De-addiction Centre</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">Parivartan-VGH</h2>
          <p className="text-ink-muted mb-6 max-w-2xl leading-relaxed">
            An exclusive, dedicated de-addiction centre providing comprehensive inpatient and
            outpatient services for all addictive disorders, in collaboration with{" "}
            <span className="text-ink font-medium">Vivekananda General Hospital</span>, Hubballi.
            Parivartan offers a structured, evidence-based environment for recovery from substance
            use and behavioural addictions, with a focus on long-term rehabilitation.
          </p>

          {/* Location */}
          <div className="flex items-start gap-2 mb-8 p-4 rounded-xl bg-paper-white border border-paper-warm max-w-md">
            <span className="text-accent mt-0.5">📍</span>
            <div>
              <p className="text-sm font-medium text-ink">Vivekananda General Hospital</p>
              <p className="text-sm text-ink-muted">Deshpande Nagar, Hubballi</p>
            </div>
          </div>

          <div className="mb-10">
            <PhotoCarousel photos={parivartanPhotos} />
          </div>

          <div className="flex flex-wrap items-start gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-paper-white border border-paper-warm">
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">In collaboration with</p>
              <p className="text-sm font-medium text-ink">Vivekananda General Hospital</p>
              <p className="text-xs text-ink-muted mt-0.5">Deshpande Nagar, Hubballi</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="tel:+918073398651"
              className="inline-flex items-center gap-2 bg-accent text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors font-medium">
              Enquire about Admission
            </a>
            <a href="https://wa.me/918073398651" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#25D366] text-[#25D366] text-sm px-5 py-3 rounded-full hover:bg-[#25D366] hover:text-white transition-colors font-medium">
              Enquire on WhatsApp
            </a>
          </div>
        </section>

        {/* Book appointment CTA */}
        <div id="contact" className="rounded-2xl bg-accent p-10 text-white">
          <h2 className="font-display text-3xl mb-3">Book an Appointment</h2>
          <p className="text-accent-light mb-8 text-sm leading-relaxed">
            In-person OPD or online consultation available. Call us or book online.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book" className="bg-white text-accent font-medium text-sm px-6 py-3 rounded-full hover:bg-paper transition-colors">
              Book Appointment
            </Link>
            <a href="tel:+918073398651" className="border border-accent-light text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors">
              Call 80733 98651
            </a>
            <a href="https://wa.me/918073398651" target="_blank" rel="noopener noreferrer"
              className="border border-accent-light text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors">
              Enquire on WhatsApp
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
