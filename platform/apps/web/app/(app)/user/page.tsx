"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations"
import { AnimatedContainer } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Zap, Trophy, Gift, ArrowRight, TrendingUp } from "lucide-react"

interface MatchItem {
  _id: string
  teamA: { name: string; shortName: string }
  teamB: { name: string; shortName: string }
  startTime: string
  status: string
}

interface QuizItem {
  _id: string
  title: string
  questionCount: number
  rewardPoints: number
  status: string
}

interface RewardItem {
  _id: string
}

interface MeResponse {
  user: {
    points?: number
  }
}

const rewardTiers = [
  { name: "Bronze Fan", progress: 75, next: "Silver Star" },
  { name: "Silver Star", progress: 30, next: "Gold Champion" },
  { name: "Gold Champion", progress: 0, next: "Platinum Legend" },
]

export default function UserDashboard() {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError("")

      const results = await Promise.allSettled([
        apiRequest<MatchItem[]>("/api/public/matches"),
        apiRequest<QuizItem[]>("/api/public/quizzes"),
        apiRequest<RewardItem[]>("/api/rewards"),
        apiRequest<MeResponse>("/api/auth/me"),
      ])

      if (results[0].status === "fulfilled") {
        setMatches(results[0].value)
      }

      if (results[1].status === "fulfilled") {
        setQuizzes(results[1].value)
      }

      if (results[2].status === "fulfilled") {
        setRewards(results[2].value)
      }

      if (results[3].status === "fulfilled") {
        setPoints(results[3].value.user.points ?? 0)
      }

      const failures = results.filter((entry) => entry.status === "rejected")
      if (failures.length > 0) {
        setError("Some dashboard data could not be loaded.")
      }

      setLoading(false)
    }

    void loadDashboard()
  }, [])

  const quickStats = useMemo(
    () => [
      { label: "Points", value: points.toLocaleString(), icon: Zap, color: "primary" as const },
      { label: "Badges", value: rewards.length.toString(), icon: Trophy, color: "accent" as const },
      { label: "Rewards", value: rewards.length.toString(), icon: Gift, color: "secondary" as const },
      {
        label: "Streak",
        value: `${matches.filter((match) => match.status.toLowerCase() === "live").length} live`,
        icon: TrendingUp,
        color: "primary" as const,
      },
    ],
    [matches, points, rewards.length]
  )

  const upcomingMatches = useMemo(
    () =>
      matches.slice(0, 3).map((match) => ({
        teams: `${match.teamA.shortName} vs ${match.teamB.shortName}`,
        time: new Date(match.startTime).toLocaleString(),
        status: match.status.toLowerCase() === "live" ? "Live" : "Upcoming",
      })),
    [matches]
  )

  const activeQuizzes = useMemo(
    () =>
      quizzes.slice(0, 3).map((quiz) => ({
        title: quiz.title,
        questions: quiz.questionCount,
        reward: `${quiz.rewardPoints} pts`,
        status: quiz.status.toLowerCase() === "active" ? "Live" : "Starting Soon",
      })),
    [quizzes]
  )

  return (
    <AnimatedContainer className="space-y-8">
      {/* Header */}
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Dashboard</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              Welcome Back!
            </h1>
            <p className="text-gray-600 mt-1">Ready for some cricket action?</p>
          </div>
          <Button variant="primary" className="w-fit" asChild>
            <Link href="/user/matches">
              Play Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <StaggerItem key={stat.label}>
              <Card className={`neo-card-${stat.color} neo-card p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-display font-bold uppercase tracking-wide text-gray-600">
                    {stat.label}
                  </span>
                  <Icon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="font-display text-3xl font-bold">
                  {stat.value}
                </div>
              </Card>
            </StaggerItem>
          )
        })}
      </StaggerChildren>

      {error && (
        <Card className="neo-card border-red-500">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Matches */}
        <Card className="neo-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Matches</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/user/matches">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(loading ? [] : upcomingMatches).map((match, index) => (
                <SlideUp key={match.teams} delay={index * 0.1}>
                  <div className="neo-card p-4 flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-lg">{match.teams}</p>
                      <p className="text-sm text-gray-600">{match.time}</p>
                    </div>
                    <Badge
                      variant={match.status === "Live" ? "primary" : "outline"}
                      className={match.status === "Live" ? "animate-pulse" : ""}
                    >
                      {match.status}
                    </Badge>
                  </div>
                </SlideUp>
              ))}
              {!loading && upcomingMatches.length === 0 && (
                <div className="neo-card p-4 text-sm text-gray-600">No matches available yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reward Tiers */}
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Reward Tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {rewardTiers.map((tier, index) => (
              <SlideUp key={tier.name} delay={index * 0.1}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-sm">{tier.name}</span>
                    <span className="text-xs text-gray-500">{tier.progress}%</span>
                  </div>
                  <Progress value={tier.progress} />
                  <p className="text-xs text-gray-500 mt-1">Next: {tier.next}</p>
                </div>
              </SlideUp>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Quizzes */}
      <Card className="neo-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Quizzes</CardTitle>
            <Button variant="primary" size="sm" asChild>
              <Link href="/user/quizzes">Join Quiz</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {(loading ? [] : activeQuizzes).map((quiz, index) => (
              <SlideUp key={quiz.title} delay={index * 0.1}>
                <div className="neo-card p-5 h-full flex flex-col">
                  <Badge
                    variant={quiz.status === "Live" ? "primary" : "accent"}
                    className="w-fit mb-3"
                  >
                    {quiz.status}
                  </Badge>
                  <h3 className="font-display font-bold text-lg mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {quiz.questions} Questions
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{quiz.reward}</Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/user/quizzes">Play</Link>
                    </Button>
                  </div>
                </div>
              </SlideUp>
            ))}
            {!loading && activeQuizzes.length === 0 && (
              <div className="neo-card p-5 md:col-span-3 text-gray-600">
                No quizzes are currently available.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
