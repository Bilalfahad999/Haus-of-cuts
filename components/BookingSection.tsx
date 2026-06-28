"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, ChevronDown, ChevronUp, X, User, Phone, Scissors, Calendar, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

const BARBERS = ["Any Available", "Marcus Reid", "Devon Clarke", "Kai Thompson", "Jordan Mills"];

const SERVICE_OPTIONS = [
  { name: "Classic Haircut", price: 45 },
  { name: "Skin Fade", price: 55 },
  { name: "Buzz Cut", price: 35 },
  { name: "Beard Trim", price: 30 },
  { name: "Hot Towel Shave", price: 50 },
  { name: "Hair & Beard Combo", price: 75 },
  { name: "Kids Haircut", price: 30 },
  { name: "VIP Grooming Package", price: 120 },
];

const TIMES = [
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM","06:30 PM",
];

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone required"),
  barber: z.string().min(1, "Select a barber"),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const FIELD_LABEL = "flex items-center gap-2 text-[0.7rem] font-600 tracking-[0.18em] uppercase text-[#C4783A] mb-2";
const INPUT = "w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-[0.9rem] text-white placeholder-[#555] focus:outline-none focus:border-[rgba(196,120,58,0.5)] focus:bg-[#1e1e1e] transition-all duration-200";
const SELECT = "w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 text-[0.9rem] text-white focus:outline-none focus:border-[rgba(196,120,58,0.5)] transition-all duration-200 appearance-none cursor-pointer";

