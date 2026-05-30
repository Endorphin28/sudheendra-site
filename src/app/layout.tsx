import type { Metadata } from "next";
import "@/styles/globals.css";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "Dr. Sudheendra Huddar | Psychiatrist & De-Addiction Specialist, Hubballi",
    template: "%s | Dr. Sudheendra Huddar",
  },
  description:
    "Dr. Sudheendra Huddar — Consultant Psychiatrist & De-Addiction Specialist in Hubballi, Karnataka. MD & DM Addiction Psychiatry from NIMHANS. In-person & online consultations. Book at ₹1,200.",
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
      "Consultant Psychiatrist & De-Addiction Specialist in Hubballi. MD & DM from NIMHANS. In-person & online consultations at ₹1,200.",
    type: "website",
    locale: "en_IN",
    url: "https://doctorhuddar.com",
    siteName: "Dr. Sudheendra Huddar",
    images: [
      {
        url: "/images/doctor/dr-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Sudheendra Huddar — Consultant Psychiatrist, Hubballi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Sudheendra Huddar | Psychiatrist & De-Addiction Specialist, Hubballi",
    description:
      "Consultant Psychiatrist & De-Addiction Specialist in Hubballi, Karnataka. MD & DM from NIMHANS. Book online at ₹1,200.",
    images: ["/images/doctor/dr-portrait.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Physician",
      "@id": "https://doctorhuddar.com/#physician",
      name: "Dr. Sudheendra Huddar",
      url: "https://doctorhuddar.com",
      image: "https://doctorhuddar.com/images/doctor/dr-portrait.jpg",
      description:
        "Consultant Psychiatrist and De-Addiction Specialist in Hubballi, Karnataka. MD & DM Addiction Psychiatry from NIMHANS.",
      medicalSpecialty: ["Psychiatry", "Addiction Medicine"],
      hasCredential: [
        { "@type": "EducationalOccupationalCredential", credentialCategory: "MD Psychiatry", recognizedBy: { "@type": "EducationalOrganization", name: "NIMHANS, Bengaluru" } },
        { "@type": "EducationalOccupationalCredential", credentialCategory: "DM Addiction Psychiatry", recognizedBy: { "@type": "EducationalOrganization", name: "NIMHANS, Bengaluru" } },
      ],
      worksFor: { "@id": "https://doctorhuddar.com/#clinic" },
      telephone: "+918073398651",
      email: "consultdrhuddar@gmail.com",
    },
    {
      "@type": "MedicalBusiness",
      "@id": "https://doctorhuddar.com/#clinic",
      name: "Sukhibhava Healthcare",
      url: "https://doctorhuddar.com",
      image: "https://doctorhuddar.com/images/sukhibhava/reception-1.jpg",
      telephone: "+918073398651",
      email: "consultdrhuddar@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "#17, 18, Ground Floor, Ramdhoot Apartment Complex, Opposite Sawai Gandharva Hall, Deshpande Nagar",
        addressLocality: "Hubballi",
        addressRegion: "Karnataka",
        postalCode: "580029",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 15.3647,
        longitude: 75.1240,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "11:00",
          closes: "14:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "15:00",
          closes: "20:00",
        },
      ],
      priceRange: "₹₹",
      medicalSpecialty: "Psychiatry",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
