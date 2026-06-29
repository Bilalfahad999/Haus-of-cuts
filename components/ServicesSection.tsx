"use client";

import { useEffect, useRef, useState } from "react";
import { Scissors, Star } from "lucide-react";
import { InteractiveProductCard } from "@/components/ui/card-7";

const SERVICES = [
  {
    name: "Classic Haircut",
    desc: "Tailored to your style & face shape",
    price: "$45",
    popular: false,
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2533ce?w=600&q=80",
  },
  {
    name: "Skin Fade",
    desc: "Seamless gradient, sharp modern look",
    price: "$55",
    popular: true,
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80",
  },
  {
    name: "Buzz Cut",
    desc: "Bold, clean and effortless",
    price: "$35",
    popular: false,
    image: "https://images.unsplash.com/photo-1583243567109-1831b2a600f3?w=600&q=80",
  },
  {
    name: "Hair & Beard Combo",
    desc: "Complete grooming in one session",
    price: "$75",
    popular: true,
    image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&q=80",
  },
  {
    name: "Kids Haircut",
    desc: "Gentle & precise for young gentlemen",
    price: "$30",
    popular: false,
    image: "/kids-haircut.jpg",
  },
  {
    name: "Hot Towel Shave",
    desc: "Steam, blade and calm in sequence",
    price: "$50",
    popular: false,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
  },
  {
    name: "Beard Trim",
    desc: "Sculpted to complement your features",
    price: "$30",
    popular: false,
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80",
  },
  {
    name: "VIP Package",
    desc: "Cut, beard, hot towel & premium products",
    price: "$120",
    popular: false,
    image: "https://images.unsplash.com/photo-1512864084360-7c0d4d2bce6e?w=600&q=80",
  },
];

export default function ServicesSection() {
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
    <section id="services" className="relative bg-[#080808]">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(196,120,58,0.3)] to-transparent" />

      <div className="container-narrow py-20">
        {/* Header */}
        <div
          ref={headRef}
          className="text-center mb-14 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          <span className="section-label justify-center flex">Our Services</span>
          <h2 className="section-title">
            Everything You <span className="gold-text">Need</span>
          </h2>
          <p className="text-[0.9rem] text-[#888] max-w-md mx-auto leading-relaxed">
            Every service is delivered with precision, care, and the highest quality products.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className="relative"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.6s ease ${i * 70}ms, transform 0.6s ease ${i * 70}ms`,
              }}
            >
              {s.popular && (
                <div className="absolute -top-3 left-4 z-10">
                  <span className="text-[0.6rem] font-800 tracking-[0.2em] uppercase px-3 py-1 rounded-full" style={{ background: "#C4783A", color: "#080808" }}>
                    Popular
                  </span>
                </div>
              )}
              <InteractiveProductCard
                imageUrl={s.image}
                title={s.name}
                description={s.desc}
                price={s.price}
                logoNode={s.popular ? <Star className="w-4 h-4 fill-current" /> : <Scissors className="w-4 h-4" />}
                imagePosition={s.name === "Kids Haircut" ? "top" : "center"}
                className={s.popular ? "border border-[rgba(196,120,58,0.3)] shadow-[0_8px_32px_rgba(196,120,58,0.1)]" : ""}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(196,120,58,0.15)] to-transparent" />
    </section>
  );
}
