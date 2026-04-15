"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Gift, Coins, CheckCircle2, CircleAlert } from "lucide-react"

interface RewardItem {
  _id: string
  points: number
  description?: string
  expirationDate: string
}

interface RedemptionItem {
  _id: string
  rewardId: string
  pointsSpent: number
  nftTokenId?: string
  nftTxHash?: string
  nftContractAddress?: string
  redeemedAt: string
  reward?: {
    _id: string
    points: number
    description?: string
    expirationDate?: string
    imageUrl?: string
  } | null
}

interface RedeemResponse {
  message?: string
  remainingPoints: number
  nft: {
    txHash: string
    tokenId: string
    contractAddress: string
  } | null
}

interface MeResponse {
  user: {
    points?: number
  }
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [lastNft, setLastNft] = useState<RedeemResponse["nft"] | null>(null)
  const [redeemingId, setRedeemingId] = useState<string | null>(null)

  const loadRewardsData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true)
      }

      setError("")

      const [rewardsResult, redemptionsResult, meResult] = await Promise.allSettled([
        apiRequest<RewardItem[]>("/api/rewards"),
        apiRequest<RedemptionItem[]>("/api/customer/rewards/redemptions"),
        apiRequest<MeResponse>("/api/auth/me"),
      ])

      if (rewardsResult.status === "fulfilled") {
        setRewards(rewardsResult.value)
      }

      if (redemptionsResult.status === "fulfilled") {
        setRedemptions(redemptionsResult.value)
      }

      if (meResult.status === "fulfilled") {
        setPoints(meResult.value.user.points ?? 0)
      }

      if (
        rewardsResult.status === "rejected" ||
        redemptionsResult.status === "rejected" ||
        meResult.status === "rejected"
      ) {
        setError("Some reward data could not be loaded.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rewards.")
    } finally {
      if (showLoader) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    void loadRewardsData()
  }, [])

  const handleRedeem = async (rewardId: string) => {
    try {
      setRedeemingId(rewardId)
      setError("")
      setNotice("")

      const redemptionResult = await apiRequest<RedeemResponse>(
        `/api/customer/rewards/${rewardId}/redeem`,
        {
        method: "POST",
        }
      )

      setNotice(
        redemptionResult.message ||
          (redemptionResult.nft
            ? "Reward redeemed and NFT minted successfully."
            : "Reward redeemed successfully.")
      )
      setLastNft(redemptionResult.nft)
      setPoints(redemptionResult.remainingPoints)

      await loadRewardsData(false)
    } catch (err) {
      setLastNft(null)
      setError(err instanceof Error ? err.message : "Failed to redeem reward.")
    } finally {
      setRedeemingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="primary" className="mb-2">Rewards</Badge>
          <Badge variant="accent" className="text-black flex items-center gap-1">
            <Coins className="w-3 h-3" /> {points} points
          </Badge>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Your Rewards
        </h1>
        <p className="text-gray-600 mt-2">
          Collect and claim your blockchain-verified rewards
        </p>
      </FadeIn>

      {notice && (
        <Card className="neo-card border-[#00b852]">
          <CardContent className="pt-6 space-y-2">
            <p className="text-[#016d32] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {notice}
            </p>
            {lastNft?.txHash && (
              <p className="text-xs text-gray-700 break-all">
                NFT TX: {lastNft.txHash} · Token ID: {lastNft.tokenId}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" /> Available Rewards
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
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="primary">Active</Badge>

                    {points < reward.points && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <CircleAlert className="w-3 h-3" /> Need {reward.points - points} more points
                      </p>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRedeem(reward._id)}
                      disabled={redeemingId === reward._id || points < reward.points}
                    >
                      {redeemingId === reward._id ? "Redeeming..." : "Redeem"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Redeemed Rewards & NFTs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {redemptions.length === 0 ? (
            <div className="neo-card p-8 text-center text-gray-600">
              You have not redeemed any rewards yet.
            </div>
          ) : (
            <div className="space-y-4">
              {redemptions.map((redemption) => (
                <div key={redemption._id} className="neo-card p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display font-bold text-lg">
                      {redemption.reward?.description || "Reward Redemption"}
                    </p>
                    <Badge variant={redemption.nftTxHash ? "accent" : "outline"} className="text-black">
                      {redemption.nftTxHash ? "NFT Minted" : "Recorded"}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600">
                    Spent: {redemption.pointsSpent} points · Redeemed on {new Date(redemption.redeemedAt).toLocaleString()}
                  </p>

                  {redemption.nftTokenId && (
                    <p className="text-xs text-gray-700 break-all">Token ID: {redemption.nftTokenId}</p>
                  )}

                  {redemption.nftTxHash && (
                    <p className="text-xs text-gray-700 break-all">TX Hash: {redemption.nftTxHash}</p>
                  )}

                  {redemption.nftContractAddress && (
                    <p className="text-xs text-gray-700 break-all">
                      Contract: {redemption.nftContractAddress}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
