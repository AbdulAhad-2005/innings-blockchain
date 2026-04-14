import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const rewardCards = [
  { title: "Silver Tier", progress: 76, max: 100, eta: "Unlock this week" },
  { title: "Gold Tier", progress: 148, max: 250, eta: "Need 102 points" },
  { title: "Match MVP Bonus", progress: 40, max: 100, eta: "Ends tonight" },
];

export default function RewardsPage() {
  return (
    <main className="grid gap-6">
      <Card className="glass-panel fade-rise rounded-[2rem] border-white/10 bg-white/5 p-7">
        <CardHeader>
          <Badge variant="secondary">Rewards</Badge>
          <CardTitle className="section-title">Clean reward progression</CardTitle>
          <p className="section-copy">
            Monitor progress and claim eligibility through match participation.
          </p>
        </CardHeader>
      </Card>
      <section className="grid gap-4 sm:grid-cols-3">
        {rewardCards.map((reward) => (
          <Card
            key={reward.title}
            className="shell-card border-white/10 bg-white/5"
          >
            <CardHeader>
              <Badge variant="outline">{reward.title}</Badge>
              <CardTitle className="mt-4 text-2xl font-semibold text-white">
                {reward.progress} / {reward.max}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(reward.progress / reward.max) * 100} className="mt-2" />
              <p className="mt-3 text-sm text-white/70">{reward.eta}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card className="shell-card fade-rise delay-3 border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">Recent Activity</Badge>
          <CardTitle className="mt-2 font-display text-3xl uppercase tracking-[0.05em] text-white">
            Recent Reward Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-5 grid gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              Quiz Sprint - 35 points credited
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              Campaign Completion - Bonus unlocked
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              Weekly Streak - 14 points credited
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
