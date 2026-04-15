"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { getStoredUser } from "@/lib/auth"
import { Megaphone, Plus, MoreVertical } from "lucide-react"

const campaigns = [
  { name: "PAK vs AUS Special", status: "Active", participants: 2340, type: "Quiz" },
  { name: "World Cup Predictions", status: "Draft", participants: 0, type: "Prediction" },
  { name: "Batting Bonanza", status: "Completed", participants: 5600, type: "Quiz" },
  { name: "Bowling Masterclass", status: "Active", participants: 1200, type: "Quiz" },
]

export default function BrandCampaignsPage() {
  const user = getStoredUser()

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
          <Button variant="secondary">
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>
      </FadeIn>

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
                    <tr key={campaign.name}>
                      <td className="font-display font-bold">{campaign.name}</td>
                      <td>{campaign.type}</td>
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
                      <td>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
