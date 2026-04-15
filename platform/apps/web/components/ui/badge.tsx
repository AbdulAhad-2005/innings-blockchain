import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:
          "border-[2px] border-black bg-white text-black",
        primary:
          "border-[2px] border-[#009644] bg-[#00b852] text-white",
        accent:
          "border-[2px] border-[#e6c200] bg-[#ffd700] text-black",
        secondary:
          "border-[2px] border-[#0052cc] bg-[#0066ff] text-white",
        destructive:
          "border-[2px] border-black bg-red-600 text-white",
        outline:
          "border-[2px] border-black bg-transparent text-black",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof badgeVariants>) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
