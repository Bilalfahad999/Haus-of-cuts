"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  logoUrl?: string;
  logoNode?: React.ReactNode;
  title: string;
  description: string;
  price: string;
}

export function InteractiveProductCard({
  className,
  imageUrl,
  logoUrl,
  logoNode,
  title,
  description,
  price,
  ...props
}: InteractiveProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = ((y - height / 2) / (height / 2)) * -8;
    const rotateY = ((x - width / 2) / (width / 2)) * 8;
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease-in-out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transformStyle: "preserve-3d" }}
      className={cn(
        "relative w-full aspect-[9/12] rounded-3xl bg-[#111111] shadow-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Background image */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover rounded-3xl"
        style={{ transform: "translateZ(-20px) scale(1.1)" }}
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-3xl" />

      {/* Content */}
      <div
        className="absolute inset-0 p-5 flex flex-col justify-end"
        style={{ transform: "translateZ(40px)" }}
      >
        {/* Glassmorphism footer */}
        <div className="flex items-end justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <div className="flex flex-col">
            {/* Price pill */}
            <div className="mb-2">
              <div className="inline-block rounded-full bg-[rgba(196,120,58,0.85)] px-4 py-1.5 text-sm font-700 text-[#080808] backdrop-blur-sm">
                {price}
              </div>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
            <p className="text-xs text-white/70 mt-0.5">{description}</p>
          </div>
          {logoNode ? (
            <div className="shrink-0 ml-2 text-[#C4783A]">{logoNode}</div>
          ) : logoUrl ? (
            <img src={logoUrl} alt="icon" className="h-4 w-auto shrink-0 ml-2" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
