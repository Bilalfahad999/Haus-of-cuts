"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Scissors, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

export default function StaffLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  useEffect(() => {
    if (localStorage.getItem("staff_auth") === "true") router.replace("/staff/dashboard");
  }, [router]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
      if (password === correct) {
        localStorage.setItem("staff_auth", "true");
        router.push("/staff/dashboard");
      } else {
        setError("Incorrect password. Try again.");
        setPassword("");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C4783A]/15 via-[#8B4A1A]/10 to-[#080808]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] rounded-b-[50%] bg-[#C4783A]/10 blur-[80px] pointer-events-none" />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] rounded-t-full bg-[#C4783A]/08 blur-[60px] pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[380px] relative z-10"
        style={{ perspective: 1200 }}
      >
        <motion.div style={{ rotateX, rotateY }} onMouseMove={handleMouseMove} onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}>
          <div className="relative group">
            {/* Traveling border beams */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
              {[
                { cls: "absolute top-0 left-0 h-[2px] w-[45%] bg-gradient-to-r from-transparent via-[#C4783A] to-transparent", anim: { left: ["-45%", "100%"] }, delay: 0 },
                { cls: "absolute top-0 right-0 h-[45%] w-[2px] bg-gradient-to-b from-transparent via-[#C4783A] to-transparent", anim: { top: ["-45%", "100%"] }, delay: 0.65 },
                { cls: "absolute bottom-0 right-0 h-[2px] w-[45%] bg-gradient-to-r from-transparent via-[#C4783A] to-transparent", anim: { right: ["-45%", "100%"] }, delay: 1.3 },
                { cls: "absolute bottom-0 left-0 h-[45%] w-[2px] bg-gradient-to-b from-transparent via-[#C4783A] to-transparent", anim: { bottom: ["-45%", "100%"] }, delay: 1.95 },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className={b.cls}
                  animate={{ ...b.anim, opacity: [0.2, 0.8, 0.2] }}
                  transition={{
                    ...Object.fromEntries(Object.keys(b.anim).map((k) => [k, { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8, delay: b.delay }])),
                    opacity: { duration: 1.1, repeat: Infinity, repeatType: "mirror", delay: b.delay },
                  }}
                />
              ))}
            </div>

            {/* Card */}
            <div className="relative bg-[#0D0D0D]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.06] shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">
              {/* Grid texture */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(rgba(196,120,58,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,120,58,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

              {/* Logo */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden"
                  style={{ background: "rgba(196,120,58,0.12)", border: "1px solid rgba(196,120,58,0.25)" }}
                >
                  <Scissors className="w-7 h-7 text-[#C4783A]" strokeWidth={2} />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C4783A]/10 to-transparent" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-xl font-700 text-white"
                >
                  Staff Portal
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[0.78rem] text-[#888] mt-1"
                >
                  Haus of Cuts · Dashboard Access
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-[0.68rem] font-600 tracking-[0.2em] uppercase text-[#C4783A] mb-2">
                    Staff Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter staff password"
                      required
                      className="w-full bg-white/5 border border-transparent rounded-xl pl-10 pr-11 py-3.5 text-[0.9rem] text-white placeholder-[#444] focus:outline-none focus:border-[rgba(196,120,58,0.45)] focus:bg-white/8 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors cursor-pointer"
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 text-red-400 text-[0.75rem]"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full relative group/btn mt-1"
                >
                  <div className="absolute inset-0 bg-[#C4783A]/20 rounded-xl blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <div className="relative overflow-hidden bg-[#C4783A] text-[#080808] font-700 h-11 rounded-xl transition-all duration-200 flex items-center justify-center hover:bg-[#E8976A] disabled:opacity-60 disabled:cursor-not-allowed">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="w-4 h-4 border-2 border-[#080808]/40 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-[0.82rem] tracking-[0.12em] uppercase font-700">
                          Access Dashboard
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </form>

              <p className="text-center mt-6 text-[0.72rem] text-[#444]">
                <Link href="/" className="hover:text-[#C4783A] transition-colors">
                  ← Back to Haus of Cuts
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
