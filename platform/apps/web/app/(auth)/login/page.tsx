"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations"
import { setToken, setStoredRole, setStoredUser, type UserRole } from "@/lib/auth"
import { Zap, Trophy, Sparkles } from "lucide-react"

const roleFeatures = [
  { icon: Zap, label: "Customer", desc: "Play quizzes & earn rewards", color: "primary" as const },
  { icon: Trophy, label: "Brand", desc: "Create campaigns & track analytics", color: "secondary" as const },
  { icon: Sparkles, label: "Admin", desc: "Manage platform & users", color: "accent" as const },
]

interface LoginResponse {
  message?: string
  error?: string
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }

    try {
      setSubmitting(true)
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      })

      const data: LoginResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed")
      }

      setToken(data.token)
      setStoredRole(data.user.role)
      setStoredUser(data.user)
      
      router.push(`/${data.user.role === "customer" ? "user" : data.user.role}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <FadeIn direction="up">
              <Link href="/">
                <Badge variant="primary" className="mb-6">Innings</Badge>
              </Link>
              <h1 className="font-display text-4xl md:text-5xl font-bold uppercase mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 mb-8">
                Sign in to continue to your dashboard
              </p>
            </FadeIn>

            {/* Role Selection */}
            <StaggerChildren delay={0.1} className="mb-8">
              <Label className="mb-3 block">Select your role</Label>
              <div className="grid grid-cols-3 gap-3">
                {roleFeatures.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.label.toLowerCase()
                  return (
                    <StaggerItem key={role.label}>
                      <button
                        type="button"
                        onClick={() => setSelectedRole(role.label.toLowerCase() as UserRole)}
                        className={`neo-card p-4 text-center w-full transition-all ${
                          isSelected 
                            ? role.color === "primary" 
                              ? "bg-[#00b852] text-white border-[#009644]"
                              : role.color === "secondary"
                              ? "bg-[#0066ff] text-white border-[#0052cc]"
                              : "bg-[#ffd700] text-black border-[#e6c200]"
                            : ""
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-display text-xs font-bold uppercase">
                          {role.label}
                        </div>
                      </button>
                    </StaggerItem>
                  )
                })}
              </div>
            </StaggerChildren>

            {/* Login Form */}
            <SlideUp delay={0.3}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neo-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="neo-input"
                  />
                </div>

                {error && (
                  <div className="neo-card p-4 bg-red-50 border-red-500">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-base py-4"
                  disabled={submitting}
                >
                  {submitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-[#00b852] font-bold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </SlideUp>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden lg:flex items-center justify-center bg-[#fff8e7] border-l-[3px] border-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-[8px] border-black rotate-12" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#00b852]" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border-[6px] border-[#0066ff] rotate-45" />
          </div>
          <FadeIn direction="left" delay={0.2} className="relative z-10 text-center p-16">
            <div className="neo-card neo-card-cream p-12 max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#00b852] flex items-center justify-center border-[3px] border-black">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase mb-4">
                Start Winning
              </h2>
              <p className="text-gray-600">
                Join thousands of fans competing in live quizzes and earning 
                blockchain-verified rewards.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  )
}
