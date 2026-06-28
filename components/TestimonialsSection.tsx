"use client";

import { useRef } from "react";

const TESTIMONIALS = [
  { name: "James Okafor", initials: "JO", rating: 5, review: "Hands down the best barbershop experience I've ever had. Marcus is a true artist. The atmosphere alone is worth the visit." },
  { name: "Liam Chen", initials: "LC", rating: 5, review: "I've been coming to Haus of Cuts for two years and I wouldn't go anywhere else. Consistent, professional, and genuinely premium." },
  { name: "Tyler Mensah", initials: "TM", rating: 5, review: "The VIP package completely transformed my look. The hot towel shave alone is worth every dollar. Pure luxury." },
  { name: "Nathan Brooks", initials: "NB", rating: 5, review: "Devon's beard work is incredible. He understood exactly what I wanted and delivered something even better." },
  { name: "Samuel Wright", initials: "SW", rating: 5, review: "Booked online, walked in and felt like a VIP from the second I arrived. The whole team is exceptional." },
  { name: "Ethan Cole", initials: "EC", rating: 5, review: "My skin fade has never looked better. Kai has an incredible eye for detail. This place has completely changed my grooming routine." },
];

const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#0A0A0A] overflow-hidden py-24">
      {/* Header */}
      <div className="container-narrow mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="section-label">Client Stories</span>
            <h2 className="section-title mb-0">
              Trusted by <span className="gold-text">Gentlemen</span>
            </h2>
          </div>
          {/* Large decorative quote */}
          <div
            className="font-serif text-[8rem] leading-none text-[rgba(196,120,58,0.04)] select-none pointer-events-none hidden md:block"
            aria-hidden
          >
            &ldquo;
          </div>
        </div>
      </div>

      {/* Scrolling row 1 — left */}
      <div
        className="flex gap-4 mb-4"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex gap-4 shrink-0" style={{ animation: "scrollLeft 36s linear infinite", width: "max-content" }}>
          {DOUBLED.slice(0, 8).map(({ name, initials, rating, review }, i) => (
            <TestimonialCard key={`a-${i}`} name={name} initials={initials} rating={rating} review={review} />
          ))}
        </div>
      </div>

      {/* Scrolling row 2 — right (reverse) */}
      <div
        className="flex gap-4"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex gap-4 shrink-0" style={{ animation: "scrollRight 42s linear infinite", width: "max-content" }}>
          {DOUBLED.slice(4, 12).map(({ name, initials, rating, review }, i) => (
            <TestimonialCard key={`b-${i}`} name={name} initials={initials} rating={rating} review={review} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function TestimonialCard({ name, initials, rating, review }: { name: string; initials: string; rating: number; review: string }) {
  return (
    <div className="w-72 shrink-0 bg-[#111111] border border-[rgba(196,120,58,0.07)] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, j) => (
          <span key={j} className="text-[#C4783A] text-xs">★</span>
        ))}
      </div>
      <p className="text-[0.82rem] text-[#BBBBBB] leading-relaxed flex-1">
        &ldquo;{review}&rdquo;
      </p>
      <div className="flex items-center gap-2.5 pt-3 border-t border-[rgba(196,120,58,0.06)]">
        <div className="w-7 h-7 rounded-full bg-[rgba(196,120,58,0.08)] flex items-center justify-center text-[0.6rem] font-600 text-[#BBBBBB] tracking-wider shrink-0">
          {initials}
        </div>
        <span className="text-[0.78rem] text-[#CCCCCC]">{name}</span>
      </div>
    </div>
  );
}



