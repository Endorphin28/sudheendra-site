import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const deaddictionServices = [
  "Alcohol Addiction",
  "Tobacco Addiction",
  "Cannabis & Other Drugs",
  "Internet / Mobile Addiction",
  "Gaming Addiction",
  "Gambling Addiction",
];

const psychiatryServices = [
  "Depression & Anxiety",
  "Stress Management",
  "OCD",
  "Headache",
  "Sexual Problems",
  "Chronic Pain",
  "Marital Discord",
  "Adult ADHD",
  "Childhood ADHD",
  "Sleep Disorders",
  "Epilepsy",
  "Mood Disorders",
];

export default function ClinicPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4">
            Clinical Practice · Hubballi, Karnataka
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-ink mb-6">
            Sukhibhava
            <br />
            <span className="italic text-ink-soft">Healthcare</span>
          </h1>
          <p className="text-lg text-ink-muted max-w-xl leading-relaxed">
            Specialised outpatient and inpatient psychiatric care, with a
            dedicated focus on de-addiction treatment and counselling.
          </p>
        </div>

        {/* Info strip */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20 p-6 rounded-2xl bg-paper-white border border-paper-warm">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">OPD Timings</p>
            <p className="text-sm text-ink font-medium">11am – 2pm</p>
            <p className="text-sm text-ink font-medium">3pm – 8pm</p>
            <p className="text-xs text-ink-muted mt-1">Monday to Saturday</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Contact</p>
            <a href="tel:+918073398651" className="text-sm text-ink font-medium hover:text-accent transition-colors block">
              80733 98651
            </a>
            <a href="tel:+918363509005" className="text-sm text-ink font-medium hover:text-accent transition-colors block">
              0836-3509005
            </a>
            <a href="mailto:consultdrhuddar@gmail.com" className="text-xs text-ink-muted hover:text-accent transition-colors mt-1 block">
              consultdrhuddar@gmail.com
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Address</p>
            <p className="text-sm text-ink leading-relaxed">
              #17, 18, Ground Floor, Ramdhoot Apartment Complex,
              Opp. Sawai Gandharva Hall, Deshpande Nagar, Hubballi – 580029
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">

          {/* De-addiction */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <h2 className="font-display text-2xl text-ink">De-addiction Services</h2>
            </div>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">
              Treatment and counselling for all forms of substance and behavioural addiction.
            </p>
            <ul className="space-y-3">
              {deaddictionServices.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Psychiatry */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-light" />
              <h2 className="font-display text-2xl text-ink">Psychiatric Consultation</h2>
            </div>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">
              Comprehensive consultation and counselling across a wide range of mental health conditions.
            </p>
            <ul className="grid grid-cols-2 gap-3">
              {psychiatryServices.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Facilities badge */}
        <div className="flex flex-wrap gap-3 mb-20">
          {["OPD Available", "Admission Facility", "De-addiction IPD", "Counselling"].map((f) => (
            <span
              key={f}
              className="text-xs border border-paper-warm text-ink-muted px-4 py-2 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Book appointment CTA */}
        <div id="contact" className="rounded-2xl bg-accent p-10 text-white">
          <h2 className="font-display text-3xl mb-3">Book an Appointment</h2>
          <p className="text-accent-light mb-8 text-sm leading-relaxed">
            Call or walk in during OPD hours. Available Monday to Saturday,
            11am–2pm and 3pm–8pm.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+918073398651"
              className="bg-white text-accent font-medium text-sm px-6 py-3 rounded-full hover:bg-paper transition-colors"
            >
              Call 80733 98651
            </a>
            <a
              href="tel:+918363509005"
              className="border border-accent-light text-white text-sm px-6 py-3 rounded-full hover:bg-accent-dark transition-colors"
            >
              0836-3509005
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
