"use client";

import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { BRAND, HOURS_COMPACT } from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.85a8.27 8.27 0 0 0 4.85 1.55V7a4.85 4.85 0 0 1-1.08-.31z" />
    </svg>
  );
}

const SOCIALS = [
  { href: BRAND.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: BRAND.tiktok, icon: TikTokIcon, label: "TikTok" },
  { href: BRAND.facebook, icon: FacebookIcon, label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[rgba(196,120,58,0.06)]">
      <div className="container-narrow pt-16 pb-10">
        <div className="grid lg:grid-cols-[2fr_1fr_1fr] gap-12">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <img
                src="/logo.jpeg"
                alt="Haus of Cuts"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-serif text-lg font-700 text-[#FFFFFF]">
                Haus <span className="gold-text">of Cuts</span>
              </span>
            </Link>
            <p className="text-[0.83rem] text-[#AAAAAA] leading-relaxed mb-6 max-w-xs">
              A sanctuary for the modern gentleman. Where precision meets style — every visit, every time.
            </p>

            {/* Contact details inline */}
            <div className="space-y-2.5">
              <a href={`tel:${BRAND.phoneRaw}`} className="flex items-center gap-2.5 text-[0.82rem] text-[#AAAAAA] hover:text-[#C4783A] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#BBBBBB] shrink-0" />
                {BRAND.phone}
              </a>
<a href={BRAND.mapsDir} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-[0.82rem] text-[#AAAAAA] hover:text-[#C4783A] transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#BBBBBB] shrink-0 mt-0.5" />
                {BRAND.address}
              </a>
            </div>

            {/* Socials */}
            <div className="flex gap-2.5 mt-7">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-[rgba(196,120,58,0.1)] flex items-center justify-center text-[#AAAAAA] hover:text-[#C4783A] hover:border-[rgba(196,120,58,0.35)] transition-all duration-200 cursor-pointer"
                >
                  <Icon className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-[0.65rem] font-600 tracking-[0.22em] uppercase text-[#AAAAAA] mb-5">Hours</h4>
            <div className="space-y-3">
              {HOURS_COMPACT.map(({ day, time }) => (
                <div key={day}>
                  <div className="text-[0.7rem] tracking-wide text-[#999999] mb-0.5">{day}</div>
                  <div className="text-[0.82rem]" style={{ color: time === "Closed" ? "#999999" : "#BBBBBB" }}>
                    {time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Book CTA */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-[0.65rem] font-600 tracking-[0.22em] uppercase text-[#AAAAAA] mb-5">Ready?</h4>
              <p className="text-[0.82rem] text-[#AAAAAA] leading-relaxed mb-6">
                Book your appointment online — takes less than a minute.
              </p>
              <a
                href="#booking"
                className="inline-flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#C4783A] flex items-center justify-center group-hover:bg-[#E8976A] transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-[#080808] group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="text-[0.72rem] tracking-[0.18em] uppercase text-[#BBBBBB] group-hover:text-[#C4783A] transition-colors">
                  Book Now
                </span>
              </a>
            </div>

            <div className="mt-10">
              <Link
                href="/staff/login"
                className="text-[0.65rem] tracking-widest uppercase text-[#999999] hover:text-[#BBBBBB] transition-colors"
              >
                Staff Access
              </Link>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-14 pt-6 border-t border-[rgba(196,120,58,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.72rem] text-[#999999]">
            © {new Date().getFullYear()} Haus of Cuts. All rights reserved.
          </p>
          <p className="text-[0.72rem] text-[#999999]">
            Designed with <span className="text-[#BBBBBB]">♥</span> for the modern gentleman
          </p>
        </div>
      </div>
    </footer>
  );
}




