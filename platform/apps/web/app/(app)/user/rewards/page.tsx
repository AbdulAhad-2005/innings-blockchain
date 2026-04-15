"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import { Gift } from "lucide-react"

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="primary" className="mb-2">Rewards</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Your Rewards
        </h1>
        <p className="text-gray-600 mt-2">
          Collect and claim your blockchain-verified rewards
        </p>
      </FadeIn>

      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" /> Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="neo-card p-8 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="font-display text-xl font-bold mb-2">Reward System</h3>
            <p className="text-gray-600">
              NFT badges, tokens, and exclusive prizes await.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
