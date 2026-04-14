"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

interface QuizItem {
  _id: string;
  status?: string;
  budget?: number;
  startTime?: string;
  endTime?: string;
  brandId?: {
    name?: string;
  };
  matchId?: {
    teamA?: { name?: string };
    teamB?: { name?: string };
  };
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchQuizzes = async () => {
      try {
        const response = await apiRequest<QuizItem[]>("/api/public/quizzes");
        if (mounted) {
          setQuizzes(response);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "Failed to load quizzes.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchQuizzes();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="grid gap-6">
      <Card className="glass-panel neo-panel fade-rise shimmer-surface rounded-[2rem] border-white/10 bg-white/5 p-7">
        <CardHeader>
          <Badge variant="secondary">Quizzes</Badge>
          <CardTitle className="section-title">Real-time quiz gameplay</CardTitle>
          <p className="section-copy">
            Active rounds, countdown pressure, and per-session results.
          </p>
        </CardHeader>
      </Card>
      {loading ? <p className="text-sm text-white/70">Loading quizzes...</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <section className="grid gap-4">
        {quizzes.map((quiz) => {
          const matchName = `${quiz.matchId?.teamA?.name || "Team A"} vs ${
            quiz.matchId?.teamB?.name || "Team B"
          }`;
          const state = quiz.status || "scheduled";

          return (
          <Card
            key={quiz._id}
            className="shell-card neo-panel neo-tile tilt-card border-white/10 bg-white/5"
          >
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="font-display text-3xl uppercase tracking-[0.06em] text-white">
                  {matchName}
                </CardTitle>
                <Badge variant={state === "active" ? "default" : "outline"}>
                  {state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/74">
                Brand: {quiz.brandId?.name || "Unknown"}
              </p>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
                Budget: {quiz.budget ?? 0} points
              </div>
              <Button
                variant={state === "active" ? "default" : "secondary"}
                className="neo-button mt-4 w-full"
              >
                {state === "active" ? "Join Now" : "Set Reminder"}
              </Button>
            </CardContent>
          </Card>
          );
        })}
        {!loading && quizzes.length === 0 ? (
          <p className="text-sm text-white/70">No approved quizzes are available yet.</p>
        ) : null}
      </section>
    </main>
  );
}
