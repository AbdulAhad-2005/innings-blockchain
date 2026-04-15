"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import { BarChart3, TrendingUp, Users, Target } from "lucide-react"

const metrics = [
  { label: "Total Engagement", value: "78%", icon: TrendingUp, change: "+12%" },
  { label: "Active Users", value: "12.5K", icon: Users, change: "+8%" },
  { label: "Conversion Rate", value: "15.4%", icon: Target, change: "+3%" },
]

export default function BrandAnalyticsPage() {
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
                Integrate with Recharts or similar library for interactive charts.
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