function ServicesDropdown({ value, onChange, error }: { value: string[]; onChange: (v: string[]) => void; error?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (name: string) =>
    onChange(value.includes(name) ? value.filter((v) => v !== name) : [...value, name]);

  const total = SERVICE_OPTIONS.filter((s) => value.includes(s.name)).reduce((sum, s) => sum + s.price, 0);
  const label = value.length === 0 ? "Select services..." : value.length === 1 ? value[0] : `${value.length} services selected`;

  return (
    <div ref={ref} className="relative">
      <div className={FIELD_LABEL}>
        <Scissors className="w-3.5 h-3.5" />
        Services <span className="text-[#666] normal-case tracking-normal font-400 ml-1">(select one or more)</span>
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${INPUT} flex items-center justify-between text-left`}
        style={{ color: value.length ? "#fff" : "#555" }}
      >
        <span>{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {value.length > 0 && <span className="text-[0.8rem] text-[#C4783A] font-600">${total}</span>}
          {open ? <ChevronUp className="w-4 h-4 text-[#888]" /> : <ChevronDown className="w-4 h-4 text-[#888]" />}
        </div>
      </button>
      {error && <p className="mt-1.5 text-[0.72rem] text-red-400">{error}</p>}

      {open && (
        <div className="absolute z-30 top-full left-0 right-0 bg-[#161616] border border-[rgba(255,255,255,0.08)] rounded-xl mt-1 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          {SERVICE_OPTIONS.map(({ name, price }) => {
            const checked = value.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggle(name)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[rgba(196,120,58,0.06)] transition-colors duration-100 cursor-pointer border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-150"
                    style={{ borderColor: checked ? "#C4783A" : "rgba(255,255,255,0.15)", background: checked ? "#C4783A" : "transparent" }}
                  >
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-[#080808]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[0.875rem] text-white">{name}</span>
                </div>
                <span className="text-[0.8rem] text-[#888] shrink-0 ml-4">${price}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SignInGate({ onClose, pendingData }: { onClose: () => void; pendingData: FormData & { services: string[] } }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-center rounded-2xl" style={{ background: "rgba(8,8,8,0.97)" }}>
      <div className="p-8 md:p-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#888] hover:text-[#C4783A] hover:border-[rgba(196,120,58,0.4)] transition-all cursor-pointer"
          aria-label="Go back"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#C4783A] mb-4">One last step</p>
        <h3 className="font-serif text-[1.7rem] font-700 text-white leading-tight mb-2">
          Sign in to confirm<br />
          <span className="italic text-[#C4783A]">your booking.</span>
        </h3>
        <p className="text-[0.85rem] text-[#888] leading-relaxed mb-6 max-w-xs">
          We saved your details. Sign in or create a free account to complete your booking instantly.
        </p>

        <div className="bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-7 space-y-1.5">
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[#555] mb-2">Appointment summary</div>
          <p className="text-[0.82rem] text-[#CCCCCC]">{pendingData.name} · {pendingData.phone}</p>
          {pendingData.services.length > 0 && <p className="text-[0.82rem] text-[#CCCCCC]">{pendingData.services.join(", ")}</p>}
          <p className="text-[0.82rem] text-[#CCCCCC]">{pendingData.date} · {pendingData.time} · {pendingData.barber}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/signin?redirect=booking" className="flex-1 flex items-center justify-center bg-[#C4783A] text-[#080808] text-[0.75rem] font-700 tracking-[0.18em] uppercase py-3.5 rounded-xl hover:bg-[#E8976A] transition-colors duration-200">
            Sign In
          </Link>
          <Link href="/signin?redirect=booking" className="flex-1 flex items-center justify-center border border-[rgba(255,255,255,0.1)] text-[#CCCCCC] text-[0.75rem] font-500 tracking-[0.18em] uppercase py-3.5 rounded-xl hover:border-[rgba(196,120,58,0.4)] hover:text-[#C4783A] transition-all duration-200">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSection() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [minDate, setMinDate] = useState("");
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [servicesError, setServicesError] = useState("");
  const [showSignInGate, setShowSignInGate] = useState(false);
  const [pendingData, setPendingData] = useState<(FormData & { services: string[] }) | null>(null);

  useEffect(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    setMinDate(d.toISOString().split("T")[0]);
    const s = sessionStorage.getItem("client_session");
    setSession(s ? JSON.parse(s) : null);
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (selectedServices.length === 0) { setServicesError("Select at least one service"); return; }
    setServicesError("");

    if (!session) {
      setPendingData({ ...data, services: selectedServices });
      setShowSignInGate(true);
      return;
    }

    setStatus("submitting");
    try {
      const servicesStr = selectedServices.join(", ");
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email: session.email, service: servicesStr }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
      setSelectedServices([]);
      setTimeout(() => {
        const msg = encodeURIComponent(
          `Hello Haus of Cuts,\n\nI'd like to confirm my appointment.\n\nName: ${data.name}\nPhone: ${data.phone}\nServices: ${servicesStr}\nBarber: ${data.barber}\nDate: ${data.date}\nTime: ${data.time}${data.notes ? `\nNotes: ${data.notes}` : ""}\n\nThank you.`
        );
        window.open(`https://wa.me/${BRAND.whatsapp}?text=${msg}`, "_blank");
      }, 1200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="booking" className="relative bg-[#080808] py-20 md:py-28">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(196,120,58,0.2)] to-transparent absolute top-0" />

      <div className="container-narrow max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-12 bg-[#C4783A]" />
            <span className="text-[0.65rem] font-600 tracking-[0.3em] uppercase text-[#C4783A]">Book Appointment</span>
            <div className="h-px w-12 bg-[#C4783A]" />
          </div>
          <h2 className="font-serif font-800 text-white leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
            Reserve Your <span className="italic gold-text">Session</span>
          </h2>
          <p className="text-[0.9rem] text-[#888] mt-3">Book online and confirm instantly via WhatsApp.</p>
        </div>

        {/* Form card */}
        <div className="relative bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          {showSignInGate && pendingData && (
            <SignInGate onClose={() => setShowSignInGate(false)} pendingData={pendingData} />
          )}

          {status === "success" ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-[#C4783A] mx-auto mb-5" />
              <h3 className="font-serif text-2xl font-700 text-white mb-2">You&apos;re all set.</h3>
              <p className="text-[0.88rem] text-[#888] mb-8 leading-relaxed max-w-sm mx-auto">
                Booking confirmed. WhatsApp is opening to send your details to our team.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-[0.72rem] tracking-[0.2em] uppercase text-[#888] hover:text-[#C4783A] transition-colors cursor-pointer"
              >
                Book Another →
              </button>
            </div>
          ) : (
            <>
              {session && (
                <div className="flex items-center justify-between mb-7 pb-5 border-b border-[rgba(255,255,255,0.06)]">
                  <div>
                    <p className="text-[0.6rem] tracking-[0.22em] uppercase text-[#555] mb-0.5">Booking as</p>
                    <p className="text-[0.9rem] text-white">{session.name}</p>
                  </div>
                  <Link href="/appointments" className="text-[0.65rem] tracking-widest uppercase text-[#666] hover:text-[#C4783A] transition-colors">
                    My Bookings →
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className={FIELD_LABEL}><User className="w-3.5 h-3.5" /> Full Name</div>
                    <input {...register("name")} placeholder="Your name" className={INPUT} />
                    {errors.name && <p className="mt-1.5 text-[0.72rem] text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <div className={FIELD_LABEL}><Phone className="w-3.5 h-3.5" /> Phone Number</div>
                    <input {...register("phone")} type="tel" placeholder="+61 475 832 067" className={INPUT} />
                    {errors.phone && <p className="mt-1.5 text-[0.72rem] text-red-400">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Row 2: Barber */}
                <div>
                  <div className={FIELD_LABEL}><User className="w-3.5 h-3.5" /> Preferred Barber</div>
                  <div className="relative">
                    <select {...register("barber")} className={SELECT}>
                      <option value="">Select barber...</option>
                      {BARBERS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888] pointer-events-none" />
                  </div>
                  {errors.barber && <p className="mt-1.5 text-[0.72rem] text-red-400">{errors.barber.message}</p>}
                </div>

                {/* Row 3: Services */}
                <ServicesDropdown value={selectedServices} onChange={setSelectedServices} error={servicesError} />

                {/* Row 4: Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className={FIELD_LABEL}><Calendar className="w-3.5 h-3.5" /> Preferred Date</div>
                    <input {...register("date")} type="date" min={minDate} className={`${INPUT} [color-scheme:dark]`} />
                    {errors.date && <p className="mt-1.5 text-[0.72rem] text-red-400">{errors.date.message}</p>}
                  </div>
                  <div>
                    <div className={FIELD_LABEL}><Clock className="w-3.5 h-3.5" /> Preferred Time</div>
                    <div className="relative">
                      <select {...register("time")} className={SELECT}>
                        <option value="">Select time...</option>
                        {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888] pointer-events-none" />
                    </div>
                    {errors.time && <p className="mt-1.5 text-[0.72rem] text-red-400">{errors.time.message}</p>}
                  </div>
                </div>

                {/* Row 5: Notes */}
                <div>
                  <div className={FIELD_LABEL}>
                    <MessageSquare className="w-3.5 h-3.5" /> Additional Notes
                    <span className="text-[#444] normal-case tracking-normal font-400 ml-1">(optional)</span>
                  </div>
                  <textarea {...register("notes")} rows={3} placeholder="Any special requests or details..." className={`${INPUT} resize-none`} />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-[0.78rem]">Something went wrong. Please try again.</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-3 bg-[#C4783A] text-white text-[0.8rem] font-700 tracking-[0.2em] uppercase py-4 rounded-xl hover:bg-[#E8976A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer mt-2"
                >
                  {status === "submitting" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</>
                  ) : (
                    <>Book My Appointment</>
                  )}
                </button>

                <p className="text-[0.72rem] text-[#444] text-center pt-1">
                  {session
                    ? `Booking confirmed via WhatsApp · ${BRAND.phone}`
                    : "You'll be asked to sign in before we confirm your booking"}
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(196,120,58,0.2)] to-transparent absolute bottom-0" />
    </section>
  );
}
