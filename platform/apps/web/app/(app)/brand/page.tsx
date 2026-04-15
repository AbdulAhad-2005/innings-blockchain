"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations"
import { AnimatedContainer } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { LayoutDashboard, Megaphone, Users, TrendingUp, ArrowRight, Plus } from "lucide-react"

interface CampaignItem {
  _id: string
  title?: string
  status: string
  rewardCount?: number
  budget?: number
}

interface RewardItem {
  _id: string
  points: number
  description?: string
}

export default function BrandDashboard() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const results = await Promise.allSettled([
        apiRequest<CampaignItem[]>("/api/brands/campaigns"),
        apiRequest<RewardItem[]>("/api/rewards", { params: { mine: true } }),
      ])

      if (results[0].status === "fulfilled") {
        setCampaigns(results[0].value)
      }

      if (results[1].status === "fulfilled") {
        setRewards(results[1].value)
      }

      if (results.some((entry) => entry.status === "rejected")) {
        setError("Some dashboard data could not be loaded.")
      }
    }

    void loadData()
  }, [])

  const stats = useMemo(() => {
    const activeCampaigns = campaigns.filter((campaign) =>
      ["active", "approved", "scheduled"].includes(campaign.status.toLowerCase())
    ).length

    const totalParticipants = campaigns.reduce(
      (sum, campaign) => sum + (campaign.rewardCount ?? 0),
      0
    )

    const engagementRate = campaigns.length
      ? Math.round((activeCampaigns / campaigns.length) * 100)
      : 0

    const totalRevenue = campaigns.reduce((sum, campaign) => sum + (campaign.budget ?? 0), 0)

    return [
      {
        label: "Active Campaigns",
        value: activeCampaigns.toString(),
        icon: Megaphone,
        color: "primary" as const,
      },
      {
        label: "Total Users",
        value: totalParticipants.toLocaleString(),
        icon: Users,
        color: "secondary" as const,
      },
      {
        label: "Engagement Rate",
        value: `${engagementRate}%`,
        icon: TrendingUp,
        color: "accent" as const,
      },
      {
        label: "Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        icon: LayoutDashboard,
        color: "primary" as const,
      },
    ]
  }, [campaigns])

  const recentCampaigns = useMemo(
    () =>
      campaigns.slice(0, 3).map((campaign) => ({
        name: campaign.title || "Campaign",
        status: campaign.status,
        participants: campaign.rewardCount ?? 0,
        conversions: `${Math.min(95, Math.max(0, Math.round((campaign.rewardCount ?? 0) / 10)))}%`,
      })),
    [campaigns]
  )

  const topRewards = useMemo(
    () =>
      rewards.slice(0, 3).map((reward) => ({
        name: reward.description || `Reward ${reward._id.slice(-4)}`,
        claims: Math.floor(reward.points * 0.6),
        remaining: Math.max(0, reward.points - Math.floor(reward.points * 0.6)),
      })),
    [rewards]
  )

  return (
    <AnimatedContainer className="space-y-8">
      {/* Header */}
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">Brand Dashboard</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-1">Here's how your campaigns are performing</p>
          </div>
          <Button variant="secondary" className="w-fit">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <StaggerItem key={stat.label}>
              <Card className={`neo-card-${stat.color} neo-card p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-display font-bold uppercase tracking-wide text-gray-600">
                    {stat.label}
                  </span>
                  <Icon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="font-display text-3xl font-bold">
                  {stat.value}
                </div>
              </Card>
            </StaggerItem>
          )
        })}
      </StaggerChildren>

      {error && (
        <Card className="neo-card border-red-500">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      {/* Recent Campaigns */}
      <Card className="neo-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Participants</th>
                  <th>Conversion</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.name}>
                    <td className="font-display font-bold">{campaign.name}</td>
                    <td>
                      <Badge
                        variant={
                          campaign.status === "Active"
                            ? "primary"
                            : campaign.status === "Draft"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td>{campaign.participants.toLocaleString()}</td>
                    <td>{campaign.conversions}</td>
                    <td>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {recentCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500">
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Rewards */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Top Performing Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRewards.map((reward, index) => (
                <SlideUp key={reward.name} delay={index * 0.1}>
                  <div className="neo-card p-4 flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold">{reward.name}</p>
                      <p className="text-sm text-gray-600">
                        {reward.claims} claims ({reward.remaining} remaining)
                      </p>
                    </div>
                    <Badge variant="primary">{Math.round((reward.claims / (reward.claims + reward.remaining)) * 100)}%</Badge>
                  </div>
                </SlideUp>
              ))}
              {topRewards.length === 0 && (
                <div className="neo-card p-4 text-sm text-gray-600">No rewards created yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Megaphone className="mr-2 h-4 w-4" /> Manage Rewards
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" /> View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </AnimatedContainer>
  )
}
