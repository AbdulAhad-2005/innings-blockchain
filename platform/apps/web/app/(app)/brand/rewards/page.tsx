"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Gift, Plus } from "lucide-react"

interface RewardItem {
  _id: string
  rewardType?: string
  points: number
  description?: string
  expirationDate: string
}

export default function BrandRewardsPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)

  const loadRewards = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiRequest<RewardItem[]>("/api/rewards", { params: { mine: true } })
      setRewards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rewards.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRewards()
  }, [loadRewards])

  const handleAddReward = async () => {
    const pointsInput = window.prompt("Reward points required", "100")
    const description = window.prompt("Reward description", "Matchday bonus reward")
    const expirationInput = window.prompt(
      "Expiration date-time (ISO)",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    )

    if (!pointsInput || !expirationInput) {
      return
    }

    const points = Number(pointsInput)

    if (!Number.isFinite(points) || points <= 0) {
      setError("points must be a positive number.")
      return
    }

    try {
      setCreating(true)
      setError("")

      await apiRequest("/api/rewards", {
        method: "POST",
        body: JSON.stringify({
          points,
          startDate: new Date().toISOString(),
          expirationDate: expirationInput,
          description: description?.trim() || undefined,
        }),
      })

      await loadRewards()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reward.")
    } finally {
      setCreating(false)
    }
  }

  const rewardCards = useMemo(
    () =>
      rewards.map((reward) => {
        const claims = Math.floor(reward.points * 0.6)
        const remaining = Math.max(0, reward.points - claims)

        return {
          id: reward._id,
          name: reward.description || `Reward ${reward._id.slice(-4)}`,
          type: reward.rewardType || "Points",
          claims,
          remaining,
          status: new Date(reward.expirationDate) > new Date() ? "Active" : "Expired",
        }
      }),
    [rewards]
  )

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
          <Button variant="secondary" onClick={handleAddReward} disabled={creating}>
            <Plus className="mr-2 h-4 w-4" /> {creating ? "Creating..." : "Add Reward"}
          </Button>
        </div>
      </FadeIn>

      <SlideUp delay={0.1}>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          {rewardCards.map((reward, index) => (
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
                    <Badge variant={reward.status === "Active" ? "secondary" : "outline"}>
                      {reward.status === "Active" ? "Live" : "Closed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
          {!loading && rewardCards.length === 0 && (
            <Card className="neo-card md:col-span-2">
              <CardContent className="pt-6 text-gray-600">No rewards created yet.</CardContent>
            </Card>
          )}
          {loading && (
            <Card className="neo-card md:col-span-2">
              <CardContent className="pt-6 text-gray-600">Loading rewards...</CardContent>
            </Card>
          )}
        </div>
      </SlideUp>
    </div>
  )
}
