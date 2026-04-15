"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { getStoredUser, setStoredUser } from "@/lib/auth"
import { apiRequest } from "@/lib/api"
import { Building2, Mail, Megaphone, Settings } from "lucide-react"

interface MeResponse {
  user: {
    id: string
    name: string
    email: string
    role: "customer" | "brand" | "admin"
  }
}

interface CampaignItem {
  _id: string
}

export default function BrandSettingsPage() {
  const [user, setUser] = useState(getStoredUser())
  const [campaignCount, setCampaignCount] = useState(0)
  const [apiStatus, setApiStatus] = useState("Checking")

  useEffect(() => {
    const loadSettings = async () => {
      const profile = await apiRequest<MeResponse>("/api/auth/me")
      setUser(profile.user)
      setStoredUser(profile.user)

      const campaigns = await apiRequest<CampaignItem[]>("/api/brands/campaigns")
      setCampaignCount(campaigns.length)
      setApiStatus("Active")
    }

    void loadSettings().catch(() => {
      setApiStatus("Unavailable")
    })
  }, [])

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="secondary" className="mb-2">Settings</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Account Settings
        </h1>
      </FadeIn>

      <SlideUp delay={0.1}>
        <Card className="neo-card max-w-2xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#e6f0ff] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#0066ff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand Name</p>
                  <p className="font-display font-bold">{user?.name || "Brand"}</p>
                </div>
              </div>

              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#e6f0ff] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#0066ff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-display font-bold">{user?.email}</p>
                </div>
              </div>

              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#e6f0ff] flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-[#0066ff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Campaigns</p>
                  <p className="font-display font-bold">{campaignCount}</p>
                </div>
              </div>

              <div className="neo-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 border-[2px] border-black bg-[#e6f0ff] flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#0066ff]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">API Status</p>
                  <p className="font-display font-bold">{apiStatus}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/brand/campaigns">Manage Campaigns</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/brand/rewards">Manage Rewards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
