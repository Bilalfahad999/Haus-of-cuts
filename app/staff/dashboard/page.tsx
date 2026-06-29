"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scissors, Search, Calendar, Users, CheckCircle, XCircle,
  Clock, LogOut, DollarSign, Tag, Trash2, Plus, ChevronDown,
  BarChart3, Star, Bell, RefreshCw, Gift,
} from "lucide-react";
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
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface Offer {
  id: string;
  customerEmail: string;
  customerName: string;
  type: string;
  value: string;
  message: string;
  expiryDate: string;
  used: boolean;
}

type Tab = "bookings" | "offers";
type FilterStatus = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   cls: "bg-amber-500/10  text-amber-400  border-amber-500/20",  dot: "bg-amber-400"  },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  completed: { label: "Completed", cls: "bg-blue-500/10   text-blue-400   border-blue-500/20",   dot: "bg-blue-400"   },
  cancelled: { label: "Cancelled", cls: "bg-red-500/10    text-red-400    border-red-500/20",    dot: "bg-red-400"    },
};

const TODAY = new Date().toISOString().split("T")[0];

function getActiveOfferForEmail(offers: Offer[], email: string): Offer | null {
  const today = new Date();
  return offers.find(
    (o) => o.customerEmail.toLowerCase() === email.toLowerCase() && !o.used && new Date(o.expiryDate) >= today
  ) ?? null;
}

function PriceBreakdown({ booking, offers }: { booking: Booking; offers: Offer[] }) {
  const offer = getActiveOfferForEmail(offers, booking.email);
  const { subtotal, discount, total, offerLabel } = calcWithOffer([booking.service], offer ?? null);
  const hasDiscount = discount > 0;

  return (
    <div className="flex items-start gap-3 flex-wrap">
      {offer ? (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Tag className="w-3 h-3 text-[#C4783A] shrink-0" />
            <span className="text-[0.62rem] font-700 tracking-widest uppercase text-[#C4783A]">
              Offer: {offerLabel ?? offer.value}
            </span>
          </div>
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-[0.78rem] text-[#444] line-through">${subtotal.toFixed(0)}</span>
              <span className="text-[0.72rem] text-emerald-400 font-600">−${discount.toFixed(0)}</span>
              <span className="font-serif font-700 text-[#C4783A] text-[1rem]">${total.toFixed(0)}</span>
            </div>
          ) : (
            <span className="font-serif font-700 text-[#C4783A] text-[1rem]">${subtotal.toFixed(0)}</span>
          )}
        </div>
      ) : (
        <span className="font-serif font-700 text-[#C4783A] text-[1.05rem]">${subtotal.toFixed(0)}</span>
      )}
    </div>
  );
}

const INPUT = "w-full bg-[#111] border border-white/[0.07] rounded-xl px-4 py-3 text-[0.875rem] text-white placeholder-[#555] focus:outline-none focus:border-[rgba(196,120,58,0.45)] transition-all duration-200";

