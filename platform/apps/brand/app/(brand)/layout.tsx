"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Megaphone, 
  BarChart3, 
  Gift, 
  Settings,
  LogOut,
  Menu
} from "lucide-react";

const navItems = [
  { href: "/brand", label: "Dashboard", icon: LayoutDashboard },
  { href: "/brand/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/brand/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/brand/rewards", label: "Rewards", icon: Gift },
  { href: "/brand/settings", label: "Settings", icon: Settings },
];

export default function BrandDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();

  return (
    <div className="dashboard-grid">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Badge variant="secondary" className="text-sm font-semibold">
            Innings Brand
          </Badge>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/brand" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={`nav-item ${isActive ? 'active' : ''}`}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <Link href="/login">
            <div className="nav-item text-red-600">
              <LogOut className="w-4 h-4" />
              Sign Out
            </div>
          </Link>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}