import Link from "next/link";

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

const deaddictionServices = [
  "Alcohol Addiction",
  "Tobacco Addiction",
  "Cannabis & Other Drugs",
  "Internet / Mobile Addiction",
  "Gaming Addiction",
  "Gambling Addiction",
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
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Conditions I treat
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Psychiatric Consultation */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <h3 className="text-sm font-medium text-ink uppercase tracking-wider">
                Psychiatric Consultation & Counselling
              </h3>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {psychiatryServices.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* De-addiction */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <h3 className="text-sm font-medium text-ink uppercase tracking-wider">
                De-addiction Treatment & Counselling
              </h3>
            </div>
            <ul className="space-y-3">
              {deaddictionServices.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="w-1 h-1 rounded-full bg-accent-light flex-shrink-0" />
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
