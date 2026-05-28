import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Dr. Sudheendra Huddar — Psychiatrist & Builder",
  description:
    "Consultant Neuropsychiatrist, De-addiction Specialist, and founder of SukhiBhava Healthcare. Building tools for better mental healthcare in India.",
  keywords: [
    "psychiatrist Hubballi",
    "de-addiction Karnataka",
    "PARIVARTAN de-addiction",
    "SukhiBhava",
    "NIMHANS psychiatry",
    "addiction psychiatry India",
  ],
  authors: [{ name: "Dr. Sudheendra Huddar" }],
  openGraph: {
    title: "Dr. Sudheendra Huddar — Psychiatrist & Builder",
    description:
      "Consultant Neuropsychiatrist and founder building tools for better mental healthcare.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
