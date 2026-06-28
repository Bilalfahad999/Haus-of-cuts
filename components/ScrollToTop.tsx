"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`fixed bottom-24 right-6 z-50 w-10 h-10 rounded-full glass-card border border-[rgba(196,120,58,0.2)] flex items-center justify-center text-[#C4783A] hover:bg-[rgba(196,120,58,0.1)] hover:border-[rgba(196,120,58,0.5)] hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
      }`}
    >
      <ChevronUp className="w-4 h-4" />
    </button>
  );
}


