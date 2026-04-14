import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pillars = [
  {
    title: "Matchday Missions",
    description:
      "Guide users from marquee fixtures into curated prediction and quiz journeys with a strong sports-broadcast feel.",
  },
  {
    title: "Reward Moments",
    description:
      "Turn participation into a premium reward loop with milestone unlocks, streak nudges, and claim-ready summaries.",
  },
  {
    title: "Premium Motion",
    description:
      "Use layered gradients, sharp typography, card depth, and measured animation instead of generic web3 tropes.",
  },
];

const flows = [
  "Landing and conversion",
  "Email/password auth",
  "Personalized match hub",
  "Quiz gameplay and results",
  "Rewards progression experience",
  "Profile, activity, and settings",
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="spotlight absolute inset-x-0 top-0 h-[36rem]" />
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-10 lg:px-12">
        <header className="glass-panel mb-10 flex items-center justify-between px-5 py-4">
          <div>
            <Badge variant="secondary" className="font-display text-xs uppercase tracking-[0.42em]">
              Innings Blockchain
            </Badge>
            <p className="mt-1 text-sm text-white/68">
              Sporty, energetic, premium user app
            </p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/72 md:flex">
            <a href="#product">Product</a>
            <a href="#flows">Flows</a>
            <a href="#build">Build Scope</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link className="text-sm text-white/72 transition hover:text-white" href="/login">
              Login
            </Link>
            <Link href="/signup">
              <Button>Join Beta</Button>
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[var(--color-lime)]">
              Built for fans, not dashboards
            </p>
            <h1 className="max-w-4xl font-display text-5xl uppercase tracking-[0.06em] text-white sm:text-6xl lg:text-7xl">
              Matchday rewards with a broadcast-grade interface.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              The user experience should feel like a premium sports companion:
              live energy, collectible momentum, and polished progression from
              matches to quizzes to rewards.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/app">
                <Button>View User Hub</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Explore Auth Flow</Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <span className="metric-label">Launch Focus</span>
                <strong className="metric-value">User App</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Auth Mode</span>
                <strong className="metric-value">Email + Password</strong>
              </div>
              <div className="metric-card">
                <span className="metric-label">Wallet UI</span>
                <strong className="metric-value">Not Included</strong>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pitch-grid absolute inset-0 rounded-[2rem] opacity-45" />
            <Card className="glass-panel relative overflow-hidden rounded-[2rem] border-white/10 bg-white/5 p-6 shadow-[0_40px_140px_rgba(8,16,15,0.55)]">
              <CardHeader>
                <Badge variant="outline">Tonight&apos;s headliner</Badge>
                <CardTitle className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                  Pakistan vs Australia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="feature-card sm:col-span-2">
                    <CardHeader>
                      <Badge>Live quiz</Badge>
                      <CardTitle className="text-3xl font-semibold text-white">08:42</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/68">
                        Time-boxed quiz modules with clear urgency.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="feature-card">
                    <CardHeader>
                      <Badge>Rewards unlocked</Badge>
                      <CardTitle className="text-3xl font-semibold text-white">12</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/68">
                        Clear statuses and match-linked outcomes.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </section>

      <section id="product" className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-12">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="section-kicker">Product Direction</p>
            <h2 className="section-title">
              The experience centers on sport-first participation.
            </h2>
            <p className="section-copy">
              Keep technical complexity away from user flows. The frontend
              should feel closer to a premium sports media product than a
              generic dashboard.
            </p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="feature-card border-white/10 bg-white/5">
                <CardHeader>
                  <Badge variant="secondary">{pillar.title}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-white/74">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="flows" className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-shell">
            <p className="section-kicker">User Scope</p>
            <h2 className="section-title">What the frontend needs to deliver.</h2>
            <p className="section-copy">
              The user app is not a thin shell. It is the core product surface
              and needs a fully branded journey from conversion to repeat usage.
            </p>
          </div>
          <Card className="glass-panel rounded-[2rem] border-white/10 bg-white/5 p-6">
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {flows.map((flow, index) => (
                  <div key={flow} className="step-card">
                    <span className="step-count">0{index + 1}</span>
                    <p className="mt-4 text-lg font-medium text-white">{flow}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="build" className="mx-auto w-full max-w-7xl px-6 py-8 pb-20 sm:px-10 lg:px-12">
        <Card className="glass-panel grid gap-6 rounded-[2rem] border-white/10 bg-white/5 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <CardHeader>
            <Badge variant="secondary">Build Decision</Badge>
            <CardTitle className="section-title">We start with the user app and scale into the full monorepo.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="section-copy">
              The next implementation pass should initialize shadcn in the new
              workspace, bring in premium auth and dashboard blocks, and replace
              these handcrafted placeholders with production components.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/app">
                <Button>Open App Skeleton</Button>
              </Link>
              <Link href="/matches">
                <Button variant="outline">Review Match Flow</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
