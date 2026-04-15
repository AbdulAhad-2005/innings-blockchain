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

interface RegisterResponse {
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

export default function SignupPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (selectedRole === "customer" && !walletAddress.trim()) {
      setError("Wallet address is required for customer accounts.")
      return
    }

    try {
      setSubmitting(true)

      const payload: Record<string, string> = {
        name,
        email,
        password,
        role: selectedRole,
      }

      if (selectedRole === "customer") {
        payload.walletAddress = walletAddress.trim()
      }
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data: RegisterResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Registration failed")
      }

      setToken(data.token)
      setStoredRole(data.user.role)
      setStoredUser(data.user)
      
      router.push(`/${data.user.role === "customer" ? "user" : data.user.role}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
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
                Create Account
              </h1>
              <p className="text-gray-600 mb-8">
                Join the ultimate sports engagement platform
              </p>
            </FadeIn>

            {/* Role Selection */}
            <StaggerChildren delay={0.1} className="mb-8">
              <Label className="mb-3 block">Choose your role</Label>
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

            {/* Signup Form */}
            <SlideUp delay={0.3}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="neo-input"
                  />
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="neo-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="neo-input"
                    />
                  </div>
                </div>

                {selectedRole === "customer" && (
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      type="text"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="neo-input"
                    />
                  </div>
                )}

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
                  {submitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#00b852] font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </SlideUp>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden lg:flex items-center justify-center bg-black text-white border-l-[3px] border-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 border-[8px] border-white rotate-12" />
            <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#ffd700]" />
            <div className="absolute top-1/3 right-1/4 w-24 h-24 border-[6px] border-[#00b852] rotate-45" />
          </div>
          <FadeIn direction="right" delay={0.2} className="relative z-10 text-center p-16">
            <div className="neo-card neo-card-cream p-12 max-w-md border-white">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#ffd700] flex items-center justify-center border-[3px] border-black">
                <Trophy className="w-10 h-10 text-black" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase mb-4 text-black">
                Start Your Journey
              </h2>
              <p className="text-gray-600">
                Create your account today and unlock exclusive rewards, 
                compete in live quizzes, and be part of the community.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  )
}
