"use client"

import React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <TabsPrimitive.List
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500",
      className
    )}
    {...props}
  />
)

const TabsTrigger = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow",
      className
    )}
    {...props}
  />
)

const TabsContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <TabsPrimitive.Content
    className={cn(
      "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
)

export { Tabs, TabsList, TabsTrigger, TabsContent }