"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Megaphone, Play, CheckCircle2, Flag } from "lucide-react"

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
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiRequest<CampaignItem[]>("/api/admin/campaigns")
      setCampaigns(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCampaigns()
  }, [loadCampaigns])

  const updateCampaignStatus = async (
    campaignId: string,
    status: "active" | "completed"
  ) => {
    try {
      setUpdatingId(campaignId)
      setError("")

      await apiRequest(`/api/admin/campaigns/${campaignId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })

      await loadCampaigns()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update campaign status.")
    } finally {
      setUpdatingId(null)
    }
  }

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
          <Button variant="outline" asChild>
            <Link href="/admin/matches">
              <Flag className="mr-2 h-4 w-4" /> Set Up Match
            </Link>
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
                    <th>Actions</th>
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
                      <td className="flex gap-2">
                        {campaign.status.toLowerCase() !== "active" &&
                          campaign.status.toLowerCase() !== "completed" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateCampaignStatus(campaign._id, "active")}
                              disabled={updatingId === campaign._id}
                            >
                              <Play className="mr-1 h-3 w-3" /> Start
                            </Button>
                          )}

                        {campaign.status.toLowerCase() === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCampaignStatus(campaign._id, "completed")}
                            disabled={updatingId === campaign._id}
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Complete
                          </Button>
                        )}
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
