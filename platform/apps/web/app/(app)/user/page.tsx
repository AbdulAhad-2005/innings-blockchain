"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem } from "@/components/animations"
import { AnimatedContainer } from "@/components/animations"
import { Zap, Trophy, Gift, ArrowRight, TrendingUp } from "lucide-react"

const quickStats = [
  { label: "Points", value: "2,450", icon: Zap, color: "primary" as const },
  { label: "Badges", value: "12", icon: Trophy, color: "accent" as const },
  { label: "Rewards", value: "8", icon: Gift, color: "secondary" as const },
  { label: "Streak", value: "5 days", icon: TrendingUp, color: "primary" as const },
]

const upcomingMatches = [
  { teams: "PAK vs AUS", time: "Today, 7:00 PM", status: "Live" },
  { teams: "IND vs ENG", time: "Tomorrow, 3:00 PM", status: "Upcoming" },
  { teams: "SA vs NZ", time: "Mar 18, 5:30 PM", status: "Upcoming" },
]

const activeQuizzes = [
  { title: "PAK vs AUS Quarter Finals", questions: 10, reward: "500 pts", status: "Live" },
  { title: "Bowling Mastery", questions: 15, reward: "750 pts", status: "Starting Soon" },
  { title: "Batting Legends", questions: 12, reward: "600 pts", status: "Live" },
]

const rewardTiers = [
  { name: "Bronze Fan", progress: 75, next: "Silver Star" },
  { name: "Silver Star", progress: 30, next: "Gold Champion" },
  { name: "Gold Champion", progress: 0, next: "Platinum Legend" },
]

export default function UserDashboard() {
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
          <Button variant="primary" className="w-fit">
            Play Now <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Matches */}
        <Card className="neo-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Matches</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMatches.map((match, index) => (
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
            <Button variant="primary" size="sm">Join Quiz</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {activeQuizzes.map((quiz, index) => (
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
                    <Button variant="ghost" size="sm">Play</Button>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedContainer>
  )
}
