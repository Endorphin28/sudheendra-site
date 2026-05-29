import type { Metadata } from "next";
import "@/styles/globals.css";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "Dr. Sudheendra Huddar | Psychiatrist & De-Addiction Specialist, Hubballi",
    template: "%s | Dr. Sudheendra Huddar",
  },
  description:
    "Dr. Sudheendra Huddar is a Consultant Psychiatrist and De-Addiction Specialist in Hubballi, Karnataka. MD & DM Addiction Psychiatry from NIMHANS. Online consultations available. Book at ₹700.",
  keywords: [
    "psychiatrist Hubballi",
    "psychiatrist Hubli",
    "de-addiction centre Hubballi",
    "addiction psychiatry Karnataka",
    "online psychiatry consultation India",
    "NIMHANS psychiatrist",
    "de-addiction specialist Karnataka",
    "Sukhibhava Healthcare",
    "Parivartan VGH de-addiction",
    "Dr Sudheendra Huddar",
    "mental health Hubballi",
    "alcohol de-addiction Hubballi",
  ],
  authors: [{ name: "Dr. Sudheendra Huddar" }],
  metadataBase: new URL("https://doctorhuddar.com"),
  alternates: { canonical: "https://doctorhuddar.com" },
  openGraph: {
    title: "Dr. Sudheendra Huddar | Psychiatrist & De-Addiction Specialist, Hubballi",
    description:
      "Consultant Psychiatrist and De-Addiction Specialist in Hubballi. MD & DM from NIMHANS. OPD, inpatient care, and online consultations. Book at ₹700.",
    type: "website",
    locale: "en_IN",
    url: "https://doctorhuddar.com",
    siteName: "Dr. Sudheendra Huddar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Sudheendra Huddar | Psychiatrist & De-Addiction Specialist, Hubballi",
    description:
      "Consultant Psychiatrist and De-Addiction Specialist in Hubballi, Karnataka. MD & DM from NIMHANS. Book online consultations at ₹700.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
