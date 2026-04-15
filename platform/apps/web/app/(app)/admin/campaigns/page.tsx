"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Megaphone, MoreVertical, Plus } from "lucide-react"

interface CampaignItem {
  _id: string
  title?: string
  status: string
  rewardCount?: number
  budget?: number
  brandId?: {
    name?: string
    email?: string
  }
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true)
        const data = await apiRequest<CampaignItem[]>("/api/admin/campaigns")
        setCampaigns(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaigns.")
      } finally {
        setLoading(false)
      }
    }

    void loadCampaigns()
  }, [])

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="accent" className="mb-2 text-black">Campaigns</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              All Campaigns
            </h1>
          </div>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
      </FadeIn>

      {error && (
        <Card className="neo-card border-red-500">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      <SlideUp delay={0.1}>
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" /> Campaign Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Brand</th>
                    <th>Status</th>
                    <th>Participants</th>
                    <th>Revenue</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign._id}>
                      <td className="font-display font-bold">{campaign.title || "Campaign"}</td>
                      <td>{campaign.brandId?.name || "Brand"}</td>
                      <td>
                        <Badge
                          variant={
                            campaign.status.toLowerCase() === "active"
                              ? "primary"
                              : campaign.status.toLowerCase() === "draft"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                      <td>{(campaign.rewardCount ?? 0).toLocaleString()}</td>
                      <td>${(campaign.budget ?? 0).toLocaleString()}</td>
                      <td>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {loading && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500">
                        Loading campaigns...
                      </td>
                    </tr>
                  )}
                  {!loading && campaigns.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500">
                        No campaigns found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
