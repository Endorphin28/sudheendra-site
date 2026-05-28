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
        </div>

        <div className="flex gap-12 text-sm text-ink-muted">
          <div className="flex flex-col gap-2">
            <span className="text-ink-soft font-medium text-xs uppercase tracking-wider">
              Clinical
            </span>
            <Link href="/services" className="hover:text-ink transition-colors">
              Services
            </Link>
            <Link href="/services#contact" className="hover:text-ink transition-colors">
              Book appointment
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-ink-soft font-medium text-xs uppercase tracking-wider">
              Work
            </span>
            <Link href="/products" className="hover:text-ink transition-colors">
              Products
            </Link>
            <Link href="/research" className="hover:text-ink transition-colors">
              Research
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-6">
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} Dr. Sudheendra Huddar · Sukhibhava Healthcare
        </p>
      </div>
    </footer>
  );
}
