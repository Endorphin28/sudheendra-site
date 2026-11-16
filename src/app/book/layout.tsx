import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book an online psychiatry consultation with Dr. Sudheendra Huddar: intake for new patients or follow-up. Instant Google Meet link. Secure payment via Razorpay.",
  alternates: { canonical: "https://doctorhuddar.com/book" },
  openGraph: {
    title: "Book an Appointment with Dr. Sudheendra Huddar",
    description:
      "Online psychiatry consultation: intake or follow-up. Google Meet link sent instantly after booking.",
    url: "https://doctorhuddar.com/book",
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
