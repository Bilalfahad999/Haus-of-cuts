"use client";

import { useEffect, useRef } from "react";
import { Shield, Package, Sparkles, Scissors, Calendar, Heart } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Expert Barbers",
    description: "Our craftsmen bring years of precision training and a passion for the art of barbering.",
  },
  {
    icon: Package,
    title: "Premium Products",
    description: "We use only the finest grooming products — from luxurious lathers to premium finishing waxes.",
  },
  {
    icon: Sparkles,
    title: "Luxury Experience",
    description: "From the moment you walk in, every detail is designed to make you feel like the only client.",
  },
  {
    icon: Scissors,
    title: "Precision Cuts",
    description: "We don't cut corners — literally. Every line is clean, every fade is flawless.",
  },
  {
    icon: Calendar,
    title: "Easy Online Booking",
    description: "Reserve your chair in seconds. No waiting, no hassle — just your appointment, confirmed.",
  },
  {
    icon: Heart,
    title: "Friendly Service",
    description: "We're passionate about people. You'll leave looking great and feeling even better.",
  },
];

export default function WhyUsSection() {
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
    <section ref={sectionRef} className="section-padding bg-[#0D0D0D]">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <span className="section-label reveal">Why Haus of Cuts</span>
          <h2 className="section-title reveal">
            The Standard of <span className="gold-text">Excellence</span>
          </h2>
          <p className="text-[#CCCCCC] max-w-lg mx-auto text-[0.95rem] leading-relaxed reveal">
            We've built a reputation on delivering more than a haircut. Here's what sets us apart.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="reveal group glass-card rounded-2xl p-7 hover:border-[rgba(196,120,58,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(196,120,58,0.08)] transition-all duration-350"
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[rgba(196,120,58,0.08)] flex items-center justify-center mb-5 group-hover:bg-[rgba(196,120,58,0.15)] group-hover:scale-110 transition-all duration-300">
                <Icon className="w-6 h-6 text-[#C4783A]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-[1.05rem] font-600 text-[#FFFFFF] mb-2">{title}</h3>
              <p className="text-[0.85rem] text-[#CCCCCC] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




