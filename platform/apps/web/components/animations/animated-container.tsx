"use client";

import { useEffect, useRef } from "react";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: ClassValue;
}

export function AnimatedContainer({ children, className }: AnimatedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup: { enable: () => void } | undefined;

    const initAutoAnimate = async () => {
      const autoAnimate = (await import("@formkit/auto-animate")).default;
      cleanup = autoAnimate(container, {
        duration: 250,
        easing: "ease-out",
      }) as { enable: () => void };
    };

    initAutoAnimate();

    return () => {
      if (cleanup) {
        cleanup.enable();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