export default function StaffDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  const [offerForm, setOfferForm] = useState({
    customerEmail: "", customerName: "", type: "discount",
    value: "", message: "", expiryDate: "",
  });

  useEffect(() => {
    if (localStorage.getItem("staff_auth") !== "true") { router.replace("/staff/login"); return; }
    loadData();
  }, [router]);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    const [b, o] = await Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/offers").then((r) => r.json()),
    ]);
    setBookings(b.sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setOffers(o);
    setLoading(false);
    setRefreshing(false);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: status as Booking["status"] } : b));
  };

  const createOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSubmitting(true);
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offerForm),
    });
    const o = await fetch("/api/offers").then((r) => r.json());
    setOffers(o);
    setOfferForm({ customerEmail: "", customerName: "", type: "discount", value: "", message: "", expiryDate: "" });
    setOfferSubmitting(false);
    setOfferSuccess(true);
    setTimeout(() => { setOfferSuccess(false); setShowOfferForm(false); }, 2000);
  };

  const deleteOffer = async (id: string) => {
    await fetch("/api/offers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const signOut = () => { localStorage.removeItem("staff_auth"); router.push("/"); };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      (!q || b.name.toLowerCase().includes(q) || b.email.includes(q) || b.phone.includes(q) || b.service.toLowerCase().includes(q)) &&
      (filter === "all" || b.status === filter)
    );
  });

  const todayBookings   = bookings.filter((b) => b.date === TODAY);
  const pendingCount    = bookings.filter((b) => b.status === "pending").length;
  const todayRevenue    = todayBookings.filter((b) => b.status === "completed").reduce((s, b) => {
    const offer = getActiveOfferForEmail(offers, b.email);
    return s + calcWithOffer([b.service], offer ?? null).total;
  }, 0);
  const weekRevenue     = bookings.filter((b) => {
    const d = new Date(b.date);
    const ago = new Date(); ago.setDate(ago.getDate() - 7);
    return d >= ago && b.status === "completed";
  }).reduce((s, b) => {
    const offer = getActiveOfferForEmail(offers, b.email);
    return s + calcWithOffer([b.service], offer ?? null).total;
  }, 0);

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Haus of Cuts" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-serif font-700 text-white">Haus of Cuts</span>
            <span className="hidden sm:inline text-[0.65rem] tracking-widest uppercase text-[#555] border border-white/[0.06] px-2 py-0.5 rounded-full ml-1">
              Staff Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => loadData(true)}
              className="text-[#555] hover:text-[#C4783A] transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#C4783A]" : ""}`} />
            </button>
            <Link href="/" className="text-[0.75rem] text-[#666] hover:text-[#C4783A] transition-colors hidden sm:block">
              View Site →
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-[0.75rem] text-[#666] hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar,  label: "Today's Bookings", value: todayBookings.length,  sub: "scheduled today",       color: "text-[#C4783A]",   bg: "rgba(196,120,58,0.08)"  },
            { icon: Bell,      label: "Pending",          value: pendingCount,           sub: "awaiting confirmation", color: "text-amber-400",   bg: "rgba(245,158,11,0.08)"  },
            { icon: DollarSign,label: "Today's Revenue",  value: `$${todayRevenue}`,     sub: "from completed today",  color: "text-emerald-400", bg: "rgba(52,211,153,0.08)"  },
            { icon: BarChart3, label: "Week Revenue",     value: `$${weekRevenue}`,      sub: "last 7 days",           color: "text-blue-400",    bg: "rgba(96,165,250,0.08)"  },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="rounded-2xl p-5 border border-white/[0.05]" style={{ background: "#111111" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: 18, height: 18 }} />
              </div>
              <div className="font-serif text-2xl font-700 text-white mb-0.5">{value}</div>
              <div className="text-[0.7rem] text-[#555] uppercase tracking-wider">{label}</div>
              <div className="text-[0.68rem] text-[#444] mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex bg-[#111] rounded-xl p-1 gap-1">
            {(["bookings", "offers"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-2 px-5 py-2 text-[0.75rem] font-600 tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer ${
                  tab === t
                    ? "bg-[#C4783A] text-[#080808]"
                    : "text-[#666] hover:text-white"
                }`}
              >
                {t === "bookings" ? (
                  <><Calendar className="w-3.5 h-3.5" /> Bookings
                    {pendingCount > 0 && tab !== "bookings" && (
                      <span className="bg-amber-400 text-[#080808] text-[0.6rem] font-800 px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                    )}
                  </>
                ) : (
                  <><Gift className="w-3.5 h-3.5" /> Offers</>
                )}
              </button>
            ))}
          </div>

          {tab === "offers" && (
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C4783A] text-[#080808] text-[0.75rem] font-700 tracking-wider uppercase rounded-xl hover:bg-[#E8976A] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Offer
            </button>
          )}
        </div>

        {/* ══════════════════════════════
            BOOKINGS TAB
        ══════════════════════════════ */}
        {tab === "bookings" && (
          <>
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, phone, service…"
                  className={`${INPUT} pl-10`}
                />
              </div>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterStatus)}
                  className={`${INPUT} w-auto pr-9 appearance-none cursor-pointer`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
              </div>
            </div>

            {/* Count */}
            <p className="text-[0.72rem] text-[#444] mb-4 tracking-wide">
              Showing <span className="text-[#888]">{filtered.length}</span> booking{filtered.length !== 1 ? "s" : ""}
              {filter !== "all" && ` · filtered by ${filter}`}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-white/10 border-t-[#C4783A] rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Calendar className="w-10 h-10 text-[#222] mb-4" />
                <p className="text-[#555] text-[0.9rem]">No bookings found</p>
                <p className="text-[#333] text-[0.78rem] mt-1">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((b) => {
                  const cfg = STATUS_CONFIG[b.status];
                  const isExpanded = expandedId === b.id;
                  const isToday = b.date === TODAY;
                  const bookingOffer = getActiveOfferForEmail(offers, b.email);
                  const { subtotal, discount, total, offerLabel } = calcWithOffer([b.service], bookingOffer ?? null);

                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-white/[0.05] overflow-hidden transition-all duration-200"
                      style={{ background: "#111111" }}
                    >
                      {/* Main row */}
                      <div
                        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpandedId(isExpanded ? null : b.id)}
                      >
                        {/* Status dot */}
                        <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-600 text-white text-[0.95rem]">{b.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-700 tracking-widest uppercase border ${cfg.cls}`}>
                              {cfg.label}
                            </span>
                            {isToday && (
                              <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-700 tracking-widest uppercase bg-[rgba(196,120,58,0.12)] text-[#C4783A] border border-[rgba(196,120,58,0.2)]">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[0.78rem] text-[#666]">
                            <span>{b.service.length > 30 ? b.service.slice(0, 30) + "…" : b.service}</span>
                            <span>{b.date} · {b.time}</span>
                            <span>{b.barber}</span>
                          </div>
                        </div>

                        {/* Price + chevron */}
                        <div className="flex items-center gap-3 shrink-0">
                          <PriceBreakdown booking={b} offers={offers} />
                          <ChevronDown className={`w-4 h-4 text-[#444] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="border-t border-white/[0.04] px-5 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                            {[
                              { label: "Customer",   value: b.name },
                              { label: "Phone",      value: b.phone },
                              { label: "Barber",     value: b.barber },
                              { label: "Date",       value: b.date },
                              { label: "Time",       value: b.time },
                              { label: "Service",    value: b.service },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-[0.65rem] tracking-widest uppercase text-[#444] mb-0.5">{label}</p>
                                <p className="text-[0.875rem] text-white">{value}</p>
                              </div>
                            ))}

                            {/* Price breakdown */}
                            <div className="sm:col-span-2 lg:col-span-3 rounded-xl border p-4"
                              style={{ background: bookingOffer ? "rgba(196,120,58,0.05)" : "rgba(255,255,255,0.02)", borderColor: bookingOffer ? "rgba(196,120,58,0.15)" : "rgba(255,255,255,0.05)" }}>
                              <p className="text-[0.65rem] tracking-widest uppercase text-[#444] mb-2">Price</p>
                              {bookingOffer ? (
                                <div className="flex flex-wrap items-center gap-4">
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <Tag className="w-3 h-3 text-[#C4783A]" />
                                      <span className="text-[0.65rem] font-700 tracking-widest uppercase text-[#C4783A]">
                                        Offer Applied — {offerLabel ?? bookingOffer.value}
                                      </span>
                                    </div>
                                    {discount > 0 ? (
                                      <div className="flex items-center gap-3">
                                        <span className="text-[0.82rem] text-[#444] line-through">${subtotal.toFixed(0)}</span>
                                        <span className="text-[0.75rem] text-emerald-400 font-600">−${discount.toFixed(0)} off</span>
                                        <span className="font-serif font-800 text-[1.2rem] text-[#C4783A]">${total.toFixed(0)}</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-3">
                                        <span className="font-serif font-800 text-[1.2rem] text-white">${subtotal.toFixed(0)}</span>
                                        <span className="text-[0.72rem] text-[#C4783A]">+ {offerLabel}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-auto text-right">
                                    <p className="text-[0.62rem] tracking-widest uppercase text-[#444] mb-0.5">Customer Pays</p>
                                    <p className="font-serif font-800 text-[1.5rem] text-[#C4783A]">${total.toFixed(0)}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="text-[0.82rem] text-[#888]">Standard rate</span>
                                  <span className="font-serif font-800 text-[1.4rem] text-white">${subtotal.toFixed(0)}</span>
                                </div>
                              )}
                            </div>

                            {b.notes && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-[0.65rem] tracking-widest uppercase text-[#444] mb-0.5">Notes</p>
                                <p className="text-[0.875rem] text-[#AAAAAA] italic">&ldquo;{b.notes}&rdquo;</p>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.04]">
                            {b.status === "pending" && (
                              <button
                                onClick={() => updateStatus(b.id, "confirmed")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.75rem] font-600 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Confirm Booking
                              </button>
                            )}
                            {b.status === "confirmed" && (
                              <button
                                onClick={() => updateStatus(b.id, "completed")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.75rem] font-600 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5" /> Mark Completed
                              </button>
                            )}
                            {(b.status === "pending" || b.status === "confirmed") && (
                              <button
                                onClick={() => updateStatus(b.id, "cancelled")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.75rem] font-600 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Cancel
                              </button>
                            )}
                            {(b.status === "completed" || b.status === "cancelled") && (
                              <span className="text-[0.75rem] text-[#444] italic self-center">
                                {b.status === "completed" ? "✓ Booking completed" : "✕ Booking cancelled"}
                              </span>
                            )}
                            {/* Quick offer for this customer */}
                            <button
                              onClick={() => {
                                setOfferForm((f) => ({ ...f, customerEmail: b.email, customerName: b.name }));
                                setTab("offers");
                                setShowOfferForm(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.75rem] font-600 bg-[rgba(196,120,58,0.08)] text-[#C4783A] border border-[rgba(196,120,58,0.15)] hover:bg-[rgba(196,120,58,0.15)] transition-colors cursor-pointer ml-auto"
                            >
                              <Gift className="w-3.5 h-3.5" /> Send Offer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════
            OFFERS TAB
        ══════════════════════════════ */}
        {tab === "offers" && (
          <div className="space-y-6">

            {/* Create offer form */}
            {showOfferForm && (
              <div className="rounded-2xl border border-[rgba(196,120,58,0.15)] overflow-hidden" style={{ background: "#111111" }}>
                <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#C4783A]" />
                    <h3 className="font-serif font-600 text-white">Create Special Offer</h3>
                  </div>
                  <button onClick={() => setShowOfferForm(false)} className="text-[#444] hover:text-[#888] transition-colors cursor-pointer text-lg leading-none">×</button>
                </div>
                <div className="p-6">
                  {offerSuccess ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-white font-500">Offer Created!</p>
                      <p className="text-[0.78rem] text-[#666] mt-1">The offer has been saved successfully.</p>
                    </div>
                  ) : (
                    <form onSubmit={createOffer} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[0.68rem] font-600 tracking-[0.18em] uppercase text-[#C4783A] mb-1.5">Customer Email</label>
                          <input
                            value={offerForm.customerEmail}
                            onChange={(e) => setOfferForm({ ...offerForm, customerEmail: e.target.value })}
                            required placeholder="client@email.com"
                            className={INPUT}
                          />
                        </div>
                        <div>
                          <label className="block text-[0.68rem] font-600 tracking-[0.18em] uppercase text-[#C4783A] mb-1.5">Customer Name</label>
                          <input
                            value={offerForm.customerName}
                            onChange={(e) => setOfferForm({ ...offerForm, customerName: e.target.value })}
                            required placeholder="Full name"
                            className={INPUT}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[0.68rem] font-600 tracking-[0.18em] uppercase text-[#C4783A] mb-1.5">Offer Type</label>
                          <div className="relative">
                            <select
                              value={offerForm.type}
                              onChange={(e) => setOfferForm({ ...offerForm, type: e.target.value })}
                              className={`${INPUT} appearance-none pr-9 cursor-pointer`}
                            >
                              <option value="discount">Discount %</option>
                              <option value="free_service">Free Service</option>
                              <option value="custom">Custom</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[0.68rem] font-600 tracking-[0.18em] uppercase text-[#C4783A] mb-1.5">Value</label>
                          <input
                            value={offerForm.value}
                            onChange={(e) => setOfferForm({ ...offerForm, value: e.target.value })}
                            required placeholder={offerForm.type === "discount" ? "e.g. 20%" : "e.g. Free Beard Trim"}
                            className={INPUT}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[0.68rem] font-600 tracking-[0.18em] uppercase text-[#C4783A] mb-1.5">Personal Message</label>
                        <textarea
                          value={offerForm.message}
                          onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                          rows={2}
                          placeholder="Write a personal note to the customer…"
                          className={`${INPUT} resize-none`}
                        />
                      </div>

                      <div>
                        <label className="block text-[0.68rem] font-600 tracking-[0.18em] uppercase text-[#C4783A] mb-1.5">Expiry Date</label>
                        <input
                          type="date"
                          value={offerForm.expiryDate}
                          onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })}
                          required
                          className={`${INPUT} [color-scheme:dark]`}
                        />
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={offerSubmitting}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#C4783A] text-[#080808] text-[0.78rem] font-700 tracking-wider uppercase py-3 rounded-xl hover:bg-[#E8976A] disabled:opacity-60 transition-colors cursor-pointer"
                        >
                          {offerSubmitting ? (
                            <div className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                          ) : (
                            <><Tag className="w-3.5 h-3.5" /> Create Offer</>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOfferForm(false)}
                          className="px-5 py-3 rounded-xl border border-white/[0.07] text-[#666] text-[0.78rem] hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Offers list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-600 text-white">
                  All Offers <span className="text-[#444] font-400 text-base">({offers.length})</span>
                </h3>
              </div>

              {offers.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.05] p-16 text-center" style={{ background: "#111111" }}>
                  <Gift className="w-10 h-10 text-[#222] mx-auto mb-4" />
                  <p className="text-[#555] text-[0.9rem]">No offers yet</p>
                  <p className="text-[#333] text-[0.78rem] mt-1 mb-5">Create your first special offer for a customer</p>
                  <button
                    onClick={() => setShowOfferForm(true)}
                    className="px-5 py-2.5 bg-[#C4783A] text-[#080808] text-[0.75rem] font-700 tracking-wider uppercase rounded-xl hover:bg-[#E8976A] transition-colors cursor-pointer"
                  >
                    Create Offer
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-2xl border p-5 relative group"
                      style={{
                        background: o.used ? "#0D0D0D" : "#111111",
                        borderColor: o.used ? "rgba(255,255,255,0.04)" : "rgba(196,120,58,0.12)",
                      }}
                    >
                      {o.used && (
                        <div className="absolute top-3 right-3 text-[0.58rem] font-700 tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/5 text-[#444]">
                          Used
                        </div>
                      )}

                      {/* Offer icon */}
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: o.used ? "rgba(255,255,255,0.03)" : "rgba(196,120,58,0.1)" }}>
                        <Tag className={`w-4 h-4 ${o.used ? "text-[#333]" : "text-[#C4783A]"}`} />
                      </div>

                      {/* Value */}
                      <p className={`font-serif font-700 text-lg mb-1 ${o.used ? "text-[#444]" : "text-white"}`}>
                        {o.value}
                      </p>

                      {/* Customer */}
                      <p className="text-[0.78rem] text-[#888] mb-1 truncate">{o.customerName}</p>
                      <p className="text-[0.72rem] text-[#555] mb-3 truncate">{o.customerEmail}</p>

                      {/* Message */}
                      {o.message && (
                        <p className="text-[0.75rem] text-[#666] italic mb-3 line-clamp-2 border-l-2 border-[rgba(196,120,58,0.2)] pl-2">
                          &ldquo;{o.message}&rdquo;
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                        <div>
                          <p className="text-[0.62rem] tracking-widest uppercase text-[#333] mb-0.5">Expires</p>
                          <p className="text-[0.75rem] text-[#666]">{o.expiryDate}</p>
                        </div>
                        <button
                          onClick={() => deleteOffer(o.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#333] hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                          title="Delete offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
