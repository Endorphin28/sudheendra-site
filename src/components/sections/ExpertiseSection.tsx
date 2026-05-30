import Link from "next/link";

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

export default function ExpertiseSection() {
  return (
    <section className="py-20 px-6 bg-paper-white border-y border-paper-warm">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">
            Areas of Expertise
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink font-bold">
            Conditions I treat
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT — De-addiction */}
          <div>
            <h3 className="text-base font-bold text-ink uppercase tracking-wider mb-6 border-b border-paper-warm pb-3">
              De-addiction Treatment & Counselling
            </h3>
            <ul className="space-y-3">
              {deaddictionServices.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — Psychiatric Consultation */}
          <div>
            <h3 className="text-base font-bold text-ink uppercase tracking-wider mb-6 border-b border-paper-warm pb-3">
              Psychiatric Consultation & Counselling
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {psychiatryServices.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-light flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm text-ink border border-ink-muted px-5 py-2.5 rounded-full hover:bg-ink hover:text-paper transition-colors"
              >
                View all services →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
