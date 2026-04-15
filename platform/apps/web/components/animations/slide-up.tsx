"use client";

import { motion } from "motion/react";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

interface SlideUpProps {
  children: React.ReactNode;
  className?: ClassValue;
  delay?: number;
  duration?: number;
}

export function SlideUp({ children, className, delay = 0, duration = 0.4 }: SlideUpProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
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
