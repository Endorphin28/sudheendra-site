import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import GalleryLightbox from "@/components/ui/GalleryLightbox";
import type { MediaItem } from "@/components/ui/GalleryLightbox";

// ── Galleries ─────────────────────────────────────────────────────────────────

const sukhibhavaGallery: MediaItem[] = [
  { src: "/images/doctor/dr-wide.jpg",       label: "Dr. Huddar — Consultation Room",    type: "image" },
  { src: "/images/doctor/dr-portrait.jpg",   label: "Dr. Huddar — In Consultation",      type: "image" },
  { src: "/images/doctor/dr-writing-1.jpg",  label: "Dr. Huddar — At Work",              type: "image" },
  { src: "/images/doctor/dr-writing-2.jpg",  label: "Dr. Huddar — Reviewing Notes",      type: "image" },
  { src: "/images/sukhibhava/clinic-6.jpg",  label: "Consultation Room",                 type: "image" },
  { src: "/images/sukhibhava/clinic-1.jpg",  label: "Clinic — Overview",                 type: "image" },
  { src: "/images/sukhibhava/clinic-2.jpg",  label: "Clinic Interior",                   type: "image" },
  { src: "/images/sukhibhava/clinic-3.jpg",  label: "Clinic Setup",                      type: "image" },
  { src: "/images/sukhibhava/clinic-4.jpg",  label: "Consultation Area",                 type: "image" },
  { src: "/images/sukhibhava/clinic-5.jpg",  label: "Clinic — Seating",                  type: "image" },
  { src: "/images/sukhibhava/clinic-7.jpg",  label: "Clinic — Entrance View",            type: "image" },
  { src: "/images/sukhibhava/clinic-8.jpg",  label: "Clinic — Decor",                    type: "image" },
  { src: "/images/sukhibhava/clinic-9.jpg",  label: "Patient Waiting Area",              type: "image" },
  { src: "/images/sukhibhava/clinic-10.jpg", label: "Clinic — Ambiance",                 type: "image" },
  { src: "/images/sukhibhava/clinic-11.jpg", label: "Clinic — Side View",                type: "image" },
];

const inpatientGallery: MediaItem[] = [
  { src: "/images/inpatient/inpatient-2.jpg", label: "General Ward",                     type: "image" },
  { src: "/images/inpatient/inpatient-8.jpg", label: "Private Room",                     type: "image" },
  { src: "/images/inpatient/inpatient-5.jpg", label: "Recreation & Therapy Room",        type: "image" },
  { src: "/images/inpatient/inpatient-6.jpg", label: "Common Room with TV",              type: "image" },
  { src: "/images/inpatient/inpatient-1.jpg", label: "Ward Corridor",                    type: "image" },
  { src: "/images/inpatient/inpatient-3.jpg", label: "Private Wing Corridor",            type: "image" },
  { src: "/images/inpatient/inpatient-4.jpg", label: "Ward Entrance",                    type: "image" },
  { src: "/images/inpatient/inpatient-7.jpg", label: "Main Corridor",                    type: "image" },
  { src: "/videos/inpatient-tour-1.mp4",      label: "Inpatient Facility — Walkthrough", type: "video" },
  { src: "/videos/inpatient-tour-2.mp4",      label: "Inpatient Facility — Overview",    type: "video" },
];

const parivartanGallery: MediaItem[] = [
  { src: "/images/parivartan/parivartan-3.jpg", label: "Day Room — Parivartan VGH",      type: "image" },
  { src: "/images/parivartan/parivartan-2.jpg", label: "Lounge & Waiting Area",          type: "image" },
  { src: "/images/parivartan/parivartan-1.jpg", label: "Ward Corridor — Parivartan VGH", type: "image" },
  { src: "/videos/parivartan-tour.mp4",         label: "Parivartan VGH — Walkthrough",   type: "video" },
];

