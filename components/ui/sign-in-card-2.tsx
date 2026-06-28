'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight, User } from 'lucide-react';
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

interface SignInCardProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  isLoading: boolean;
  error: string;
}

export function SignInCard({
  mode,
  onModeChange,
  onSubmit,
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  isLoading,
  error,
}: SignInCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background gradient — copper instead of purple to match brand */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C4783A]/25 via-[#8B4A1A]/20 to-black" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#C4783A]/15 blur-[80px]" />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#E8976A]/10 blur-[60px]"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#C4783A]/10 blur-[60px]"
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 px-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Animated border glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl"
              animate={{
                boxShadow: [
                  '0 0 10px 2px rgba(196,120,58,0.08)',
                  '0 0 20px 6px rgba(196,120,58,0.18)',
                  '0 0 10px 2px rgba(196,120,58,0.08)',
                ],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            />

            {/* Traveling light beams */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
              {[
                { className: 'absolute top-0 left-0 h-[2px] w-[50%]', animate: { left: ['-50%', '100%'] }, delay: 0 },
                { className: 'absolute top-0 right-0 h-[50%] w-[2px]', animate: { top: ['-50%', '100%'] }, delay: 0.6 },
                { className: 'absolute bottom-0 right-0 h-[2px] w-[50%]', animate: { right: ['-50%', '100%'] }, delay: 1.2 },
                { className: 'absolute bottom-0 left-0 h-[50%] w-[2px]', animate: { bottom: ['-50%', '100%'] }, delay: 1.8 },
              ].map((beam, i) => (
                <motion.div
                  key={i}
                  className={`${beam.className} bg-gradient-to-r from-transparent via-[#C4783A] to-transparent`}
                  animate={{ ...beam.animate, opacity: [0.2, 0.7, 0.2] }}
                  transition={{
                    ...Object.fromEntries(
                      Object.keys(beam.animate).map((k) => [k, { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: beam.delay }])
                    ),
                    opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: beam.delay },
                  }}
                />
              ))}
            </div>

            {/* Glass card */}
            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-7 border border-white/[0.06] shadow-2xl overflow-hidden">
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(196,120,58,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(196,120,58,0.3) 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Logo + header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="mx-auto w-11 h-11 rounded-full border border-[#C4783A]/30 flex items-center justify-center mb-3 relative overflow-hidden"
                  style={{ background: 'rgba(196,120,58,0.1)' }}
                >
                  <svg className="w-5 h-5 text-[#C4783A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 2v2M6 10V8m0 0a4 4 0 1 0 0-4 4 4 0 0 0 0 4zm12 12v-2m0-6v2m0 0a4 4 0 1 1 0 4 4 4 0 0 0 0-4zm-6-2L4 22m8-12 8 12" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C4783A]/10 to-transparent" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Link href="/" className="font-serif text-lg font-bold text-white hover:text-[#C4783A] transition-colors">
                    Haus <span className="gold-text italic">of Cuts</span>
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-white/50 text-xs mt-1"
                >
                  {mode === 'login' ? 'Welcome back, gentleman.' : 'Create your account.'}
                </motion.p>
              </div>

              {/* Mode toggle */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-5">
                {(['login', 'register'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onModeChange(m)}
                    className={cn(
                      'flex-1 py-2 text-[0.72rem] font-600 tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer',
                      mode === m
                        ? 'bg-[#C4783A] text-[#080808]'
                        : 'text-white/50 hover:text-white/80'
                    )}
                  >
                    {m === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-3">
                <AnimatePresence>
                  {mode === 'register' && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedInput === 'name' ? 'text-[#C4783A]' : 'text-white/30'}`} />
                      <Input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-[#C4783A]/40 text-white placeholder:text-white/25 h-10 pl-10 focus:bg-white/8 transition-all duration-200"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedInput === 'email' ? 'text-[#C4783A]' : 'text-white/30'}`} />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    className="w-full bg-white/5 border-transparent focus:border-[#C4783A]/40 text-white placeholder:text-white/25 h-10 pl-10 focus:bg-white/8 transition-all duration-200"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedInput === 'password' ? 'text-[#C4783A]' : 'text-white/30'}`} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    minLength={6}
                    className="w-full bg-white/5 border-transparent focus:border-[#C4783A]/40 text-white placeholder:text-white/25 h-10 pl-10 pr-10 focus:bg-white/8 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    {showPassword
                      ? <Eye className="w-4 h-4" />
                      : <EyeClosed className="w-4 h-4" />}
                  </button>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center justify-end">
                    <Link href="#" className="text-[0.72rem] text-white/40 hover:text-[#C4783A] transition-colors duration-200">
                      Forgot password?
                    </Link>
                  </div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-[0.75rem] text-center py-1"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/button mt-1"
                >
                  <div className="absolute inset-0 bg-[#C4783A]/20 rounded-lg blur-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                  <div className="relative overflow-hidden bg-[#C4783A] text-[#080808] font-700 h-10 rounded-lg transition-all duration-300 flex items-center justify-center hover:bg-[#E8976A] disabled:opacity-60 disabled:cursor-not-allowed">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
                      style={{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    />
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="w-4 h-4 border-2 border-[#080808]/50 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5 text-sm font-700 tracking-wide"
                        >
                          {mode === 'login' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-3.5 h-3.5 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Footer link */}
                <p className="text-center text-[0.72rem] text-white/40 pt-2">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
                    className="text-white/70 hover:text-[#C4783A] transition-colors duration-200 font-600 underline-offset-2 hover:underline cursor-pointer"
                  >
                    {mode === 'login' ? 'Register' : 'Sign In'}
                  </button>
                </p>

                <p className="text-center text-[0.68rem] text-white/25 pt-1">
                  <Link href="/" className="hover:text-[#C4783A] transition-colors">
                    ← Back to Haus of Cuts
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
