"use client";

import { useEffect, useRef, useState } from "react";
import { Award } from "lucide-react";
import { InteractiveProductCard } from "@/components/ui/card-7";

const TEAM = [
  {
    name: "Billy",
    role: "Master Barber & Founder",
    experience: "14+ Yrs Experience",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
  },
  {
    name: "Devon Clarke",
    role: "Senior Barber",
    experience: "8 Yrs Experience",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    name: "Kai Thompson",
    role: "Creative Stylist",
    experience: "6 Yrs Experience",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    name: "Jordan Mills",
    role: "Junior Barber",
    experience: "4 Yrs Experience",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
];

export default function TeamSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="team" className="bg-[#080808]">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(196,120,58,0.15)] to-transparent" />

      <div className="container-narrow py-20">
        {/* Header */}
        <div
          ref={headRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          <div>
            <span className="section-label">The Craftsmen</span>
            <h2 className="section-title mb-0">
              Meet the <span className="gold-text">Artists</span>
            </h2>
          </div>
          <p className="text-[0.875rem] text-[#BBBBBB] max-w-xs leading-relaxed md:text-right">
            Dedicated professionals who&apos;ve made barbering a refined, elevated art form.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
              }}
            >
              <InteractiveProductCard
                imageUrl={member.image}
                title={member.name}
                description={member.role}
                price={member.experience}
                logoNode={<Award className="w-4 h-4" />}
                className="hover:border-[rgba(196,120,58,0.3)] hover:shadow-[0_8px_32px_rgba(196,120,58,0.1)]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(196,120,58,0.15)] to-transparent" />
    </section>
  );
}
