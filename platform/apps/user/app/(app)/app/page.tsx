"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

interface MatchItem {
  _id: string;
  status?: string;
  startTime?: string;
  teamA?: { name?: string };
  teamB?: { name?: string };
}

interface QuizItem {
  _id: string;
  status?: string;
}

interface RewardItem {
  _id: string;
}

export default function UserHubPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [matchData, quizData] = await Promise.all([
          apiRequest<MatchItem[]>("/api/public/matches"),
          apiRequest<QuizItem[]>("/api/public/quizzes"),
        ]);

        let rewardData: RewardItem[] = [];
        try {
          rewardData = await apiRequest<RewardItem[]>("/api/rewards");
        } catch {
          rewardData = [];
        }

        if (mounted) {
          setMatches(matchData);
          setQuizzes(quizData);
          setRewards(rewardData);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "Failed to load dashboard data.";
          setError(message);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const quickStats = useMemo(
    () => [
      { label: "Upcoming matches", value: matches.length.toString().padStart(2, "0") },
      {
        label: "Live quizzes",
        value: quizzes.filter((quiz) => quiz.status === "active").length.toString().padStart(2, "0"),
      },
      { label: "Rewards available", value: rewards.length.toString().padStart(2, "0") },
    ],
    [matches, quizzes, rewards]
  );

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
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="shell-card neo-panel fade-rise delay-1 border-white/10 bg-white/5">
          <CardHeader>
            <Badge variant="outline">Marquee Fixtures</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {matches.slice(0, 3).map((match) => {
                const teams = `${match.teamA?.name || "Team A"} vs ${match.teamB?.name || "Team B"}`;
                const startLabel = match.startTime
                  ? new Date(match.startTime).toLocaleString()
                  : "TBD";
                const status = match.status || "scheduled";

                return (
                <div
                  key={match._id}
                  className="neo-tile tilt-card rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <p className="font-display text-2xl uppercase tracking-[0.04em] text-white">
                    {teams}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <Badge variant="secondary">{status}</Badge>
                    <span className="text-white/70">{startLabel}</span>
                  </div>
                </div>
                );
              })}
              {matches.length === 0 ? (
                <p className="text-sm text-white/70">No fixtures available.</p>
              ) : null}
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
