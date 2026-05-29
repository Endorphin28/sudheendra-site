import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Online Consultation | ₹700 · 30 min",
  description:
    "Book an online psychiatry consultation with Dr. Sudheendra Huddar. Available Mon, Wed & Fri. ₹700 for 30 minutes. Instant Google Meet link. Secure payment via Razorpay.",
  alternates: { canonical: "https://doctorhuddar.com/book" },
  openGraph: {
    title: "Book Online Consultation with Dr. Sudheendra Huddar",
    description:
      "Online psychiatry consultation — ₹700 for 30 minutes. Available Mon, Wed & Fri. Google Meet link sent instantly after booking.",
    url: "https://doctorhuddar.com/book",
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
