import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-6 flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div>
            {/* Eyebrow */}
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-6 animate-fade-up stagger-1">
              Consultant Psychiatrist · Hubballi, Karnataka
            </p>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl text-ink leading-[1.08] mb-8 animate-fade-up stagger-2">
              Psychiatrist.
              <br />
              <span className="italic text-ink-soft">De-Addiction</span>
              <br />
              <span className="italic text-ink-soft">Specialist.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg text-ink-muted leading-relaxed mb-10 animate-fade-up stagger-3">
              Outpatient psychiatry clinic and de-addiction centre in Hubballi,
              Karnataka. Online consultations available for patients across India.
            </p>

            {/* Google rating */}
            <div className="flex items-center gap-3 mb-8 animate-fade-up stagger-3">
              <a
                href="https://g.co/kgs/doctorhuddar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-paper-white border border-paper-warm px-4 py-2 rounded-full hover:border-accent transition-colors"
              >
                <span className="text-yellow-500 text-sm">★★★★★</span>
                <span className="text-sm font-medium text-ink">5.0</span>
                <span className="text-xs text-ink-muted">· 8 Google reviews</span>
              </a>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-up stagger-4">
              <Link
                href="/book"
                className="bg-accent text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-accent-dark transition-colors"
              >
                Book Online — ₹700
              </Link>
              <a
                href="https://wa.me/918073398651"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-ink-muted text-ink-soft px-6 py-3 rounded-full text-sm font-medium hover:border-ink hover:text-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
                WhatsApp
              </a>
              <Link
                href="/services"
                className="border border-ink-muted text-ink-soft px-6 py-3 rounded-full text-sm font-medium hover:border-ink hover:text-ink transition-colors"
              >
                Our services
              </Link>
            </div>

            {/* Credential strip */}
            <div className="mt-12 pt-8 border-t border-paper-warm flex flex-wrap gap-x-8 gap-y-3 animate-fade-up stagger-5">
              {[
                "MD Psychiatry · NIMHANS",
                "DM Addiction Psychiatry · NIMHANS",
                "First in Karnataka",
              ].map((c) => (
                <span key={c} className="text-xs text-ink-faint tracking-wide">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Photo */}
          <div className="hidden md:flex flex-col gap-4 animate-fade-up stagger-2">
            <div className="relative h-[520px] rounded-2xl overflow-hidden">
              <Image
                src="/images/doctor/dr-portrait.jpg"
                alt="Dr. Sudheendra Huddar — Consultant Psychiatrist, Hubballi"
                fill
                sizes="(max-width: 768px) 0vw, 50vw"
                className="object-cover object-top"
                priority
              />
            </div>
            {/* Trust card */}
            <div className="bg-paper-white border border-paper-warm rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Online consultations available</p>
                <p className="text-xs text-ink-muted">Mon, Wed & Fri · ₹700 · 30 min · Google Meet</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
