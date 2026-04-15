"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FadeIn, SlideUp } from "@/components/animations"
import { getStoredUser, setStoredUser } from "@/lib/auth"
import { apiRequest } from "@/lib/api"
import { User, Mail, Shield, Award } from "lucide-react"

interface ProfileUser {
  id: string
  name: string
  email: string
  role: "customer" | "brand" | "admin"
  points?: number
}

interface MeResponse {
  user: ProfileUser
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(getStoredUser())
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiRequest<MeResponse>("/api/auth/me")
        setUser(response.user)
        setStoredUser(response.user)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.")
      }
    }

    void loadProfile()
  }, [])

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="primary" className="mb-2">Profile</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Your Profile
        </h1>
      </FadeIn>

      <SlideUp delay={0.1}>
        <Card className="neo-card max-w-2xl">
          <CardContent className="pt-6">
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <div className="flex items-center gap-6 mb-8">
              <Avatar size="default" className="w-24 h-24 border-[3px] border-black">
                <AvatarFallback className="bg-[#00b852] text-white text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-display text-2xl font-bold">{user?.name || "User"}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <Badge variant="primary" className="mt-2">Customer</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#fff8e7] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-display font-bold">{user?.name || "Not set"}</p>
                </div>
              </div>

              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#fff8e7] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-display font-bold">{user?.email || "Not set"}</p>
                </div>
              </div>

              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#fff8e7] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-display font-bold">{user?.role || "customer"}</p>
                </div>
              </div>

              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#fff8e7] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Points</p>
                  <p className="font-display font-bold">{(user?.points ?? 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/user/rewards">View Rewards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
