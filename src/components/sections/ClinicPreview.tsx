import Link from "next/link";

const services = [
  { label: "De-addiction (OPD & IPD)", desc: "Alcohol, tobacco, cannabis, gaming, gambling, internet" },
  { label: "Psychiatric Consultation", desc: "Depression, anxiety, OCD, mood disorders & more" },
  { label: "Addiction Psychiatry", desc: "Specialised super-specialty care — first in Karnataka" },
  { label: "Counselling", desc: "Individual, marital, and family counselling" },
];

export default function ClinicPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">
            Clinical practice
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-6">
            Sukhibhava
            <br />
            <span className="italic">Healthcare</span>
          </h2>
          <p className="text-ink-muted leading-relaxed mb-4">
            OPD and inpatient psychiatric and de-addiction services in Hubballi,
            Karnataka. Mon–Sat, 11am–2pm & 3pm–8pm.
          </p>
          <p className="text-sm text-ink-muted mb-8">
            <a href="tel:+918073398651" className="hover:text-accent transition-colors">80733 98651</a>
            {" · "}
            <a href="tel:+918363509005" className="hover:text-accent transition-colors">0836-3509005</a>
          </p>
          <Link
            href="/clinic"
            className="inline-flex items-center gap-2 text-sm text-ink border border-ink-muted px-5 py-2.5 rounded-full hover:bg-ink hover:text-paper transition-colors"
          >
            Clinic details →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {services.map((s) => (
            <div
              key={s.label}
              className="bg-paper-white rounded-xl p-5 border border-paper-warm"
            >
              <p className="text-sm font-medium text-ink mb-1">{s.label}</p>
              <p className="text-xs text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
