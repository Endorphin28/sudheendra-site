import Link from "next/link";

const MAPS_URL = "https://share.google/ozC7F3JAP8iYPZ8G5";

export default function ClinicPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">
            Clinic Details
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Sukhibhava Healthcare
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left — details */}
          <div className="space-y-6">

            {/* Timings */}
            <div className="bg-accent rounded-2xl p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-accent-light mb-3">OPD Timings</p>
              <div className="space-y-1">
                <p className="text-2xl font-display">11:00 AM – 2:00 PM</p>
                <p className="text-2xl font-display">3:00 PM – 8:00 PM</p>
                <p className="text-accent-light text-sm mt-2">Monday to Saturday</p>
              </div>
            </div>

            {/* Consultation Fees */}
            <div className="bg-paper-white border border-paper-warm rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-4">Consultation Fees</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ink">First Consultation</span>
                  <span className="font-display text-lg text-accent">₹850</span>
                </div>
                <div className="flex justify-between items-center border-t border-paper-warm pt-3">
                  <span className="text-sm text-ink">Follow-up</span>
                  <span className="font-display text-lg text-accent">₹500</span>
                </div>
                <div className="flex justify-between items-center border-t border-paper-warm pt-3">
                  <span className="text-sm text-ink">Counselling <span className="text-ink-muted text-xs">(45 min)</span></span>
                  <span className="font-display text-lg text-accent">₹1,500</span>
                </div>
                <div className="flex justify-between items-center border-t border-paper-warm pt-3">
                  <span className="text-sm text-ink">Online Consultation <span className="text-ink-muted text-xs">(30 min)</span></span>
                  <span className="font-display text-lg text-accent">₹1,200</span>
                </div>
              </div>
            </div>

            {/* Address + Maps */}
            <div className="bg-paper-white border border-paper-warm rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-3">Address</p>
              <p className="text-ink font-medium leading-relaxed mb-4">
                #17 & 18, Ground Floor,<br />
                Ramdhoot Apartment Complex,<br />
                Opposite Sawai Gandharva Hall,<br />
                Deshpande Nagar, Hubballi – 580029<br />
                Karnataka
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#2d6a4f" strokeWidth="2"/>
                  <circle cx="12" cy="9" r="2.5" stroke="#2d6a4f" strokeWidth="2"/>
                </svg>
                Get Directions on Google Maps
              </a>
            </div>

            {/* Contact */}
            <div className="bg-paper-white border border-paper-warm rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-3">Contact</p>
              <div className="space-y-1">
                <a href="tel:+918073398651" className="block text-ink font-medium hover:text-accent transition-colors">
                  📞 80733 98651
                </a>
                <a href="tel:+918363509005" className="block text-ink font-medium hover:text-accent transition-colors">
                  📞 0836-3509005
                </a>
                <a href="mailto:consultdrhuddar@gmail.com" className="block text-sm text-ink-muted hover:text-accent transition-colors mt-1">
                  ✉️ consultdrhuddar@gmail.com
                </a>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/book" className="bg-accent text-white text-sm px-6 py-3 rounded-full font-medium hover:bg-accent-dark transition-colors">
                Book Appointment →
              </Link>
              <a
                href="https://wa.me/918073398651"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white text-sm px-5 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9.18 9.18 0 00-.57-.01c-.198 0-.52.074-.792.372C7.075 10.27 6.335 11 6.335 12.459c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
                Enquire on WhatsApp
              </a>
            </div>
          </div>

          {/* Right — services summary */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "De-addiction (OPD & IPD)", desc: "Alcohol, tobacco, cannabis, gaming, gambling, internet" },
              { label: "Psychiatric Consultation", desc: "Depression, anxiety, OCD, mood disorders & more" },
              { label: "Addiction Psychiatry", desc: "Specialised super-specialty care" },
              { label: "Counselling", desc: "Individual, marital & family counselling" },
            ].map((s) => (
              <div key={s.label} className="bg-paper-white rounded-xl p-5 border border-paper-warm">
                <p className="text-sm font-medium text-ink mb-1">{s.label}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
            <div className="col-span-2">
              <Link href="/services" className="text-sm text-ink-muted hover:text-accent transition-colors flex items-center gap-1">
                View all services & facilities →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
