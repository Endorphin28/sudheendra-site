"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, getDaysInMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  DEFAULT_SCHEDULE, TIME_OPTIONS, WEEKDAYS, WEEK_ORDER,
  formatDays, formatTime, toMinutes, type Schedule,
} from "@/lib/schedule-shared";

const TZ = "Asia/Kolkata";

type Booking = {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_type: string;
  slot_start: string;
  slot_end: string;
  amount: number;
  payment_status: string;
  booking_status: string;
  meet_link: string;
  razorpay_payment_id: string;
  created_at: string;
};

type BlockedSlot = {
  id: string;
  date: string;
  slot_start: string | null;
  slot_end: string | null;
  reason: string;
};

type Tab = "bookings" | "availability";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending:   "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  paid:      "bg-green-100 text-green-800",
  failed:    "bg-red-100 text-red-800",
};

function formatIST(iso: string) {
  return format(toZonedTime(new Date(iso), TZ), "d MMM yyyy, h:mm a");
}

// ── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { onLogin(); }
    else { setError((await res.json().catch(() => ({}))).error ?? "Incorrect password"); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="bg-paper-white border border-paper-warm rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">Admin</p>
          <h1 className="font-display text-3xl text-ink">Dr. Huddar Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">doctorhuddar.com</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-soft uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-paper-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-full font-medium text-sm hover:bg-accent-dark transition-colors disabled:opacity-60">
            {loading ? "Verifying..." : "Login →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Bookings Tab ─────────────────────────────────────────────────────────────

function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/bookings?status=${filter}`);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, booking_status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, booking_status }),
    });
    load();
  }

  const upcoming = bookings.filter(b =>
    new Date(b.slot_start) >= new Date() && b.booking_status === "confirmed"
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: bookings.length, color: "text-ink" },
          { label: "Confirmed", value: bookings.filter(b => b.booking_status === "confirmed").length, color: "text-green-600" },
          { label: "Pending", value: bookings.filter(b => b.booking_status === "pending").length, color: "text-yellow-600" },
          { label: "Upcoming", value: upcoming.length, color: "text-accent" },
        ].map((s) => (
          <div key={s.label} className="bg-paper-white border border-paper-warm rounded-xl p-4">
            <p className="text-xs text-ink-faint uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-display text-3xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "confirmed", "pending", "cancelled"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition-colors ${
              filter === s ? "bg-accent text-white" : "bg-paper-white border border-paper-warm text-ink-muted hover:border-accent"
            }`}>
            {s}
          </button>
        ))}
        <button onClick={load} className="ml-auto px-4 py-1.5 rounded-full text-sm border border-paper-warm text-ink-muted hover:border-accent transition-colors">
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-paper-warm rounded-xl animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">No bookings found</div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-paper-white border border-paper-warm rounded-xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <p className="font-medium text-ink">{b.patient_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.booking_status] ?? "bg-paper-warm text-ink-muted"}`}>
                      {b.booking_status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.payment_status] ?? "bg-paper-warm text-ink-muted"}`}>
                      {b.payment_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-ink-muted">
                    <span>📅 {formatIST(b.slot_start)}</span>
                    <span>📞 {b.patient_phone}</span>
                    <span>✉️ {b.patient_email}</span>
                    {b.meet_link && (
                      <a href={b.meet_link} target="_blank" rel="noopener noreferrer"
                        className="text-accent hover:underline col-span-2">
                        🎥 Join Meet
                      </a>
                    )}
                    <span className="text-xs text-ink-faint">{b.appointment_type} · ₹{b.amount.toLocaleString("en-IN")} · {b.razorpay_payment_id || "—"}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {b.booking_status !== "confirmed" && (
                    <button onClick={() => updateStatus(b.id, "confirmed")}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors">
                      Confirm
                    </button>
                  )}
                  {b.booking_status !== "cancelled" && (
                    <button onClick={() => updateStatus(b.id, "cancelled")}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-full border border-red-200 hover:bg-red-100 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Availability Tab ──────────────────────────────────────────────────────────

function WeeklyScheduleCard({ schedule, onSaved }: { schedule: Schedule; onSaved: (s: Schedule) => void }) {
  const [days, setDays]   = useState<number[]>(schedule.days);
  const [start, setStart] = useState(schedule.windowStart);
  const [end, setEnd]     = useState(schedule.windowEnd);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setDays(schedule.days); setStart(schedule.windowStart); setEnd(schedule.windowEnd);
  }, [schedule]);

  const dirty =
    start !== schedule.windowStart || end !== schedule.windowEnd ||
    [...days].sort().join() !== [...schedule.days].sort().join();

  function toggleDay(d: number) {
    setMsg(null);
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  }

  async function save() {
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, windowStart: start, windowEnd: end }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { onSaved(data); setMsg({ ok: true, text: "Saved. The booking page now uses this schedule." }); }
    else setMsg({ ok: false, text: data.error ?? "Could not save" });
    setSaving(false);
  }

  const selectCls = "px-3 py-2 rounded-xl border border-paper-warm bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-paper-white border border-paper-warm rounded-2xl p-6">
      <h3 className="font-medium text-ink mb-1">Weekly online schedule</h3>
      <p className="text-xs text-ink-muted mb-5">
        Patients can book within this window. Each session (15, 30 or 45 min) must fit inside it, with a 15-minute gap between appointments.
      </p>

      <p className="text-xs font-medium text-ink-soft uppercase tracking-wider mb-2">Days</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {WEEK_ORDER.map((d) => {
          const on = days.includes(d);
          return (
            <button key={d} type="button" onClick={() => toggleDay(d)}
              className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
                on ? "bg-accent text-white border-accent" : "border-paper-warm text-ink-muted hover:border-ink"
              }`}>
              {WEEKDAYS[d]}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-medium text-ink-soft uppercase tracking-wider mb-2">Time window (IST)</p>
      <div className="flex items-center gap-3 mb-5">
        <select value={start} onChange={(e) => { setStart(e.target.value); setMsg(null); }} className={selectCls}>
          {TIME_OPTIONS.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
        </select>
        <span className="text-sm text-ink-muted">to</span>
        <select value={end} onChange={(e) => { setEnd(e.target.value); setMsg(null); }} className={selectCls}>
          {TIME_OPTIONS.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
        </select>
      </div>

      {days.length === 0 && (
        <p className="text-xs text-orange-600 mb-3">No days selected: online booking will be closed.</p>
      )}
      {msg && <p className={`text-sm mb-3 ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>}

      <button onClick={save} disabled={saving || !dirty}
        className="bg-accent text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
        {saving ? "Saving..." : "Save schedule"}
      </button>
    </div>
  );
}

function AvailabilityTab() {
  const [schedule, setSchedule]         = useState<Schedule | null>(null);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(toZonedTime(new Date(), TZ)));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockType, setBlockType]       = useState<"full" | "range">("full");
  const [rangeStart, setRangeStart]     = useState("");
  const [rangeEnd, setRangeEnd]         = useState("");
  const [reason, setReason]             = useState("");
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");

  const loadBlocked = useCallback(async () => {
    const res = await fetch("/api/admin/blocked-slots");
    if (res.ok) setBlockedSlots(await res.json());
  }, []);

  useEffect(() => {
    loadBlocked();
    fetch("/api/admin/schedule").then((r) => r.json()).then((s) => setSchedule(s.days ? s : DEFAULT_SCHEDULE));
  }, [loadBlocked]);

  // Times within the schedule window, for blocking part of a day
  const windowTimes = schedule
    ? TIME_OPTIONS.filter((t) => toMinutes(t) >= toMinutes(schedule.windowStart) && toMinutes(t) <= toMinutes(schedule.windowEnd))
    : [];

  function selectDate(ds: string) {
    setSelectedDate(ds); setError(""); setBlockType("full");
    setRangeStart(windowTimes[0] ?? ""); setRangeEnd(windowTimes[windowTimes.length - 1] ?? "");
  }

  async function blockDate() {
    if (!selectedDate) return;
    setSaving(true); setError("");
    const payload = blockType === "full"
      ? { date: selectedDate, reason }
      : { date: selectedDate, slot_start: rangeStart, slot_end: rangeEnd, reason };
    const res = await fetch("/api/admin/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setReason(""); setSelectedDate(null);
      await loadBlocked();
    } else {
      setError((await res.json().catch(() => ({}))).error ?? "Could not block");
    }
    setSaving(false);
  }

  async function unblock(id: string) {
    await fetch("/api/admin/blocked-slots", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadBlocked();
  }

  if (!schedule) return <p className="text-sm text-ink-muted">Loading...</p>;

  // Calendar grid
  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = getDaysInMonth(currentMonth);
  const cells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayIST = toZonedTime(new Date(), TZ);

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function getBlockedInfo(day: number) {
    const ds = dateStr(day);
    return blockedSlots.filter(b => b.date === ds);
  }

  const selectCls = "px-3 py-2 rounded-xl border border-paper-warm bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="space-y-8">
      <WeeklyScheduleCard schedule={schedule} onSaved={setSchedule} />

      <div className="grid md:grid-cols-2 gap-8">

        {/* Calendar */}
        <div className="bg-paper-white border border-paper-warm rounded-2xl p-6">
          <h3 className="font-medium text-ink mb-1">Block dates or times</h3>
          <p className="text-xs text-ink-muted mb-4">For leave, holidays or other commitments. Pick a date to block it.</p>
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="p-2 rounded-lg hover:bg-paper-warm transition-colors text-ink-muted">←</button>
            <h3 className="font-medium text-ink">{format(currentMonth, "MMMM yyyy")}</h3>
            <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="p-2 rounded-lg hover:bg-paper-warm transition-colors text-ink-muted">→</button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} className="text-center text-xs font-medium text-ink-faint py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const ds   = dateStr(day);
              const date = new Date(year, month, day);
              const isAllowed = schedule.days.includes(date.getDay());
              const isPast    = date < new Date(todayIST.toDateString());
              const info      = getBlockedInfo(day);
              const blocked   = info.some(b => !b.slot_start);
              const partBlocked = !blocked && info.length > 0;
              const isSelected = selectedDate === ds;

              return (
                <button key={i} onClick={() => isAllowed && !isPast && selectDate(ds)}
                  disabled={!isAllowed || isPast}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all relative ${
                    isSelected     ? "bg-accent text-white" :
                    blocked        ? "bg-red-100 text-red-600" :
                    partBlocked    ? "bg-orange-100 text-orange-600" :
                    isAllowed && !isPast ? "hover:bg-accent/10 text-ink cursor-pointer" :
                    "text-ink-faint/40 cursor-not-allowed"
                  }`}
                >
                  {day}
                  {partBlocked && <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-orange-400 rounded-full" />}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded" /> Blocked</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-100 rounded" /> Partly blocked</span>
          </div>
        </div>

        {/* Block form + blocked list */}
        <div className="space-y-6">
          {selectedDate ? (
            <div className="bg-paper-white border border-paper-warm rounded-2xl p-6">
              <h3 className="font-medium text-ink mb-4">
                Block: {format(new Date(selectedDate + "T12:00:00"), "EEE, d MMM yyyy")}
              </h3>
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="blockType" checked={blockType === "full"}
                    onChange={() => setBlockType("full")} className="accent-green-600" />
                  <span className="text-sm text-ink">Whole day</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="blockType" checked={blockType === "range"}
                    onChange={() => setBlockType("range")} className="accent-green-600" />
                  <span className="text-sm text-ink">Specific time</span>
                </label>
                {blockType === "range" && (
                  <div className="flex items-center gap-3 pl-7">
                    <select value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} className={selectCls}>
                      {windowTimes.slice(0, -1).map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                    </select>
                    <span className="text-sm text-ink-muted">to</span>
                    <select value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} className={selectCls}>
                      {windowTimes.slice(1).map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (optional, e.g. Leave, Holiday)"
                className="w-full px-4 py-2.5 rounded-xl border border-paper-warm bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent mb-4" />
              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
              <div className="flex gap-3">
                <button onClick={blockDate} disabled={saving}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-full text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60">
                  {saving ? "Blocking..." : blockType === "full" ? "Block whole day" : "Block this time"}
                </button>
                <button onClick={() => setSelectedDate(null)}
                  className="px-4 py-2.5 rounded-full text-sm border border-paper-warm text-ink-muted hover:border-ink transition-colors">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-3">Existing bookings on this date are not cancelled.</p>
            </div>
          ) : (
            <div className="bg-paper-warm/50 border border-paper-warm rounded-2xl p-6 text-center text-sm text-ink-muted">
              {schedule.days.length
                ? `Click a ${formatDays(schedule.days)} date on the calendar to block it`
                : "Online booking is closed: no days are selected in the weekly schedule"}
            </div>
          )}

          {/* Blocked list */}
          <div className="bg-paper-white border border-paper-warm rounded-2xl p-6">
            <h3 className="font-medium text-ink mb-4">Upcoming blocks</h3>
            {blockedSlots.length === 0 ? (
              <p className="text-sm text-ink-muted">Nothing blocked</p>
            ) : (
              <ul className="space-y-2">
                {blockedSlots.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 py-2 border-b border-paper-warm last:border-0">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {format(new Date(b.date + "T12:00:00"), "EEE, d MMM yyyy")}
                        {b.slot_start && b.slot_end
                          ? `, ${formatTime(b.slot_start.slice(0, 5))} – ${formatTime(b.slot_end.slice(0, 5))}`
                          : ", whole day"}
                      </p>
                      {b.reason && <p className="text-xs text-ink-muted">{b.reason}</p>}
                    </div>
                    <button onClick={() => unblock(b.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors flex-shrink-0">
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("bookings");

  // Check if already logged in
  useEffect(() => {
    fetch("/api/admin/bookings?status=all")
      .then(r => { if (r.ok) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  }

  if (checking) {
    return <div className="min-h-screen bg-paper flex items-center justify-center">
      <p className="text-ink-muted text-sm">Loading...</p>
    </div>;
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-paper-white border-b border-paper-warm px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-display text-xl text-ink">Admin Dashboard</p>
          <p className="text-xs text-ink-muted">doctorhuddar.com</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm text-ink-muted hover:text-accent transition-colors">
            View site →
          </a>
          <button onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition-colors">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-paper-warm bg-paper-white px-6">
        <div className="flex gap-1">
          {(["bookings", "availability"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}>
              {t === "bookings" ? "📋 Bookings" : "📅 Availability"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === "bookings"     && <BookingsTab />}
        {tab === "availability" && <AvailabilityTab />}
      </main>
    </div>
  );
}
