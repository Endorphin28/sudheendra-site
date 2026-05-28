"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { format, addDays, startOfDay, isBefore } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TZ = "Asia/Kolkata";
const ALLOWED_DAYS = [1, 3, 5]; // Mon, Wed, Fri

type Slot = {
  label: string;
  startISO: string;
  endISO: string;
  available: boolean;
};

type Step = 1 | 2 | 3 | 4 | 5;

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal: { ondismiss: () => void };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNext90Days(): Date[] {
  const days: Date[] = [];
  const today = startOfDay(toZonedTime(new Date(), TZ));
  for (let i = 1; i <= 90; i++) {
    const d = addDays(today, i);
    if (ALLOWED_DAYS.includes(d.getDay())) days.push(d);
  }
  return days;
}

function formatDateDisplay(d: Date) {
  return format(d, "EEEE, d MMMM yyyy");
}

function formatIST(iso: string) {
  return format(toZonedTime(new Date(iso), TZ), "h:mm a 'IST'");
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookPage() {
  const [step, setStep]               = useState<Step>(1);
  const [availableDays]               = useState<Date[]>(getNext90Days);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots]             = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm]               = useState({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors]   = useState<Record<string, string>>({});
  const [bookingId, setBookingId]     = useState<string>("");
  const [meetLink, setMeetLink]       = useState<string>("");
  const [paying, setPaying]           = useState(false);
  const [error, setError]             = useState<string>("");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Fetch slots when date selected
  async function fetchSlots(date: Date) {
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    const dateStr = format(date, "yyyy-MM-dd");
    try {
      const res = await fetch(`/api/slots?date=${dateStr}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {
      setError("Failed to load slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    fetchSlots(date);
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!form.name.trim())  errors.name  = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) errors.phone = "Enter valid 10-digit mobile number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handlePayment() {
    if (!validateForm()) return;
    setPaying(true);
    setError("");

    try {
      // Create order
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName:  form.name,
          patientEmail: form.email,
          patientPhone: form.phone,
          slotStart:    selectedSlot!.startISO,
          slotEnd:      selectedSlot!.endISO,
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.error);

      setBookingId(order.bookingId);

      // Open Razorpay
      const rzp = new window.Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount:      order.amount,
        currency:    order.currency,
        name:        "Sukhibhava Healthcare",
        description: `Online Consultation — ${selectedSlot!.label}`,
        order_id:    order.orderId,
        prefill: {
          name:    form.name,
          email:   form.email,
          contact: form.phone,
        },
        theme: { color: "#2d6a4f" },
        handler: async (response) => {
          // Verify payment
          const verifyRes = await fetch("/api/booking/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              bookingId:           order.bookingId,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            setMeetLink(result.meetLink);
            setStep(5);
          } else {
            setError("Payment verification failed. Contact us if charged.");
          }
          setPaying(false);
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPaying(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 min-h-screen bg-paper">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">
              Online Consultation · ₹700 · 30 min
            </p>
            <h1 className="font-display text-4xl text-ink">Book an Appointment</h1>
            <p className="text-ink-muted mt-2 text-sm">with Dr. Sudheendra Huddar</p>
          </div>

          {/* Step indicator */}
          {step < 5 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1,2,3,4].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                    ${step === s ? "bg-accent text-white" : step > s ? "bg-accent-light text-white" : "bg-paper-warm text-ink-faint"}`}>
                    {step > s ? "✓" : s}
                  </div>
                  {s < 4 && <div className={`w-8 h-px ${step > s ? "bg-accent-light" : "bg-paper-warm"}`} />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* ── Step 1: Date Picker ── */}
          {step === 1 && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm p-6">
              <h2 className="font-display text-xl text-ink mb-1">Select a date</h2>
              <p className="text-sm text-ink-muted mb-6">Available Monday, Wednesday & Friday</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableDays.map((day) => {
                  const isSelected = selectedDate?.toDateString() === day.toDateString();
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateSelect(day)}
                      className={`p-3 rounded-xl text-center transition-all border ${
                        isSelected
                          ? "bg-accent text-white border-accent"
                          : "bg-paper border-paper-warm hover:border-accent hover:bg-paper-white text-ink"
                      }`}
                    >
                      <p className="text-xs font-medium">{format(day, "EEE")}</p>
                      <p className="text-lg font-display leading-tight">{format(day, "d")}</p>
                      <p className="text-xs opacity-70">{format(day, "MMM")}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => { if (selectedDate) setStep(2); }}
                disabled={!selectedDate}
                className="mt-6 w-full bg-accent text-white py-3 rounded-full font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-dark transition-colors"
              >
                {selectedDate ? `Continue — ${format(selectedDate, "EEE, d MMM")}` : "Select a date to continue"}
              </button>
            </div>
          )}

          {/* ── Step 2: Slot Selection ── */}
          {step === 2 && selectedDate && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm p-6">
              <button onClick={() => setStep(1)} className="text-sm text-ink-muted mb-4 flex items-center gap-1 hover:text-ink">
                ← {formatDateDisplay(selectedDate)}
              </button>
              <h2 className="font-display text-xl text-ink mb-1">Select a time slot</h2>
              <p className="text-sm text-ink-muted mb-6">IST (India Standard Time)</p>

              {loadingSlots ? (
                <div className="space-y-3">
                  {[1,2].map(i => <div key={i} className="h-16 rounded-xl bg-paper-warm animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.startISO}
                      onClick={() => { if (slot.available) setSelectedSlot(slot); }}
                      disabled={!slot.available}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        !slot.available
                          ? "bg-paper-warm border-paper-warm text-ink-faint cursor-not-allowed"
                          : selectedSlot?.startISO === slot.startISO
                          ? "bg-accent text-white border-accent"
                          : "bg-paper border-paper-warm hover:border-accent text-ink"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{slot.label}</p>
                          <p className="text-xs opacity-70 mt-0.5">30 min · Online Consultation</p>
                        </div>
                        {!slot.available && (
                          <span className="text-xs px-3 py-1 bg-paper-white rounded-full text-ink-faint border border-paper-warm">
                            Booked
                          </span>
                        )}
                        {slot.available && selectedSlot?.startISO === slot.startISO && (
                          <span className="text-lg">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => { if (selectedSlot) setStep(3); }}
                disabled={!selectedSlot}
                className="mt-6 w-full bg-accent text-white py-3 rounded-full font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-dark transition-colors"
              >
                {selectedSlot ? `Continue — ${selectedSlot.label}` : "Select a slot to continue"}
              </button>
            </div>
          )}

          {/* ── Step 3: Patient Details ── */}
          {step === 3 && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm p-6">
              <button onClick={() => setStep(2)} className="text-sm text-ink-muted mb-4 flex items-center gap-1 hover:text-ink">
                ← {selectedSlot?.label}
              </button>
              <h2 className="font-display text-xl text-ink mb-1">Your details</h2>
              <p className="text-sm text-ink-muted mb-6">We&apos;ll use this to send your confirmation</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-xl border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${formErrors.name ? "border-red-300" : "border-paper-warm"}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${formErrors.email ? "border-red-300" : "border-paper-warm"}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="px-3 py-3 border border-r-0 border-paper-warm rounded-l-xl bg-paper-warm text-sm text-ink-muted">+91</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`flex-1 px-4 py-3 rounded-r-xl border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${formErrors.phone ? "border-red-300" : "border-paper-warm"}`}
                    />
                  </div>
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <button
                onClick={() => { if (validateForm()) setStep(4); }}
                className="mt-6 w-full bg-accent text-white py-3 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* ── Step 4: Review + Pay ── */}
          {step === 4 && selectedDate && selectedSlot && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm p-6">
              <button onClick={() => setStep(3)} className="text-sm text-ink-muted mb-4 flex items-center gap-1 hover:text-ink">
                ← Edit details
              </button>
              <h2 className="font-display text-xl text-ink mb-6">Review & Pay</h2>

              {/* Summary */}
              <div className="bg-paper rounded-xl border border-paper-warm p-4 mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Doctor</span>
                  <span className="text-ink font-medium">Dr. Sudheendra Huddar</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Type</span>
                  <span className="text-ink">Online Consultation</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Date</span>
                  <span className="text-ink font-medium">{formatDateDisplay(selectedDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Time</span>
                  <span className="text-ink font-medium">{selectedSlot.label} IST</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Patient</span>
                  <span className="text-ink">{form.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Phone</span>
                  <span className="text-ink">+91 {form.phone}</span>
                </div>
                <div className="border-t border-paper-warm pt-3 flex justify-between">
                  <span className="font-medium text-ink">Total</span>
                  <span className="font-display text-xl text-accent">₹700</span>
                </div>
              </div>

              <p className="text-xs text-ink-muted mb-4 text-center">
                🔒 Secure payment via Razorpay · UPI / Cards / Net Banking
              </p>

              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full bg-accent text-white py-3.5 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {paying ? "Processing..." : "Pay ₹700 & Confirm Booking"}
              </button>
            </div>
          )}

          {/* ── Step 5: Confirmation ── */}
          {step === 5 && selectedDate && selectedSlot && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm overflow-hidden">
              <div className="bg-accent px-6 py-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h2 className="font-display text-2xl text-white mb-1">Booking Confirmed!</h2>
                <p className="text-accent-light text-sm">Check your email for confirmation details</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-paper rounded-xl border border-paper-warm p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">Date & Time</span>
                    <span className="text-ink font-medium text-right">
                      {formatDateDisplay(selectedDate)}<br />
                      <span className="text-accent">{selectedSlot.label} IST</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">Patient</span>
                    <span className="text-ink">{form.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">Amount Paid</span>
                    <span className="text-ink font-medium">₹700</span>
                  </div>
                  {bookingId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-muted">Booking ID</span>
                      <span className="text-ink-faint text-xs font-mono">{bookingId.slice(0,8)}...</span>
                    </div>
                  )}
                </div>

                {meetLink && (
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-accent text-white py-3.5 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h8a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="white" strokeWidth="1.2"/>
                      <path d="M11 6.5l4-2v7l-4-2V6.5z" stroke="white" strokeWidth="1.2"/>
                    </svg>
                    Join Google Meet
                  </a>
                )}

                <div className="text-center pt-2">
                  <p className="text-xs text-ink-muted">
                    Questions? Call us at{" "}
                    <a href="tel:+918073398651" className="text-accent hover:underline">80733 98651</a>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
