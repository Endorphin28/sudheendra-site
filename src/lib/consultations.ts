// Single source of truth for online consultation types and fees.
// Kept in sync with The ADHD Chapter booking page (bookings.tealfeed.com).

export const CONSULT_TYPES = {
  intake: {
    name: "Intake Consultation",
    audience: "New patients",
    minutes: 45,
    fee: 3000,
    description: "First consultation: a detailed assessment of your concerns and history, and a personalised treatment plan.",
  },
  followup: {
    name: "Follow-up Consultation",
    audience: "Existing patients",
    minutes: 30,
    fee: 1800,
    description: "Regular review of your progress, medication and treatment plan.",
  },
  quick: {
    name: "Quick Follow-up",
    audience: "Existing patients",
    minutes: 15,
    fee: 900,
    description: "Brief check-in for stable patients: prescription renewal or a short review.",
  },
} as const;

export type ConsultTypeKey = keyof typeof CONSULT_TYPES;

export const CONSULT_TYPE_KEYS = Object.keys(CONSULT_TYPES) as ConsultTypeKey[];

export function isConsultType(value: unknown): value is ConsultTypeKey {
  return typeof value === "string" && value in CONSULT_TYPES;
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
