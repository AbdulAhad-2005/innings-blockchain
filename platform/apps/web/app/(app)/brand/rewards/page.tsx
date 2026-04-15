"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { Gift, Plus, MoreVertical } from "lucide-react"

const rewards = [
  { name: "NFT Badge #001", type: "NFT", claims: 1234, remaining: 766, status: "Active" },
  { name: "VIP Match Tickets", type: "Physical", claims: 89, remaining: 11, status: "Active" },
  { name: "Signed Merchandise", type: "Physical", claims: 234, remaining: 66, status: "Active" },
  { name: "Token Reward", type: "Token", claims: 5600, remaining: 400, status: "Active" },
]

export default function BrandRewardsPage() {
  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">Rewards</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              Reward Pool
            </h1>
          </div>
          <Button variant="secondary">
            <Plus className="mr-2 h-4 w-4" /> Add Reward
          </Button>
        </div>
      </FadeIn>

      <SlideUp delay={0.1}>
        <div className="grid md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <SlideUp key={reward.name} delay={index * 0.1}>
              <Card className="neo-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 border-[3px] border-black bg-[#ffd700] flex items-center justify-center">
                      <Gift className="w-6 h-6 text-black" />
                    </div>
                    <Badge variant={reward.status === "Active" ? "primary" : "outline"}>
                      {reward.status}
                    </Badge>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-1">{reward.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Type: {reward.type}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Claimed / Total</p>
                      <p className="font-display font-bold">{reward.claims} / {reward.claims + reward.remaining}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
        </div>
      </SlideUp>
    </div>
  )
}
