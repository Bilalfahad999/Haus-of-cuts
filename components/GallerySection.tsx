"use client";

import { useState, useEffect, useRef } from "react";
import { X, ZoomIn } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80", alt: "Classic skin fade" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", alt: "Barber at work" },
  { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", alt: "Premium hair styling" },
  { src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80", alt: "Beard trim" },
  { src: "https://images.unsplash.com/photo-1587909209111-5097ee578ec3?w=600&q=80", alt: "Shop interior" },
  { src: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80", alt: "Modern fade" },
  { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", alt: "Hair texture" },
  { src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80", alt: "Barber portrait" },
  { src: "https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?w=600&q=80", alt: "Clean cut result" },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null);
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="section-padding bg-[#0D0D0D]">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <span className="section-label reveal">Our Work</span>
          <h2 className="section-title reveal">
            Crafted with <span className="gold-text">Precision</span>
          </h2>
          <p className="text-[#CCCCCC] max-w-lg mx-auto text-[0.95rem] leading-relaxed reveal">
            Every cut tells a story. Browse our portfolio of precision work and luxury grooming experiences.
          </p>
        </div>

        <div className="masonry-grid reveal">
          {GALLERY_IMAGES.map(({ src, alt }, i) => (
            <div
              key={src}
              className="masonry-item group relative overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => setLightbox(src)}
            >
              <img
                src={src}
                alt={alt}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#080808]/0 group-hover:bg-[#080808]/40 transition-all duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[rgba(196,120,58,0.9)] flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <ZoomIn className="w-4.5 h-4.5 text-[#080808]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-[#080808]/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-white hover:bg-[#C4783A] hover:text-[#080808] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox}
            alt="Gallery preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}



