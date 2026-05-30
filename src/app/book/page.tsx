"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  format, startOfMonth, getDaysInMonth, addMonths, subMonths,
  isBefore, isToday, startOfDay,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TZ = "Asia/Kolkata";
const ALLOWED_DAYS = [1, 3, 5]; // Mon, Wed, Fri
const AMOUNT = 1200;
const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ConsultType = "online" | "inperson" | null;
type Step = 1 | 2 | 3 | 4;

type Slot = {
  label: string;
  startISO: string;
  endISO: string;
  available: boolean;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string;
  description: string; order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (r: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal: { ondismiss: () => void };
}

// ── Calendar helpers ──────────────────────────────────────────────────────────

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(firstDay);
  // Mon-first offset: Mon=0, Tue=1, ..., Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

function isAvailableDay(date: Date): boolean {
  const todayIST = startOfDay(toZonedTime(new Date(), TZ));
  const dateIST  = startOfDay(toZonedTime(date, TZ));
  if (!isBefore(todayIST, dateIST) && !isToday(dateIST)) return false; // past
  if (isBefore(dateIST, todayIST)) return false;
  return ALLOWED_DAYS.includes(date.getDay());
}

function formatDateDisplay(d: Date) {
  return format(d, "EEEE, d MMMM yyyy");
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookPage() {
  const [consultType, setConsultType] = useState<ConsultType>(null);
  const [step, setStep]               = useState<Step>(1);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = toZonedTime(new Date(), TZ);
    return startOfMonth(now);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots]             = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm]               = useState({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors]   = useState<Record<string, string>>({});
  const [bookingId, setBookingId]     = useState("");
  const [meetLink, setMeetLink]       = useState("");
  const [paying, setPaying]           = useState(false);
  const [error, setError]             = useState("");
  const slotRef = useRef<HTMLDivElement>(null);

  // Load Razorpay script
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  // Scroll to slots when they load
  useEffect(() => {
    if (slots.length > 0 && slotRef.current) {
      setTimeout(() => slotRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [slots]);

  async function handleDateSelect(date: Date) {
    if (!isAvailableDay(date)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    setLoadingSlots(true);
    try {
      const res  = await fetch(`/api/slots?date=${format(date, "yyyy-MM-dd")}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {
      setError("Failed to load slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
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
    setPaying(true); setError("");
    try {
      const res   = await fetch("/api/booking/create", {
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

      const rzp = new window.Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount:      order.amount,
        currency:    order.currency,
        name:        "Sukhibhava Healthcare",
        description: `Online Consultation — ${selectedSlot!.label}`,
        order_id:    order.orderId,
        prefill:     { name: form.name, email: form.email, contact: form.phone },
        theme:       { color: "#2d6a4f" },
        handler: async (response) => {
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
          if (result.success) { setMeetLink(result.meetLink); setStep(4); }
          else setError("Payment verification failed. Contact us if charged.");
          setPaying(false);
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPaying(false);
    }
  }

  const monthGrid = getMonthGrid(currentMonth.getFullYear(), currentMonth.getMonth());

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 min-h-screen bg-paper">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl text-ink">Book an Appointment</h1>
            <p className="text-ink-muted mt-2 text-sm">with Dr. Sudheendra Huddar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          {/* ── Choose consultation type ── */}
          {!consultType && (
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Online */}
              <button
                onClick={() => setConsultType("online")}
                className="bg-paper-white border-2 border-paper-warm hover:border-accent rounded-2xl p-6 text-left transition-all group"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="15" height="11" rx="2" stroke="#2d6a4f" strokeWidth="1.8"/>
                    <path d="M17 7.5l5-2v9l-5-2V7.5z" stroke="#2d6a4f" strokeWidth="1.8" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="font-display text-xl text-ink mb-1">Online Consultation</h2>
                <p className="text-xs text-accent font-medium mb-2">₹1,200 · 30 minutes · Google Meet</p>
                <p className="text-sm text-ink-muted">Book a slot, pay online and receive a Google Meet link instantly.</p>
                <p className="mt-4 text-xs text-accent font-medium">Mon, Wed & Fri only →</p>
              </button>

              {/* In-person */}
              <button
                onClick={() => setConsultType("inperson")}
                className="bg-paper-white border-2 border-paper-warm hover:border-accent rounded-2xl p-6 text-left transition-all group"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#2d6a4f" strokeWidth="1.8"/>
                    <circle cx="12" cy="9" r="2.5" stroke="#2d6a4f" strokeWidth="1.8"/>
                  </svg>
                </div>
                <h2 className="font-display text-xl text-ink mb-1">In-person Consultation</h2>
                <div className="space-y-0.5 mb-3">
                  <p className="text-xs text-accent font-medium">First visit — ₹850</p>
                  <p className="text-xs text-accent font-medium">Follow-up — ₹500</p>
                  <p className="text-xs text-accent font-medium">Counselling — ₹1,500 (45 min)</p>
                </div>
                <p className="text-sm text-ink-muted">Walk in during OPD hours or call us to check availability.</p>
                <p className="mt-4 text-xs text-accent font-medium">Mon–Sat, 11am–2pm & 3pm–8pm →</p>
              </button>

            </div>
          )}

          {/* ── In-person contact ── */}
          {consultType === "inperson" && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm overflow-hidden">
              <div className="bg-accent px-6 py-6">
                <button onClick={() => setConsultType(null)} className="text-accent-light text-sm mb-3 flex items-center gap-1">← Back</button>
                <h2 className="font-display text-2xl text-white">In-person Consultation</h2>
                <p className="text-accent-light text-sm mt-1">Sukhibhava Healthcare · Hubballi</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-paper rounded-xl border border-paper-warm p-4 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-ink-faint">OPD Timings</p>
                  <p className="text-sm font-medium text-ink">Monday to Saturday</p>
                  <p className="text-sm text-ink-muted">11:00 AM – 2:00 PM  &  3:00 PM – 8:00 PM</p>
                </div>
                <div className="bg-paper rounded-xl border border-paper-warm p-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-ink-faint">Consultation Fees</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-paper-white rounded-lg p-2">
                      <p className="text-xs text-ink-muted">First visit</p>
                      <p className="font-display text-lg text-accent">₹850</p>
                    </div>
                    <div className="bg-paper-white rounded-lg p-2">
                      <p className="text-xs text-ink-muted">Follow-up</p>
                      <p className="font-display text-lg text-accent">₹500</p>
                    </div>
                    <div className="bg-paper-white rounded-lg p-2">
                      <p className="text-xs text-ink-muted">Counselling</p>
                      <p className="font-display text-lg text-accent">₹1,500</p>
                    </div>
                  </div>
                </div>
                <div className="bg-paper rounded-xl border border-paper-warm p-4">
                  <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Address</p>
                  <p className="text-sm text-ink leading-relaxed mb-3">#17, 18, Ground Floor, Ramdhoot Apartment Complex, Opp. Sawai Gandharva Hall, Deshpande Nagar, Hubballi – 580029</p>
                  <a href="https://share.google/ozC7F3JAP8iYPZ8G5" target="_blank" rel="noopener noreferrer" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">📍 Get Directions on Google Maps</a>
                </div>
                <p className="text-sm text-ink-muted text-center">Contact us to confirm availability before visiting</p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:+918073398651"
                    className="flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-full text-sm font-medium hover:bg-accent-dark transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    Call Now
                  </a>
                  <a
                    href="https://wa.me/918073398651"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9.18 9.18 0 00-.57-.01c-.198 0-.52.074-.792.372C7.075 10.27 6.335 11 6.335 12.459c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.855L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── Online: Step indicator ── */}
          {consultType === "online" && step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <button onClick={() => setConsultType(null)} className="text-sm text-ink-muted mr-2 hover:text-ink">←</button>
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                    ${step === s ? "bg-accent text-white" : step > s ? "bg-accent-light text-white" : "bg-paper-warm text-ink-faint"}`}>
                    {step > s ? "✓" : s}
                  </div>
                  {s < 3 && <div className={`w-8 h-px ${step > s ? "bg-accent-light" : "bg-paper-warm"}`} />}
                </div>
              ))}
            </div>
          )}

          {/* ── Step 1: Full Month Calendar + Slot picker ── */}
          {consultType === "online" && step === 1 && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm p-6">
              <div className="mb-2">
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-1">Online Consultation · ₹1,200 · 30 min</p>
                <h2 className="font-display text-xl text-ink">Select a date</h2>
                <p className="text-sm text-ink-muted">Available Monday, Wednesday & Friday</p>
              </div>

              {/* Month navigation */}
              <div className="flex items-center justify-between my-5">
                <button
                  onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                  className="p-2 rounded-lg hover:bg-paper-warm transition-colors text-ink-muted hover:text-ink"
                >
                  ←
                </button>
                <h3 className="font-medium text-ink text-sm">{format(currentMonth, "MMMM yyyy")}</h3>
                <button
                  onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                  className="p-2 rounded-lg hover:bg-paper-warm transition-colors text-ink-muted hover:text-ink"
                >
                  →
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_HEADERS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-ink-faint py-1">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {monthGrid.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const available = isAvailableDay(date);
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isPast = isBefore(startOfDay(toZonedTime(date, TZ)), startOfDay(toZonedTime(new Date(), TZ)));

                  return (
                    <button
                      key={i}
                      onClick={() => available && handleDateSelect(date)}
                      disabled={!available}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                        ${isSelected ? "bg-accent text-white font-medium" : ""}
                        ${available && !isSelected ? "hover:bg-accent/10 text-ink font-medium cursor-pointer" : ""}
                        ${!available && !isPast ? "text-ink-faint cursor-not-allowed" : ""}
                        ${isPast ? "text-ink-faint/40 cursor-not-allowed" : ""}
                      `}
                    >
                      {format(date, "d")}
                    </button>
                  );
                })}
              </div>

              {/* Slot picker — appears below calendar on date select */}
              {selectedDate && (
                <div ref={slotRef} className="mt-6 pt-6 border-t border-paper-warm">
                  <p className="text-sm font-medium text-ink mb-3">
                    {formatDateDisplay(selectedDate)} — select a slot
                  </p>

                  {loadingSlots ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-paper-warm animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.startISO}
                          onClick={() => slot.available && setSelectedSlot(slot)}
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
                              <p className="text-xs opacity-70 mt-0.5">30 min · Online · Google Meet</p>
                            </div>
                            {!slot.available && (
                              <span className="text-xs px-3 py-1 bg-paper-white rounded-full text-ink-faint border border-paper-warm">Booked</span>
                            )}
                            {slot.available && selectedSlot?.startISO === slot.startISO && (
                              <span className="text-lg">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedSlot && (
                    <button
                      onClick={() => setStep(2)}
                      className="mt-4 w-full bg-accent text-white py-3 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors"
                    >
                      Continue — {selectedSlot.label} →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Patient Details ── */}
          {consultType === "online" && step === 2 && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm p-6">
              <button onClick={() => setStep(1)} className="text-sm text-ink-muted mb-4 flex items-center gap-1 hover:text-ink">
                ← {selectedSlot?.label} · {selectedDate && format(selectedDate, "EEE, d MMM")}
              </button>
              <h2 className="font-display text-xl text-ink mb-1">Your details</h2>
              <p className="text-sm text-ink-muted mb-6">We&apos;ll send your confirmation and Meet link here</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-soft uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-xl border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${formErrors.name ? "border-red-300" : "border-paper-warm"}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-soft uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${formErrors.email ? "border-red-300" : "border-paper-warm"}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-soft uppercase tracking-wider mb-1.5">Mobile Number *</label>
                  <div className="flex">
                    <span className="px-3 py-3 border border-r-0 border-paper-warm rounded-l-xl bg-paper-warm text-sm text-ink-muted">+91</span>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile number" maxLength={10}
                      className={`flex-1 px-4 py-3 rounded-r-xl border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors ${formErrors.phone ? "border-red-300" : "border-paper-warm"}`}
                    />
                  </div>
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
              </div>
              <button onClick={() => { if (validateForm()) setStep(3); }}
                className="mt-6 w-full bg-accent text-white py-3 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ── Step 3: Review + Pay ── */}
          {consultType === "online" && step === 3 && selectedDate && selectedSlot && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm p-6">
              <button onClick={() => setStep(2)} className="text-sm text-ink-muted mb-4 flex items-center gap-1 hover:text-ink">← Edit details</button>
              <h2 className="font-display text-xl text-ink mb-6">Review & Pay</h2>

              <div className="bg-paper rounded-xl border border-paper-warm p-4 mb-6 space-y-3">
                {[
                  ["Doctor",  "Dr. Sudheendra Huddar"],
                  ["Type",    "Online Consultation"],
                  ["Date",    formatDateDisplay(selectedDate)],
                  ["Time",    `${selectedSlot.label} IST`],
                  ["Patient", form.name],
                  ["Phone",   `+91 ${form.phone}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-ink-muted">{label}</span>
                    <span className="text-ink font-medium text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
                <div className="border-t border-paper-warm pt-3 flex justify-between">
                  <span className="font-medium text-ink">Total</span>
                  <span className="font-display text-xl text-accent">₹1,200</span>
                </div>
              </div>

              <p className="text-xs text-ink-muted mb-4 text-center">🔒 Secure payment via Razorpay · UPI / Cards / Net Banking</p>
              <button onClick={handlePayment} disabled={paying}
                className="w-full bg-accent text-white py-3.5 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {paying ? "Processing..." : "Pay ₹1,200 & Confirm Booking"}
              </button>
            </div>
          )}

          {/* ── Step 4: Confirmation ── */}
          {consultType === "online" && step === 4 && selectedDate && selectedSlot && (
            <div className="bg-paper-white rounded-2xl border border-paper-warm overflow-hidden">
              <div className="bg-accent px-6 py-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
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
                    <span className="text-ink font-medium">₹1,200</span>
                  </div>
                  {bookingId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-muted">Booking ID</span>
                      <span className="text-ink-faint text-xs font-mono">{bookingId.slice(0, 8)}...</span>
                    </div>
                  )}
                </div>

                {meetLink && (
                  <a href={meetLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-accent text-white py-3.5 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h8a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="white" strokeWidth="1.2"/>
                      <path d="M11 6.5l4-2v7l-4-2V6.5z" stroke="white" strokeWidth="1.2"/>
                    </svg>
                    Join Google Meet
                  </a>
                )}

                <p className="text-xs text-ink-muted text-center pt-1">
                  Questions? Call{" "}
                  <a href="tel:+918073398651" className="text-accent hover:underline">80733 98651</a>
                  {" "}or{" "}
                  <a href="https://wa.me/918073398651" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">WhatsApp us</a>
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
