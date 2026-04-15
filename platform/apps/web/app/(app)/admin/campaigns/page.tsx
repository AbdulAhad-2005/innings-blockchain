"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { Megaphone, MoreVertical, Plus } from "lucide-react"

const campaigns = [
  { name: "PAK vs AUS Special", brand: "Nike", status: "Active", participants: 2340, revenue: "$12.5K" },
  { name: "World Cup Predictions", brand: "Pepsi", status: "Draft", participants: 0, revenue: "$0" },
  { name: "Batting Bonanza", brand: "Samsung", status: "Completed", participants: 5600, revenue: "$8.2K" },
  { name: "Bowling Masterclass", brand: "Nike", status: "Active", participants: 1200, revenue: "$3.8K" },
]

export default function AdminCampaignsPage() {
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
                    <tr key={campaign.name}>
                      <td className="font-display font-bold">{campaign.name}</td>
                      <td>{campaign.brand}</td>
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
                      <td>{campaign.revenue}</td>
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
