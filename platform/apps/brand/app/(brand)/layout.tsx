"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { clearToken } from "@/lib/auth";
import { 
  LayoutDashboard, 
  Megaphone, 
  BarChart3, 
  Gift, 
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/settings", label: "Settings", icon: Settings },
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
          <Link href="/login" onClick={clearToken}>
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