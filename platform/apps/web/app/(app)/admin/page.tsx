"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations"
import { AnimatedContainer } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { LayoutDashboard, Users, Building2, Megaphone, Settings, Gamepad2, Flag } from "lucide-react"

interface CustomerItem {
  _id: string
  email: string
  createdAt: string
}

interface BrandItem {
  _id: string
  name: string
  verificationStatus?: string
}

interface CampaignItem {
  _id: string
  status: string
  title?: string
  createdAt: string
}

const systemMetrics = [
  { name: "API Response", value: "45ms", status: "healthy" },
  { name: "Database", value: "99.9%", status: "healthy" },
  { name: "Cache Hit Rate", value: "94%", status: "healthy" },
  { name: "Error Rate", value: "0.1%", status: "healthy" },
]

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<CustomerItem[]>([])
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const results = await Promise.allSettled([
        apiRequest<CustomerItem[]>("/api/admin/customers"),
        apiRequest<BrandItem[]>("/api/admin/brands"),
        apiRequest<CampaignItem[]>("/api/admin/campaigns"),
      ])

      if (results[0].status === "fulfilled") {
        setCustomers(results[0].value)
      }

      if (results[1].status === "fulfilled") {
        setBrands(results[1].value)
      }

      if (results[2].status === "fulfilled") {
        setCampaigns(results[2].value)
      }

      if (results.some((result) => result.status === "rejected")) {
        setError("Some admin dashboard data could not be loaded.")
      }
    }

    void loadData()
  }, [])

  const stats = useMemo(() => {
    const activeBrands = brands.filter((brand) => brand.verificationStatus !== "revoked").length
    const activeCampaigns = campaigns.filter((campaign) => campaign.status.toLowerCase() === "active").length
    const health = campaigns.length === 0 ? 100 : Math.max(70, 100 - campaigns.length / 10)

    return [
      {
        label: "Total Users",
        value: customers.length.toLocaleString(),
        icon: Users,
        color: "accent" as const,
      },
      {
        label: "Active Brands",
        value: activeBrands.toString(),
        icon: Building2,
        color: "secondary" as const,
      },
      {
        label: "Campaigns",
        value: campaigns.length.toLocaleString(),
        icon: Megaphone,
        color: "primary" as const,
      },
      {
        label: "Platform Health",
        value: `${health.toFixed(1)}%`,
        icon: LayoutDashboard,
        color: "accent" as const,
      },
    ]
  }, [brands, campaigns, customers.length])

  const recentActivity = useMemo(() => {
    const latestUser = customers[0]
    const latestBrand = brands[0]
    const latestCampaign = campaigns[0]

    return [
      latestUser
        ? {
            type: "user" as const,
            message: `New user registered: ${latestUser.email}`,
            time: new Date(latestUser.createdAt).toLocaleString(),
          }
        : null,
      latestBrand
        ? {
            type: "brand" as const,
            message: `Brand '${latestBrand.name}' updated profile`,
            time: "Recently",
          }
        : null,
      latestCampaign
        ? {
            type: "campaign" as const,
            message: `Campaign '${latestCampaign.title || "Campaign"}' status: ${latestCampaign.status}`,
            time: new Date(latestCampaign.createdAt).toLocaleString(),
          }
        : null,
      {
        type: "system" as const,
        message: "System checks completed",
        time: "Now",
      },
    ].filter(Boolean) as Array<{ type: "user" | "brand" | "campaign" | "system"; message: string; time: string }>
  }, [brands, campaigns, customers])

  return (
    <AnimatedContainer className="space-y-8">
      {/* Header */}
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="accent" className="mb-2 text-black">Admin Panel</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              Control Center
            </h1>
            <p className="text-gray-600 mt-1">Monitor and manage the platform</p>
          </div>
          <Button variant="outline" className="w-fit" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
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

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="neo-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <SlideUp key={index} delay={index * 0.1}>
                  <div className="neo-card p-4 flex items-start gap-4">
                    <div
                      className={`w-10 h-10 flex items-center justify-center border-[2px] border-black ${
                        activity.type === "user"
                          ? "bg-[#ffd700]"
                          : activity.type === "brand"
                          ? "bg-[#0066ff] text-white"
                          : activity.type === "campaign"
                          ? "bg-[#00b852] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {activity.type === "user" && <Users className="w-5 h-5" />}
                      {activity.type === "brand" && <Building2 className="w-5 h-5" />}
                      {activity.type === "campaign" && <Megaphone className="w-5 h-5" />}
                      {activity.type === "system" && <Settings className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </SlideUp>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <SlideUp key={metric.name} delay={index * 0.1}>
                  <div className="flex items-center justify-between py-2 border-b-[2px] border-gray-100 last:border-0">
                    <span className="font-display font-bold text-sm">{metric.name}</span>
                    <Badge variant="primary" className="text-xs">{metric.value}</Badge>
                  </div>
                </SlideUp>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="neo-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" asChild>
            <Link href="/admin/users">
              <Users className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Users</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" asChild>
            <Link href="/admin/brands">
              <Building2 className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Brands</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" asChild>
            <Link href="/admin/teams">
              <Flag className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Teams</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" asChild>
            <Link href="/admin/matches">
              <Gamepad2 className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Matches</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" asChild>
            <Link href="/admin/campaigns">
              <Megaphone className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Campaigns</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" asChild>
            <Link href="/admin/settings">
              <Settings className="w-6 h-6" />
              <span className="text-xs font-bold uppercase">Settings</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
