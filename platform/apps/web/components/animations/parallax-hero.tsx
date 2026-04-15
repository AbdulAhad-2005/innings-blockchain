"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

interface ParallaxHeroProps {
  children: React.ReactNode;
  className?: ClassValue;
  speed?: number;
}

export function ParallaxHero({ children, className, speed = 0.5 }: ParallaxHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -500 * speed]);

  return (
    <motion.div className={cn("relative overflow-hidden", className)} style={{ y }}>
      {children}
    </motion.div>
  );
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: ClassValue;
  speed?: number;
  direction?: "up" | "down";
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.3,
  direction = "up",
}: ParallaxLayerProps) {
  const { scrollYProgress } = useScroll();
  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 500 * speed * multiplier]
  );

  return (
    <motion.div className={cn("absolute inset-0", className)} style={{ y }}>
      {children}
    </motion.div>
  );
}
