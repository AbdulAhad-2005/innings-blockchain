"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Megaphone, Plus, CircleHelp } from "lucide-react"

interface CampaignItem {
  _id: string
  title?: string
  status: string
  rewardCount?: number
}

interface MatchItem {
  _id: string
}

export default function BrandCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await apiRequest<CampaignItem[]>("/api/brands/campaigns")
      setCampaigns(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCampaigns()
  }, [])

  const handleCreateCampaign = async () => {
    try {
      setCreating(true)

      const matches = await apiRequest<MatchItem[]>("/api/public/matches")
      const selectedMatch = matches[0]

      if (!selectedMatch) {
        throw new Error("No matches available to create a campaign.")
      }

      const start = new Date()
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)

      await apiRequest("/api/brands/campaigns", {
        method: "POST",
        body: JSON.stringify({
          matchId: selectedMatch._id,
          budget: 1000,
          rewardCount: 100,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          metadata: { title: `Campaign ${start.toLocaleDateString()}` },
        }),
      })

      await loadCampaigns()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign.")
    } finally {
      setCreating(false)
    }
  }

  const handleAddQuestion = async (campaignId: string) => {
    const questionText = window.prompt("Question text")?.trim()
    const correctAnswer = window.prompt("Correct answer")?.trim()
    const optionsRaw = window.prompt(
      "Options (comma separated, include correct answer)",
      correctAnswer || ""
    )

    if (!questionText || !correctAnswer) {
      return
    }

    const options = (optionsRaw || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)

    try {
      setError("")
      await apiRequest(`/api/brands/quizzes/${campaignId}/questions`, {
        method: "POST",
        body: JSON.stringify({
          questionText,
          correctAnswer,
          options,
        }),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create question.")
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">Campaigns</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              Your Campaigns
            </h1>
          </div>
          <Button variant="secondary" onClick={handleCreateCampaign} disabled={creating}>
            <Plus className="mr-2 h-4 w-4" /> {creating ? "Creating..." : "New Campaign"}
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
              <Megaphone className="w-5 h-5" /> All Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Participants</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign._id}>
                      <td className="font-display font-bold">{campaign.title || "Campaign"}</td>
                      <td>Quiz</td>
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
                      <td>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddQuestion(campaign._id)}
                        >
                          <CircleHelp className="mr-1 h-3 w-3" /> Add Question
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {!loading && campaigns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500">
                        No campaigns found.
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500">
                        Loading campaigns...
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
