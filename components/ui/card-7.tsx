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
  imagePosition?: string;
}

export function InteractiveProductCard({
  className,
  imageUrl,
  logoUrl,
  logoNode,
  title,
  description,
  price,
  imagePosition = "center",
  ...props
}: InteractiveProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const [isHoverable, setIsHoverable] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHoverable(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsHoverable(e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverable || !cardRef.current) return;
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
    if (!isHoverable) return;
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease-in-out",
    });
  };

  const parentStyle: React.CSSProperties = isHoverable
    ? { ...style, transformStyle: "preserve-3d" }
    : {};

  const imageStyle: React.CSSProperties = isHoverable
    ? { transform: "translateZ(-20px) scale(1.1)" }
    : {};

  const contentStyle: React.CSSProperties = isHoverable
    ? { transform: "translateZ(40px)" }
    : {};

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={parentStyle}
      className={cn(
        "relative w-full aspect-[9/12] rounded-2xl md:rounded-3xl bg-[#111111] shadow-lg overflow-hidden transition-transform duration-300",
        className
      )}
      {...props}
    >
      {/* Background image */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover rounded-2xl md:rounded-3xl"
        style={{ ...imageStyle, objectPosition: imagePosition }}
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-2xl md:rounded-3xl" />

      {/* Content */}
      <div
        className="absolute inset-0 p-3 md:p-5 flex flex-col justify-end"
        style={contentStyle}
      >
        {/* Glassmorphism footer */}
        <div className="flex items-end justify-between rounded-xl border border-white/10 bg-white/5 p-2.5 md:p-4 backdrop-blur-md">
          <div className="flex flex-col min-w-0 flex-1">
            {/* Price pill */}
            <div className="mb-1 md:mb-2">
              <div className="inline-block rounded-full bg-[rgba(196,120,58,0.85)] px-2.5 py-1 text-[10px] md:text-sm font-700 text-[#080808] backdrop-blur-sm leading-none">
                {price}
              </div>
            </div>
            <h3 className="text-xs sm:text-sm md:text-lg font-bold text-white leading-tight">
              {title}
            </h3>
            <p className="text-[10px] md:text-xs text-white/70 mt-0.5 line-clamp-2 md:line-clamp-none">
              {description}
            </p>
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
