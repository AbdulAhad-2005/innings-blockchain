import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-bold text-sm uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-[3px] border-black bg-white text-black shadow-[4px_4px_0_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        primary:
          "border-[3px] border-[#009644] bg-[#00b852] text-white shadow-[4px_4px_0_#009644] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#009644] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        accent:
          "border-[3px] border-[#e6c200] bg-[#ffd700] text-black shadow-[4px_4px_0_#e6c200] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#e6c200] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "border-[3px] border-[#0052cc] bg-[#0066ff] text-white shadow-[4px_4px_0_#0052cc] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#0052cc] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        destructive:
          "border-[3px] border-black bg-red-600 text-white shadow-[4px_4px_0_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        outline:
          "border-[3px] border-black bg-white text-black shadow-[4px_4px_0_black] hover:bg-gray-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        ghost:
          "border-[3px] border-transparent bg-transparent text-black shadow-none hover:bg-gray-100 hover:border-black hover:translate-x-0 hover:translate-y-0 active:bg-gray-200",
        link: "border-none shadow-none text-[#00b852] underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
