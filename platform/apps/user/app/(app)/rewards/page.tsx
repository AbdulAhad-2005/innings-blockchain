"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/api";

interface RewardItem {
  _id: string;
  points: number;
  description?: string;
  startDate: string;
  expirationDate: string;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchRewards = async () => {
      try {
        const response = await apiRequest<RewardItem[]>("/api/rewards");
        if (mounted) {
          setRewards(response);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "Failed to load rewards.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRewards();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="grid gap-6">
      <Card className="glass-panel neo-panel fade-rise shimmer-surface rounded-[2rem] border-white/10 bg-white/5 p-7">
        <CardHeader>
          <Badge variant="secondary">Rewards</Badge>
          <CardTitle className="section-title">Clean reward progression</CardTitle>
          <p className="section-copy">
            Monitor progress and claim eligibility through match participation.
          </p>
        </CardHeader>
      </Card>
        {loading ? <p className="text-sm text-white/70">Loading rewards...</p> : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <section className="grid gap-4 sm:grid-cols-3">
          {rewards.map((reward) => {
            const start = new Date(reward.startDate);
            const end = new Date(reward.expirationDate);
            const now = new Date();
            const isActive = now >= start && now <= end;

            return (
          <Card
              key={reward._id}
            className="shell-card neo-panel neo-tile tilt-card border-white/10 bg-white/5"
          >
            <CardHeader>
                <Badge variant="outline">Reward</Badge>
              <CardTitle className="mt-4 text-2xl font-semibold text-white">
                  {reward.points} points
              </CardTitle>
            </CardHeader>
            <CardContent>
                <Progress value={isActive ? 100 : 0} className="mt-2" />
                <p className="mt-3 text-sm text-white/70">
                  {reward.description || "No description available."}
                </p>
                <p className="mt-2 text-xs text-white/60">
                  Expires: {end.toLocaleDateString()}
                </p>
            </CardContent>
          </Card>
            );
          })}
          {!loading && rewards.length === 0 ? (
            <p className="text-sm text-white/70">No rewards are available right now.</p>
          ) : null}
      </section>
      <Card className="shell-card neo-panel fade-rise delay-3 border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">Recent Activity</Badge>
          <CardTitle className="mt-2 font-display text-3xl uppercase tracking-[0.05em] text-white">
            Recent Reward Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-5 grid gap-3">
            <div className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              Complete quizzes to earn points for reward redemption.
            </div>
            <div className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              Redeem active rewards when you have enough points.
            </div>
            <div className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              NFT minting is available for blockchain-enabled rewards.
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
