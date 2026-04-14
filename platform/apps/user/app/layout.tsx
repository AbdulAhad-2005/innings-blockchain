import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { connectDB } from "../../../../lib/db";

export const metadata: Metadata = {
  title: "Innings Blockchain",
  description:
    "Premium sports engagement platform for matches, quizzes, and rewards.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectDB();
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--color-ink)] text-white">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
