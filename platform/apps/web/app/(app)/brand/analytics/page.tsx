"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { BarChart3, TrendingUp, Users, Target } from "lucide-react"

interface CampaignItem {
  _id: string
  status: string
  rewardCount?: number
}

export default function BrandAnalyticsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await apiRequest<CampaignItem[]>("/api/brands/campaigns")
        setCampaigns(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics.")
      }
    }

    void loadCampaigns()
  }, [])

  const metrics = useMemo(() => {
    const total = campaigns.length
    const active = campaigns.filter((campaign) =>
      ["active", "approved", "scheduled"].includes(campaign.status.toLowerCase())
    ).length
    const completed = campaigns.filter((campaign) => campaign.status.toLowerCase() === "completed").length
    const participants = campaigns.reduce((sum, campaign) => sum + (campaign.rewardCount ?? 0), 0)

    const engagement = total ? Math.round((active / total) * 100) : 0
    const conversion = total ? Math.round((completed / total) * 100) : 0

    return [
      { label: "Total Engagement", value: `${engagement}%`, icon: TrendingUp, change: `${active} active` },
      { label: "Active Users", value: participants.toLocaleString(), icon: Users, change: `${total} campaigns` },
      { label: "Conversion Rate", value: `${conversion}%`, icon: Target, change: `${completed} completed` },
    ]
  }, [campaigns])

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="secondary" className="mb-2">Analytics</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Campaign Analytics
        </h1>
        <p className="text-gray-600 mt-2">Track your campaign performance</p>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <FadeIn key={metric.label} direction="up" delay={index * 0.1}>
              <Card className="neo-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-6 h-6 text-[#0066ff]" />
                    <Badge variant="primary" className="text-xs">{metric.change}</Badge>
                  </div>
                  <p className="font-display text-3xl font-bold mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </CardContent>
              </Card>
            </FadeIn>
          )
        })}
      </div>

      {error && (
        <Card className="neo-card border-red-500">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      <FadeIn direction="up" delay={0.3}>
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Performance Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="neo-card p-8 text-center bg-[#fff8e7]">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-bold mb-2">Chart Visualization</h3>
              <p className="text-gray-600">
                Campaign trend charts can be plugged in directly once historical snapshots are available.
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
