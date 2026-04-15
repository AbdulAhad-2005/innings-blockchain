"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations"
import { AnimatedContainer } from "@/components/animations"
import { LayoutDashboard, Users, Building2, Megaphone, Settings, ArrowRight } from "lucide-react"

const stats = [
  { label: "Total Users", value: "50K+", icon: Users, color: "accent" as const },
  { label: "Active Brands", value: "24", icon: Building2, color: "secondary" as const },
  { label: "Campaigns", value: "156", icon: Megaphone, color: "primary" as const },
  { label: "Platform Health", value: "99.9%", icon: LayoutDashboard, color: "accent" as const },
]

const recentActivity = [
  { type: "user", message: "New user registered: john@example.com", time: "2 mins ago" },
  { type: "brand", message: "Brand 'Nike' created new campaign", time: "15 mins ago" },
  { type: "campaign", message: "Campaign 'PAK vs AUS' reached 1000 participants", time: "1 hour ago" },
  { type: "system", message: "Weekly report generated", time: "2 hours ago" },
]

const systemMetrics = [
  { name: "API Response", value: "45ms", status: "healthy" },
  { name: "Database", value: "99.9%", status: "healthy" },
  { name: "Cache Hit Rate", value: "94%", status: "healthy" },
  { name: "Error Rate", value: "0.1%", status: "healthy" },
]

export default function AdminDashboard() {
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
          <Button variant="outline" className="w-fit">
            <Settings className="mr-2 h-4 w-4" /> Settings
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
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <Users className="w-6 h-6" />
            <span className="text-xs font-bold uppercase">Manage Users</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <Building2 className="w-6 h-6" />
            <span className="text-xs font-bold uppercase">Manage Brands</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <Megaphone className="w-6 h-6" />
            <span className="text-xs font-bold uppercase">Campaigns</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <Settings className="w-6 h-6" />
            <span className="text-xs font-bold uppercase">Settings</span>
          </Button>
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
