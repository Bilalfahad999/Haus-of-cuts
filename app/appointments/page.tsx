"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, Tag, LogOut, ChevronRight, Scissors } from "lucide-react";
import { calcWithOffer } from "@/lib/pricing";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  barber: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface Offer {
  id: string;
  type: string;
  value: string;
  message: string;
  expiryDate: string;
  used: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  pending:   { label: "Pending",   cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",    dot: "bg-amber-400"  },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  completed: { label: "Completed", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",       dot: "bg-blue-400"   },
  cancelled: { label: "Cancelled", cls: "bg-red-500/10 text-red-400 border-red-500/20",          dot: "bg-red-400"    },
};

function getActiveOffer(offers: Offer[]): Offer | null {
  const today = new Date();
  return offers.find((o) => !o.used && new Date(o.expiryDate) >= today) ?? null;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = sessionStorage.getItem("client_session");
    if (!s) { router.replace("/signin"); return; }
    const parsed = JSON.parse(s);
    setSession(parsed);
    Promise.all([
      fetch(`/api/bookings?email=${encodeURIComponent(parsed.email)}`).then((r) => r.json()),
      fetch(`/api/offers?email=${encodeURIComponent(parsed.email)}`).then((r) => r.json()),
    ]).then(([b, o]) => {
      setBookings(b.sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setOffers(o);
    }).finally(() => setLoading(false));
  }, [router]);

  const signOut = () => { sessionStorage.removeItem("client_session"); router.push("/"); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-white/5 border-t-[#C4783A] animate-spin" />
      </div>
    );
  }

  const activeOffer = getActiveOffer(offers);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Nav */}
      <div className="sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/logo.jpeg" alt="Haus of Cuts" className="w-7 h-7 rounded-lg object-cover" />
            </Link>
            <div>
              <span className="font-serif font-600 text-white text-[0.95rem]">My Appointments</span>
              <span className="text-[#555] text-[0.75rem] ml-2">— {session?.name}</span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-[0.75rem] text-[#555] hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* Active offer banner */}
        {activeOffer && (
          <div className="rounded-2xl p-5 mb-8 border border-[rgba(196,120,58,0.25)]"
            style={{ background: "rgba(196,120,58,0.06)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[rgba(196,120,58,0.15)] flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4 text-[#C4783A]" />
              </div>
              <div className="flex-1">
                <p className="text-[0.65rem] font-700 tracking-[0.2em] uppercase text-[#C4783A] mb-1">Active Offer</p>
                <p className="text-white font-600 text-[0.95rem]">{activeOffer.value}</p>
                {activeOffer.message && <p className="text-[0.8rem] text-[#888] mt-0.5">{activeOffer.message}</p>}
                <p className="text-[0.72rem] text-[#555] mt-1.5">Expires {activeOffer.expiryDate}</p>
              </div>
              <div className="text-[0.65rem] font-700 tracking-widest uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full shrink-0">
                Applied
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.05] p-16 text-center" style={{ background: "#111111" }}>
            <div className="w-12 h-12 rounded-2xl bg-[rgba(196,120,58,0.08)] flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-5 h-5 text-[#C4783A]" strokeWidth={2} />
            </div>
            <p className="text-white font-500 mb-1">No appointments yet</p>
            <p className="text-[#555] text-[0.82rem] mb-6">Your booking history will appear here</p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 bg-[#C4783A] text-[#080808] text-[0.75rem] font-700 tracking-wider uppercase px-6 py-3 rounded-xl hover:bg-[#E8976A] transition-colors"
            >
              Book Now <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[0.72rem] tracking-widest uppercase text-[#444] mb-5">
              {bookings.length} Appointment{bookings.length !== 1 ? "s" : ""}
            </p>

            {bookings.map((b) => {
              const cfg = STATUS_CONFIG[b.status];
              // Only apply the offer to pending/confirmed bookings
              const applyOffer = activeOffer && (b.status === "pending" || b.status === "confirmed");
              const { subtotal, discount, total, offerLabel } = calcWithOffer(
                [b.service],
                applyOffer ? activeOffer : null
              );
              const hasDiscount = discount > 0;

              return (
                <div
                  key={b.id}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    background: "#111111",
                    borderColor: b.status === "cancelled" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                      <div>
                        <h3 className="font-serif font-700 text-white text-[1rem] leading-snug">
                          {b.service.split(", ").join(" + ")}
                        </h3>
                        <p className="text-[0.78rem] text-[#666] mt-0.5">with {b.barber}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[0.6rem] font-700 tracking-widest uppercase border ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="px-5 pb-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex items-center gap-2 text-[0.82rem] text-[#888]">
                      <Calendar className="w-3.5 h-3.5 text-[#444] shrink-0" />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-2 text-[0.82rem] text-[#888]">
                      <Clock className="w-3.5 h-3.5 text-[#444] shrink-0" />
                      {b.time}
                    </div>
                    <div className="flex items-center gap-2 text-[0.82rem] text-[#888]">
                      <User className="w-3.5 h-3.5 text-[#444] shrink-0" />
                      {b.phone}
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-white/[0.04] px-5 py-4"
                    style={{ background: hasDiscount ? "rgba(196,120,58,0.04)" : "rgba(255,255,255,0.01)" }}>
                    {hasDiscount ? (
                      <div className="flex items-center justify-between">
                        <div>
                          {/* Offer badge */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <Tag className="w-3 h-3 text-[#C4783A]" />
                            <span className="text-[0.65rem] font-700 tracking-widest uppercase text-[#C4783A]">
                              Offer Applied — {offerLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[0.82rem] text-[#555] line-through">${subtotal.toFixed(0)}</span>
                            <span className="text-[0.72rem] text-emerald-400 font-600">−${discount.toFixed(0)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.65rem] tracking-widest uppercase text-[#555] mb-0.5">Total</p>
                          <span className="font-serif font-800 text-[1.4rem] text-[#C4783A]">${total.toFixed(0)}</span>
                        </div>
                      </div>
                    ) : offerLabel ? (
                      // Free service / custom offer type
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Tag className="w-3 h-3 text-[#C4783A]" />
                            <span className="text-[0.65rem] font-700 tracking-widest uppercase text-[#C4783A]">
                              {offerLabel}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.65rem] tracking-widest uppercase text-[#555] mb-0.5">Total</p>
                          <span className="font-serif font-800 text-[1.4rem] text-white">${subtotal.toFixed(0)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-[0.72rem] text-[#444] tracking-wide">Service charge</p>
                        <div className="text-right">
                          <p className="text-[0.65rem] tracking-widest uppercase text-[#555] mb-0.5">Total</p>
                          <span className="font-serif font-800 text-[1.4rem] text-white">${subtotal.toFixed(0)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {b.notes && (
                    <div className="border-t border-white/[0.03] px-5 py-3">
                      <p className="text-[0.75rem] text-[#555] italic">&ldquo;{b.notes}&rdquo;</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/#booking" className="inline-flex items-center gap-2 text-[0.78rem] text-[#C4783A] hover:text-[#E8976A] transition-colors">
            + Book another appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
