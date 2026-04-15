"use client";

import { motion } from "motion/react";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: ClassValue;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  direction = "up",
}: FadeInProps) {
  const directionVariants = {
    up: { from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 } },
    down: { from: { opacity: 0, y: -20 }, to: { opacity: 1, y: 0 } },
    left: { from: { opacity: 0, x: -20 }, to: { opacity: 1, x: 0 } },
    right: { from: { opacity: 0, x: 20 }, to: { opacity: 1, x: 0 } },
    none: { from: { opacity: 0 }, to: { opacity: 1 } },
  };

  const variant = directionVariants[direction];

  return (
    <motion.div
      className={cn(className)}
      initial={variant.from}
      animate={variant.to}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
