"use client";

import { useState, useEffect, useRef } from "react";

const FAQS = [
  { q: "Do I need to book in advance?", a: "We highly recommend booking in advance to secure your preferred barber and time slot. Walk-ins are welcome based on availability, but booking guarantees your spot." },
  { q: "How long does a typical appointment take?", a: "A classic haircut takes about 45 minutes. Skin fades are 50 minutes, and our VIP Grooming Package is a full 2-hour luxury experience. Duration is listed for each service." },
  { q: "What products do you use?", a: "We exclusively use premium grooming products — including high-end shaving lathers, conditioning treatments, and luxury finishing products. The product matters as much as the skill." },
  { q: "Can I request a specific barber?", a: "Absolutely. When booking, simply select your preferred barber. If they're unavailable at your time, we'll suggest the nearest available slot with your preferred artist." },
  { q: "What is your cancellation policy?", a: "We ask for at least 24 hours notice for cancellations. Repeated no-shows may result in a deposit requirement for future bookings." },
  { q: "Is the hot towel shave safe for sensitive skin?", a: "Yes. Our barbers are trained in skin sensitivity techniques and use pre-shave oils and soothing aftershave treatments. Let your barber know of any specific sensitivities." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(".reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.05 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0A0A0A]">
      <div className="container-narrow py-24">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Left — sticky label */}
          <div className="reveal lg:sticky lg:top-28">
            <span className="section-label">FAQ</span>
            <h2 className="section-title mb-4">
              Common<br />
              <span className="gold-text">Questions</span>
            </h2>
            <p className="text-[0.85rem] text-[#AAAAAA] leading-relaxed max-w-xs">
              Everything you need to know before your visit. Still have questions? Reach out on WhatsApp.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 mt-6 text-[0.72rem] tracking-[0.18em] uppercase text-[#BBBBBB] hover:text-[#C4783A] transition-colors group cursor-pointer"
            >
              <span>Get in touch</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right — accordion */}
          <div className="border-t border-[rgba(196,120,58,0.07)]">
            {FAQS.map(({ q, a }, i) => (
              <div
                key={q}
                className="reveal border-b border-[rgba(196,120,58,0.07)]"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left cursor-pointer group"
                >
                  {/* Number */}
                  <span className="font-serif text-[0.65rem] tracking-widest text-[#999999] mt-1 shrink-0 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-serif text-[1rem] font-500 flex-1 leading-snug transition-colors duration-200"
                    style={{ color: open === i ? "#FFFFFF" : "#CCCCCC" }}
                  >
                    {q}
                  </span>
                  {/* Icon */}
                  <div className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-[#AAAAAA] transition-transform duration-300"
                      style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-350"
                  style={{ maxHeight: open === i ? "300px" : "0" }}
                >
                  <p className="pl-12 pb-6 text-[0.855rem] text-[#BBBBBB] leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




