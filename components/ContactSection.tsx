"use client";

import { Phone, MapPin, Clock } from "lucide-react";
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

const CONTACTS = [
  { icon: Phone, label: "Phone", value: BRAND.phone, href: `tel:${BRAND.phoneRaw}` },
  { icon: MapPin, label: "Address", value: BRAND.address, href: BRAND.mapsDir },
];

const SOCIALS = [
  { href: BRAND.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: BRAND.tiktok, icon: TikTokIcon, label: "TikTok" },
  { href: BRAND.facebook, icon: FacebookIcon, label: "Facebook" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#080808]">
      {/* Full-width map */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <iframe
          src={BRAND.mapEmbed}
          width="100%"
          height="100%"
          style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Haus of Cuts Location"
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
      </div>

      {/* Info grid */}
      <div className="container-narrow pt-4 pb-24">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-6 pt-10 border-t border-[rgba(196,120,58,0.07)]">
          {/* Column 1: Title + socials */}
          <div>
            <span className="section-label">Find Us</span>
            <h2 className="section-title mb-6">
              Visit <span className="gold-text">Haus of Cuts</span>
            </h2>
            <div className="flex gap-3">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[rgba(196,120,58,0.1)] flex items-center justify-center text-[#AAAAAA] hover:text-[#C4783A] hover:border-[rgba(196,120,58,0.4)] transition-all duration-200 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Contact details */}
          <div className="space-y-5">
            <h4 className="text-[0.65rem] tracking-[0.22em] uppercase text-[#AAAAAA] mb-4">Contact</h4>
            {CONTACTS.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-[#C4783A] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[0.65rem] tracking-widest uppercase text-[#AAAAAA] mb-0.5">{label}</div>
                  <a href={href} target={label === "Address" ? "_blank" : undefined} rel="noopener noreferrer" className="text-[0.875rem] text-[#CCCCCC] hover:text-[#C4783A] transition-colors">
                    {value}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3: Hours + directions */}
          <div>
            <h4 className="text-[0.65rem] tracking-[0.22em] uppercase text-[#AAAAAA] mb-4 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Hours
            </h4>
            <div className="space-y-3 mb-8">
              {HOURS_COMPACT.map(({ day, time }) => (
                <div key={day} className="flex justify-between text-[0.85rem]">
                  <span className="text-[#AAAAAA]">{day}</span>
                  <span style={{ color: time === "Closed" ? "#AAAAAA" : "#CCCCCC" }}>{time}</span>
                </div>
              ))}
            </div>
            <a
              href={BRAND.mapsDir}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#C4783A] flex items-center justify-center group-hover:bg-[#E8976A] transition-colors duration-300">
                <svg className="w-3.5 h-3.5 text-[#080808]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <span className="text-[0.72rem] tracking-[0.18em] uppercase text-[#BBBBBB] group-hover:text-[#C4783A] transition-colors">
                Get Directions
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}



