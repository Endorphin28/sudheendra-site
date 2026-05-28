import Link from "next/link";

const products = [
  {
    id: "verbatim",
    name: "VERBATIM",
    tagline: "Speak. Prescribe. Done.",
    description:
      "Voice and text to structured, print-ready prescriptions. Built for my own OPD — designed for every psychiatrist.",
    status: "Beta",
    statusColor: "bg-accent/10 text-accent",
  },
  {
    id: "kairos",
    name: "Kairos",
    tagline: "Clinical platform for de-addiction centres",
    description:
      "Multi-tenant SaaS EMR for psychiatric and de-addiction clinics. Episode-centric data model, built on Next.js + Supabase.",
    status: "In development",
    statusColor: "bg-paper-warm text-ink-muted",
  },
  {
    id: "drishti",
    name: "DRISHTI",
    tagline: "Multimodal clinical assessment",
    description:
      "Facial action unit and voice analysis for psychiatric interviews. Multilingual transcription in English, Hindi, Kannada.",
    status: "Research",
    statusColor: "bg-paper-warm text-ink-muted",
  },
];

export default function ProductsPreview() {
  return (
    <section className="py-20 px-6 bg-paper-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">
              What I&apos;m building
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-ink">
              Tools from the clinic floor
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex text-sm text-ink-muted hover:text-ink transition-colors items-center gap-1"
          >
            All products →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products#${p.id}`}
              className="group block bg-paper rounded-2xl p-6 border border-paper-warm hover:border-accent/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-display text-xl text-ink">{p.name}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-accent font-medium mb-3 tracking-wide">
                {p.tagline}
              </p>
              <p className="text-sm text-ink-muted leading-relaxed">
                {p.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="md:hidden mt-6 text-center">
          <Link href="/products" className="text-sm text-ink-muted hover:text-ink">
            See all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
