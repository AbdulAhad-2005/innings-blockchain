"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SlideUp } from "@/components/animations"
import {
  Home,
  Trophy,
  Gamepad2,
  Gift,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { getStoredUser, clearToken, clearStoredUser, clearStoredRole } from "@/lib/auth"

const navItems = [
  { href: "/user", label: "Home", icon: Home },
  { href: "/user/matches", label: "Matches", icon: Gamepad2 },
  { href: "/user/quizzes", label: "Quizzes", icon: Trophy },
  { href: "/user/rewards", label: "Rewards", icon: Gift },
  { href: "/user/profile", label: "Profile", icon: User },
]

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = getStoredUser()

  useEffect(() => {
    if (!user || user.role !== "customer") {
      router.push("/login")
    }
  }, [user, router])

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // Ignore network logout errors and clear local auth state regardless.
    }

    clearToken()
    clearStoredUser()
    clearStoredRole()
    router.push("/login")
  }

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r-[3px] border-black bg-white z-50">
        <div className="p-6 border-b-[3px] border-black">
          <Link href="/user">
            <Badge variant="primary" className="text-sm px-4 py-2">
              Innings
            </Badge>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 font-display text-sm font-bold uppercase tracking-wide transition-all ${
                    isActive
                      ? "bg-[#00b852] text-white border-[3px] border-[#009644]"
                      : "border-[3px] border-transparent hover:bg-[#fff8e7] hover:border-black"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        <Separator className="bg-black" />

        <div className="p-4">
          <div className="neo-card p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar size="default" className="border-[2px] border-black">
                <AvatarFallback className="bg-[#00b852] text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
            <Badge variant="primary" className="text-xs">Customer</Badge>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b-[3px] border-black bg-white z-50 flex items-center justify-between px-4">
        <Link href="/user">
          <Badge variant="primary" className="text-sm px-3 py-1">
            Innings
          </Badge>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="neo-btn p-2"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <SlideUp className="absolute bottom-0 left-0 right-0 bg-white border-t-[3px] border-black p-4">
            <nav className="space-y-2 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 font-display text-sm font-bold uppercase ${
                        isActive ? "bg-[#00b852] text-white" : ""
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </div>
                  </Link>
                )
              })}
            </nav>
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            </SlideUp>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
