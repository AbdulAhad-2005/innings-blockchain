import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Innings Brand Dashboard",
  description: "Brand campaign management platform",
};

export default function BrandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f8fafc] text-slate-900">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}