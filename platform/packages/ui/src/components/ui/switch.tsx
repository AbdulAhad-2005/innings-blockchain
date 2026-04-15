"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center border-[3px] border-black bg-white shadow-[3px_3px_0_black] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#00b852] data-[state=checked]:border-[#00b852] data-[state=checked]:shadow-none",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 border-[2px] border-black bg-white shadow-[2px_2px_0_black] transition-transform duration-200 will-change-[transform]",
        "data-[state=checked]:translate-x-[28px] data-[state=checked]:bg-white data-[state=checked]:border-[#00b852] data-[state=checked]:shadow-[-2px_2px_0_#009644]"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
