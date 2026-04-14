"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

interface TeamLike {
  name?: string;
}

interface MatchItem {
  _id: string;
  status?: string;
  startTime?: string;
  teamA?: TeamLike;
  teamB?: TeamLike;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchMatches = async () => {
      try {
        const response = await apiRequest<MatchItem[]>("/api/public/matches");
        if (mounted) {
          setMatches(response);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "Failed to load matches.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMatches();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="grid gap-6">
      <Card className="glass-panel neo-panel fade-rise shimmer-surface rounded-[2rem] border-white/10 bg-white/5 p-7">
        <CardHeader>
          <Badge variant="secondary">Matches</Badge>
          <CardTitle className="section-title">Fixture-first discovery</CardTitle>
          <CardDescription className="section-copy">
            See featured match campaigns and enter quiz experiences.
          </CardDescription>
        </CardHeader>
      </Card>
      {loading ? <p className="text-sm text-white/70">Loading matches...</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <section className="grid gap-4 sm:grid-cols-2">
        {matches.map((match) => {
          const title = `${match.teamA?.name || "Team A"} vs ${match.teamB?.name || "Team B"}`;
          const meta = `${match.status || "scheduled"} - ${new Date(
            match.startTime || Date.now()
          ).toLocaleString()}`;

          return (
          <Card
            key={match._id}
            className="shell-card neo-panel neo-tile tilt-card border-white/10 bg-white/5"
          >
            <CardHeader>
              <Badge variant="outline">Featured</Badge>
              <CardTitle className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-7 text-white/72">
                {meta}
              </CardDescription>
              <Button variant="secondary" className="neo-button mt-4 w-full">
                View Campaign
              </Button>
            </CardContent>
          </Card>
          );
        })}
        {!loading && matches.length === 0 ? (
          <p className="text-sm text-white/70">No matches available yet.</p>
        ) : null}
      </section>
    </main>
  );
}