// ── Services lists ────────────────────────────────────────────────────────────

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
  "Substance Use Disorders & Co-morbid Psychiatric Conditions",
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">Services</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink mb-6">Clinical Services</h1>
          <p className="text-lg text-ink-muted max-w-xl leading-relaxed">
            Outpatient, inpatient, and de-addiction services across three facilities in Hubballi, Karnataka.
          </p>
        </div>

        {/* ── 1. Sukhibhava Healthcare ── */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Outpatient Clinic</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-8">Sukhibhava Healthcare</h2>

          <GalleryLightbox items={sukhibhavaGallery} />

          {/* Info strip */}
          <div className="grid sm:grid-cols-3 gap-6 my-10 p-6 rounded-2xl bg-paper-white border border-paper-warm">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">OPD Timings</p>
              <p className="text-sm text-ink font-medium">11am – 2pm</p>
              <p className="text-sm text-ink font-medium">3pm – 8pm</p>
              <p className="text-xs text-ink-muted mt-1">Monday to Saturday</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Contact</p>
              <a href="tel:+918073398651" className="text-sm text-ink font-medium hover:text-accent transition-colors block">80733 98651</a>
              <a href="tel:+918363509005" className="text-sm text-ink font-medium hover:text-accent transition-colors block">0836-3509005</a>
              <a href="mailto:consultdrhuddar@gmail.com" className="text-xs text-ink-muted hover:text-accent transition-colors mt-1 block">consultdrhuddar@gmail.com</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Address</p>
              <p className="text-sm text-ink leading-relaxed">
                #17, 18, Ground Floor, Ramdhoot Apartment Complex,
                Opp. Sawai Gandharva Hall, Deshpande Nagar, Hubballi – 580029
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-sm font-medium text-ink mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Psychiatric Consultation & Counselling
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {sukhibhavaServices.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                De-addiction Treatment & Counselling
              </h3>
              <ul className="space-y-2">
                {deaddictionServices.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="border-t border-paper-warm mb-24" />

        {/* ── 2. Psychiatry In-patient Care ── */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">In-patient Care</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-3">Psychiatry In-patient Care</h2>
          <p className="text-ink-muted mb-4 max-w-xl leading-relaxed">
            Round-the-clock inpatient psychiatric services including emergency care, advanced procedures, and treatment for severe mental illness.
          </p>
          <span className="inline-block text-xs font-medium bg-accent text-white px-4 py-1.5 rounded-full mb-8">
            24 × 7 Available
          </span>

          <GalleryLightbox items={inpatientGallery} />

          <ul className="grid sm:grid-cols-2 gap-3 mt-8">
            {inpatientServices.map((s) => (
              <li key={s} className="flex items-center gap-3 bg-paper-white border border-paper-warm rounded-xl px-5 py-4 text-sm text-ink-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />{s}
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-paper-warm mb-24" />

        {/* ── 3. Parivartan-VGH ── */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">De-addiction Centre</p>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-3">Parivartan-VGH</h2>
          <p className="text-ink-muted mb-8 max-w-xl leading-relaxed">
            An exclusive de-addiction centre providing comprehensive services for all addictive disorders, in collaboration with{" "}
            <span className="text-ink font-medium">Vivekananda General Hospital</span>, Hubballi.
          </p>

          <GalleryLightbox items={parivartanGallery} />

          <div className="p-6 rounded-2xl bg-paper-white border border-paper-warm max-w-md mt-8">
            <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">In collaboration with</p>
            <p className="text-sm font-medium text-ink">Vivekananda General Hospital</p>
            <p className="text-xs text-ink-muted mt-0.5">Hubballi, Karnataka</p>
          </div>
        </section>

        {/* Book appointment CTA */}
        <div id="contact" className="rounded-2xl bg-accent p-10 text-white">
          <h2 className="font-display text-3xl mb-3">Book an Appointment</h2>
          <p className="text-accent-light mb-8 text-sm leading-relaxed">
            Call or walk in during OPD hours. Online consultations also available for patients outside Hubballi.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+918073398651" className="bg-white text-accent font-medium text-sm px-6 py-3 rounded-full hover:bg-paper transition-colors">
              Call 80733 98651
            </a>
            <a href="tel:+918363509005" className="border border-accent-light text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors">
              0836-3509005
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
