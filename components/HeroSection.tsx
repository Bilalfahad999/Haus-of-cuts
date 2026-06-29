"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const WORDS = ["Precision", "Elegance", "Craft", "Excellence"];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,120,58,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=80')`,
        }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-[#080808]/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/20 via-transparent to-[#080808]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/40 via-transparent to-[#080808]/40" />

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Decorative lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 pointer-events-none">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-[rgba(196,120,58,0.4)]" />
        <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[#C4783A] rotate-90 whitespace-nowrap my-4">
          Scroll Down
        </div>
        <div className="w-px h-24 bg-gradient-to-t from-transparent to-[rgba(196,120,58,0.4)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto my-auto">
        <p
          className="section-label mb-6 animate-[fadeIn_0.8s_ease_0.2s_both]"
          style={{ opacity: 0, animation: "slideUp 0.8s ease 0.2s forwards" }}
        >
          Established · Premium Grooming · Modern Style
        </p>

        <h1
          className="font-serif text-[clamp(2.8rem,7vw,6rem)] font-800 leading-[1.22] md:leading-[1.08] text-[#FFFFFF] mb-6"
          style={{ opacity: 0, animation: "slideUp 0.8s ease 0.4s forwards" }}
        >
          Where{" "}
          <br className="sm:hidden" />
          <span
            className="gold-text inline-block transition-all duration-400"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)" }}
          >
            {WORDS[wordIdx]}
          </span>
          <br />
          Meets Style.
        </h1>

        <p
          className="text-[1.05rem] text-[#9A9A9A] max-w-xl mx-auto leading-relaxed mb-10"
          style={{ opacity: 0, animation: "slideUp 0.8s ease 0.6s forwards" }}
        >
          A sanctuary for the modern gentleman. Precision cuts, luxury grooming rituals, and
          an experience crafted to elevate your standard.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ opacity: 0, animation: "slideUp 0.8s ease 0.8s forwards" }}
        >
          <a
            href="#booking"
            className="bg-gradient-to-r from-[#C4783A] to-[#E8976A] text-[#080808] text-[0.75rem] font-700 tracking-[0.15em] uppercase px-8 py-4 rounded-full hover:shadow-[0_0_35px_rgba(196,120,58,0.6)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            Book Appointment
          </a>
          <a
            href="#services"
            className="border border-[rgba(245,240,232,0.25)] text-[#FFFFFF] text-[0.75rem] font-500 tracking-[0.15em] uppercase px-8 py-4 rounded-full hover:border-[#C4783A] hover:text-[#C4783A] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            View Services
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(196,120,58,0.1)] rounded-2xl overflow-hidden"
          style={{ opacity: 0, animation: "slideUp 0.8s ease 1s forwards" }}
        >
          {[
            { value: "10+", label: "Years Experience" },
            { value: "5000+", label: "Happy Clients" },
            { value: "4.9★", label: "Rating" },
            { value: "100%", label: "Premium Products" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[rgba(8,8,8,0.8)] backdrop-blur-sm py-5 px-4 text-center">
              <div className="font-serif text-2xl font-700 gold-text mb-1">{stat.value}</div>
              <div className="text-[0.7rem] tracking-widest uppercase text-[#CCCCCC]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#CCCCCC] hover:text-[#C4783A] transition-colors cursor-pointer animate-bounce"
      >
        <ChevronDown className="w-5 h-5" />
      </a>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}




