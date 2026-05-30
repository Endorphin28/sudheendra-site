import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-paper-warm bg-paper-white mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-display text-ink text-lg mb-1">
            Dr. Sudheendra Huddar
          </p>
          <p className="text-sm text-ink-muted">
            MD Psychiatry · DM Addiction Psychiatry · NIMHANS
          </p>
          <p className="text-sm text-ink-muted mt-1">Hubballi, Karnataka</p>
          <p className="text-sm text-ink-muted mt-1">
            <a href="tel:+918073398651" className="hover:text-accent transition-colors">80733 98651</a>
            {" · "}
            <a href="https://wa.me/918073398651" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
          </p>
        </div>

        <div className="flex gap-12 text-sm text-ink-muted">
          <div className="flex flex-col gap-2">
            <span className="text-ink-soft font-medium text-xs uppercase tracking-wider">
              Clinical
            </span>
            <Link href="/services" className="hover:text-ink transition-colors">Services</Link>
            <Link href="/faq" className="hover:text-ink transition-colors">FAQ</Link>
            <Link href="/book" className="hover:text-ink transition-colors">Book Appointment</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-ink-soft font-medium text-xs uppercase tracking-wider">
              Info
            </span>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy & Telemedicine</Link>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-6 flex flex-col sm:flex-row justify-between gap-2">
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} Dr. Sudheendra Huddar · Sukhibhava Healthcare
        </p>
        <p className="text-xs text-ink-faint">
          <Link href="/privacy" className="hover:text-ink-muted transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
}
