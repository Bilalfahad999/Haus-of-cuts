"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#team", label: "Team" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("client_session");
    if (stored) setSession(JSON.parse(stored));

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const signOut = () => {
    sessionStorage.removeItem("client_session");
    setSession(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080808]/95 backdrop-blur-md border-b border-[rgba(196,120,58,0.12)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-narrow flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.jpeg"
            alt="Haus of Cuts"
            className="w-10 h-10 rounded-full object-cover group-hover:shadow-[0_0_20px_rgba(196,120,58,0.5)] transition-all duration-300"
          />
          <span className="font-serif text-lg font-700 tracking-wide text-[#FFFFFF]">
            Haus <span className="gold-text">of Cuts</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[0.8rem] font-medium tracking-widest uppercase text-white hover:text-[#C4783A] transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C4783A] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/appointments"
                className="text-[0.75rem] font-medium tracking-wider uppercase text-white hover:text-[#C4783A] transition-colors"
              >
                Hi, {session.name.split(" ")[0]}
              </Link>
              <button
                onClick={signOut}
                className="text-[0.7rem] tracking-wider uppercase text-[#CCCCCC] hover:text-red-400 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="text-[0.75rem] font-medium tracking-wider uppercase text-white hover:text-[#C4783A] transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/staff/login"
            className="text-[0.7rem] font-medium tracking-widest uppercase text-[#555] hover:text-[#C4783A] transition-colors border border-[rgba(255,255,255,0.07)] px-3.5 py-2 rounded-full hover:border-[rgba(196,120,58,0.3)]"
          >
            Staff
          </Link>
          <a
            href="#booking"
            className="bg-gradient-to-r from-[#C4783A] to-[#E8976A] text-[#080808] text-[0.7rem] font-700 tracking-widest uppercase px-5 py-2.5 rounded-full hover:shadow-[0_0_25px_rgba(196,120,58,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-[#FFFFFF] cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-400 overflow-hidden ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0D0D0D] border-t border-[rgba(196,120,58,0.1)] px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[0.85rem] font-medium tracking-widest uppercase text-white hover:text-[#C4783A] transition-colors py-1 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[rgba(196,120,58,0.1)] flex flex-col gap-3">
            {session ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="text-[0.75rem] tracking-wider uppercase text-[#CCCCCC] text-left cursor-pointer"
              >
                Sign Out ({session.name.split(" ")[0]})
              </button>
            ) : (
              <Link href="/signin" onClick={() => setMobileOpen(false)} className="text-[0.8rem] tracking-wider uppercase text-[#9A9A9A]">
                Sign In
              </Link>
            )}
            <Link
              href="/staff/login"
              onClick={() => setMobileOpen(false)}
              className="text-[0.78rem] tracking-wider uppercase text-[#555] hover:text-[#C4783A] transition-colors"
            >
              Staff Login
            </Link>
            <a
              href="#booking"
              onClick={() => setMobileOpen(false)}
              className="bg-gradient-to-r from-[#C4783A] to-[#E8976A] text-[#080808] text-[0.75rem] font-700 tracking-widest uppercase px-5 py-3 rounded-full text-center"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}




