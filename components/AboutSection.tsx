"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const isDecimal = target % 1 !== 0;
          const start = performance.now();
          const duration = 1800;
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(isDecimal ? Math.round(eased * target * 10) / 10 : Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const STATS = [
  { value: 10, suffix: "+", label: "Years" },
  { value: 5000, suffix: "+", label: "Clients" },
  { value: 4.9, suffix: "★", label: "Rating" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(".reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative bg-[#080808] overflow-hidden">
      {/* Giant background word */}
      <div
        className="absolute -top-6 left-0 font-serif font-800 leading-none select-none pointer-events-none"
        style={{
          fontSize: "clamp(8rem, 22vw, 22rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(196,120,58,0.04)",
          letterSpacing: "-0.04em",
        }}
      >
        HAUS
      </div>

      <div className="relative container-narrow py-16 lg:py-36">
        {/* Top row: label + pull quote */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-10 mb-12 lg:mb-20 reveal">
          <div>
            <span className="section-label">Our Philosophy</span>
            <div className="mt-6 flex flex-row lg:flex-col gap-6 lg:gap-4">
              {STATS.map(({ value, suffix, label }) => (
                <div key={label} className="flex flex-col lg:flex-row lg:items-end gap-1 lg:gap-3">
                  <span className="font-serif text-[2.5rem] lg:text-[3.5rem] font-700 leading-none text-[#FFFFFF]">
                    <AnimatedNumber target={value} suffix={suffix} />
                  </span>
                  <span className="text-[0.65rem] tracking-[0.25em] uppercase text-[#BBBBBB] lg:mb-3">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <h2
              className="font-serif font-700 leading-[1.15] text-[#FFFFFF]"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)" }}
            >
              More than a haircut.
              <br />
              <em className="not-italic text-[#C4783A]">An experience crafted</em>
              <br />
              for the modern gentleman.
            </h2>
          </div>
        </div>

        {/* Bottom row: stacks on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-[3fr_2fr] gap-0 items-stretch">
          {/* Image */}
          <div className="reveal relative rounded-2xl lg:rounded-none overflow-hidden" style={{ height: "clamp(240px, 60vw, 560px)" }}>
            <img
              src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=85"
              alt="Haus of Cuts interior"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808] hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 to-transparent" />
          </div>

          {/* Text panel */}
          <div className="reveal flex flex-col justify-center pl-0 lg:pl-10 pt-8 lg:pt-0">
            <p className="text-[0.95rem] text-[#BBBBBB] leading-[1.85] mb-5">
              Haus of Cuts was built on a singular obsession — the belief that every man deserves a
              grooming experience that reflects his standard. We've built more than a barbershop.
            </p>
            <p className="text-[0.95rem] text-[#BBBBBB] leading-[1.85] mb-8">
              Our barbers are artists who understand the relationship between a great cut and
              unwavering confidence. Every appointment is tailored. Every detail is considered.
            </p>

            {/* Feature list */}
            <div className="space-y-3 mb-10">
              {["Precision over everything", "Premium products only", "Luxury, always"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-px bg-[#C4783A]" />
                  <span className="text-[0.85rem] tracking-wide text-[#CCCCCC]">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#booking"
              className="self-start inline-flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border border-[rgba(196,120,58,0.25)] flex items-center justify-center group-hover:bg-[#C4783A] group-hover:border-[#C4783A] transition-all duration-300">
                <svg className="w-4 h-4 text-[#C4783A] group-hover:text-[#080808] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <span className="text-[0.75rem] tracking-[0.2em] uppercase text-[#CCCCCC] group-hover:text-[#C4783A] transition-colors duration-300">
                Reserve a Chair
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}




