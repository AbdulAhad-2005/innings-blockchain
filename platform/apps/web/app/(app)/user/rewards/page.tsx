"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Gift } from "lucide-react"

interface RewardItem {
  _id: string
  points: number
  description?: string
  expirationDate: string
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true)
        const data = await apiRequest<RewardItem[]>("/api/rewards")
        setRewards(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rewards.")
      } finally {
        setLoading(false)
      }
    }

    void loadRewards()
  }, [])

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
          {loading && <div className="neo-card p-8 text-center text-gray-600">Loading rewards...</div>}

          {!loading && error && (
            <div className="neo-card p-8 text-center text-red-600">{error}</div>
          )}

          {!loading && !error && rewards.length === 0 && (
            <div className="neo-card p-8 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-bold mb-2">No Active Rewards</h3>
              <p className="text-gray-600">Check back later for new reward drops.</p>
            </div>
          )}

          {!loading && !error && rewards.length > 0 && (
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div key={reward._id} className="neo-card p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display font-bold text-lg">{reward.points} Points Reward</p>
                    <p className="text-sm text-gray-600">
                      {reward.description || "Redeem your points for this reward."}
                    </p>
                    <p className="text-xs text-gray-500">
                      Expires: {new Date(reward.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="primary">Active</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
