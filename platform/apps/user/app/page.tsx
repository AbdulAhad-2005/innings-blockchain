import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Sparkles, Trophy, Zap } from "lucide-react";

const highlights = [
  {
    title: "Live Match Pulse",
    description: "Jump into active moments with one tap.",
    icon: Zap,
  },
  {
    title: "Reward Ladder",
    description: "Track tiers, streaks, and instant claim states.",
    icon: Trophy,
  },
  {
    title: "Cinematic Motion",
    description: "Fast transitions with playful depth.",
    icon: Sparkles,
  },
];

const quickFlows = [
  "Login",
  "Pick a match",
  "Play quiz",
  "Unlock rewards",
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="spotlight absolute inset-x-0 top-0 h-[36rem]" />
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-10 lg:px-12">
        <header className="glass-panel neo-panel mb-10 flex items-center justify-between px-5 py-4">
          <div>
            <Badge variant="secondary" className="font-display text-xs uppercase tracking-[0.42em]">
              Innings Blockchain
            </Badge>
            <p className="mt-1 text-sm text-white/68">Fan-first gameplay</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/72 md:flex interactive-smooth">
            <HoverCard>
              <HoverCardTrigger asChild>
                <a href="#product">Product</a>
              </HoverCardTrigger>
              <HoverCardContent>Core fan journey and signature look.</HoverCardContent>
            </HoverCard>
            <a href="#flows">Flow</a>
            <a href="#build">Build</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link className="text-sm text-white/72 transition hover:text-white" href="/login">
              Login
            </Link>
            <Link href="/signup">
              <Button className="neo-button">Join Beta</Button>
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <Badge className="mb-5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[var(--color-lime)]">
              Built for fans
            </Badge>
            <h1 className="max-w-4xl font-display text-5xl uppercase tracking-[0.06em] text-white sm:text-6xl lg:text-7xl">
              Matchday rewards, with bite.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">
              Live matches, fast quizzes, and unlockable rewards in one polished loop.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/app">
                <Button className="neo-button">Open User Hub</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="neo-outline">
                  Explore Auth
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="metric-card neo-tile tilt-card">
                <span className="metric-label">Launch Focus</span>
                <strong className="metric-value">User App</strong>
              </div>
              <div className="metric-card neo-tile tilt-card">
                <span className="metric-label">Auth Mode</span>
                <strong className="metric-value">Email + Password</strong>
              </div>
              <div className="metric-card neo-tile tilt-card">
                <span className="metric-label">Wallet UI</span>
                <strong className="metric-value">Not Included</strong>
              </div>
            </div>
          </div>

          <div className="relative perspective-zone">
            <div className="pitch-grid absolute inset-0 rounded-[2rem] opacity-45" />
            <Card className="glass-panel neo-panel neo-hero relative overflow-hidden rounded-[2rem] border-white/10 bg-white/5 p-6 shadow-[0_40px_140px_rgba(8,16,15,0.55)]">
              <CardHeader>
                <Badge variant="outline">Tonight&apos;s headliner</Badge>
                <CardTitle className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                  Pakistan vs Australia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel opts={{ loop: true }} className="mx-8">
                  <CarouselContent>
                    <CarouselItem>
                      <Card className="feature-card neo-tile tilt-card">
                        <CardHeader>
                          <Badge>Live quiz</Badge>
                          <CardTitle className="text-3xl font-semibold text-white">08:42</CardTitle>
                          <CardDescription className="text-white/68">
                            Countdown running. Round starts now.
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </CarouselItem>
                    <CarouselItem>
                      <Card className="feature-card neo-tile tilt-card">
                        <CardHeader>
                          <Badge>Rewards</Badge>
                          <CardTitle className="text-3xl font-semibold text-white">12</CardTitle>
                          <CardDescription className="text-white/68">
                            Fresh unlocks waiting to claim.
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="neo-outline" />
                  <CarouselNext className="neo-outline" />
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </section>
      </section>

      <section id="product" className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-12">
        <div className="section-shell neo-panel">
          <div className="max-w-xl">
            <p className="section-kicker">Product Direction</p>
            <h2 className="section-title">Sport-first participation.</h2>
            <p className="section-copy">Fast, emotional, and crystal clear.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {highlights.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={pillar.title}
                  className="feature-card neo-tile tilt-card border-white/10 bg-white/5"
                >
                <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-[var(--color-gold-soft)]" />
                      <Badge variant="secondary">{pillar.title}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-7 text-white/74">{pillar.description}</p>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="flows" className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-shell neo-panel">
            <p className="section-kicker">User Scope</p>
            <h2 className="section-title">Four-step fan flow.</h2>
            <p className="section-copy">Simple to start, hard to leave.</p>
          </div>
          <Card className="glass-panel neo-panel rounded-[2rem] border-white/10 bg-white/5 p-6">
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {quickFlows.map((flow, index) => (
                  <div key={flow} className="step-card neo-tile tilt-card">
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
        <Card className="glass-panel neo-panel grid gap-6 rounded-[2rem] border-white/10 bg-white/5 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <CardHeader>
            <Badge variant="secondary">Build Decision</Badge>
            <CardTitle className="section-title">User app first. Everything else follows.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="section-copy">Ready to test the polished journey now.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/app">
                <Button className="neo-button">Open User App</Button>
              </Link>
              <Link href="/matches">
                <Button variant="outline" className="neo-outline">
                  Review Match Flow
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
