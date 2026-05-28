import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-6 flex items-center">
      <div className="max-w-5xl mx-auto w-full">

        {/* Eyebrow */}
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-6 animate-fade-up stagger-1">
          Dr. Sudheendra Huddar · Hubballi, Karnataka
        </p>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl text-ink leading-[1.08] mb-8 animate-fade-up stagger-2">
          Psychiatrist.
          <br />
          <span className="italic text-ink-soft">De-Addiction</span>
          <br />
          <span className="italic text-ink-soft">Specialist.</span>
          <br />
          Health-tech Innovator.
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-ink-muted max-w-xl leading-relaxed mb-10 animate-fade-up stagger-3">
          I run an outpatient psychiatry clinic and de-addiction centre in Hubballi,
          Karnataka and also offer online consultations for patients beyond the city.
          I also build practical health-tech tools inspired by the gaps I see in
          everyday clinical practice.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 animate-fade-up stagger-4">
          <Link
            href="/services#contact"
            className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-ink-soft transition-colors"
          >
            Book an appointment
          </Link>
          <Link
            href="/services"
            className="border border-ink-muted text-ink-soft px-6 py-3 rounded-full text-sm font-medium hover:border-ink hover:text-ink transition-colors"
          >
            Our services
          </Link>
        </div>

        {/* Credential strip */}
        <div className="mt-20 pt-8 border-t border-paper-warm flex flex-wrap gap-x-10 gap-y-3 animate-fade-up stagger-5">
          {[
            "MD Psychiatry · NIMHANS",
            "DM Addiction Psychiatry · NIMHANS",
            "Sukhibhava Healthcare",
            "Parivartan-VGH De-addiction",
          ].map((c) => (
            <span key={c} className="text-xs text-ink-faint tracking-wide">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
