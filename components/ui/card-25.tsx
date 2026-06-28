import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Stat {
  icon: React.ReactNode;
  label: string;
}

export interface AnimatedHikeCardProps {
  title: string;
  images: string[];
  stats: Stat[];
  description: string;
  href: string;
  className?: string;
}

export const AnimatedHikeCard = React.forwardRef<
  HTMLAnchorElement,
  AnimatedHikeCardProps
>(({ title, images, stats, description, href, className }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "group relative block w-full cursor-pointer rounded-2xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg",
        className
      )}
      aria-label={`Learn more about ${title}`}
    >
      <div className="flex flex-col">
        {/* Card Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tighter">{title}</h2>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1 shrink-0" />
        </div>

        {/* Stacked Images with Hover Animation */}
        <div className="relative mb-6 h-32">
          {images.map((src, index) => (
            <div
              key={index}
              className={cn(
                "absolute h-full w-[40%] overflow-hidden rounded-lg border-2 border-background shadow-md transition-all duration-300 ease-in-out",
                "group-hover:translate-x-[var(--tx)] group-hover:rotate-[var(--r)]"
              )}
              style={{
                transform: `translateX(${index * 32}px)`,
                '--tx': `${index * 80}px`,
                '--r': `${index * 5 - 5}deg`,
                zIndex: images.length - index,
              } as React.CSSProperties & Record<string, string>}
            >
              <img
                src={src}
                alt={`${title} view ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-1.5">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </a>
  );
});

AnimatedHikeCard.displayName = "AnimatedHikeCard";
