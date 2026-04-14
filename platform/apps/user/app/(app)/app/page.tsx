import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const quickStats = [
  { label: "Active campaigns", value: "08" },
  { label: "Live quizzes", value: "03" },
  { label: "Rewards pending", value: "14" },
];

const fixtures = [
  { teams: "Pakistan vs Australia", status: "Live now", slot: "22:30 PKT" },
  { teams: "India vs England", status: "Upcoming", slot: "Tomorrow, 18:00" },
  { teams: "NZ vs South Africa", status: "Upcoming", slot: "Fri, 20:30" },
];

export default function UserHubPage() {
  return (
    <main className="grid gap-6">
      <Card className="glass-panel neo-panel fade-rise shimmer-surface rounded-[2rem] border-white/10 bg-white/5 p-7">
        <CardHeader>
          <Badge variant="secondary">Control Center</Badge>
          <CardTitle className="section-title">Your matchday hub</CardTitle>
          <p className="section-copy">
            Discover fixtures, jump into quizzes, and track reward progress.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {quickStats.map((item) => (
              <article key={item.label} className="metric-card neo-tile tilt-card fade-rise">
                <span className="metric-label">{item.label}</span>
                <strong className="metric-value text-2xl">{item.value}</strong>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="shell-card neo-panel fade-rise delay-1 border-white/10 bg-white/5">
          <CardHeader>
            <Badge variant="outline">Marquee Fixtures</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {fixtures.map((match) => (
                <div
                  key={match.teams}
                  className="neo-tile tilt-card rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <p className="font-display text-2xl uppercase tracking-[0.04em] text-white">
                    {match.teams}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <Badge variant="secondary">{match.status}</Badge>
                    <span className="text-white/70">{match.slot}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shell-card neo-panel fade-rise delay-2 border-white/10 bg-white/5">
          <CardHeader>
            <Badge variant="secondary">Next Step</Badge>
            <CardTitle className="mt-3 font-display text-3xl uppercase tracking-[0.07em] text-white">
              Start Quiz Sprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-white/74">
              Push users from fixture context into active quiz rounds with urgency.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                Round 1 opens in 06:12
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                75 points until next reward tier
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                Last session accuracy: 84%
              </div>
            </div>
            <Button className="neo-button mt-4 w-full">Join Quiz</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
