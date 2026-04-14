import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

const links = [
  { href: "/app", label: "Home" },
  { href: "/matches", label: "Matches" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/rewards", label: "Rewards" },
  { href: "/profile", label: "Profile" },
];

export default function UserAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <header className="glass-panel fade-rise mb-8 rounded-[1.5rem] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="font-display text-xs uppercase tracking-[0.4em]">
              Innings
            </Badge>
            <p className="text-sm text-white/70">Sporty premium experience</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm">
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
