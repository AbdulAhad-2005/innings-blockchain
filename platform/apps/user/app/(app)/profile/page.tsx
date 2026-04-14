"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { clearToken } from "@/lib/auth";

interface MeResponse {
  user: {
    name: string;
    email: string;
    walletAddress?: string;
    points?: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<MeResponse["user"] | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const response = await apiRequest<MeResponse>("/api/auth/me");
        if (mounted) {
          setUser(response.user);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "Failed to load profile.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const displayName = user?.name || "-";
  const displayEmail = user?.email || "-";
  const displayWallet = user?.walletAddress || "Not set";

  return (
    <main className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="shell-card neo-panel fade-rise shimmer-surface border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">Profile</Badge>
          <CardTitle className="mt-2 font-display text-4xl uppercase tracking-[0.06em] text-white">
            Fan identity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-white/70">Loading profile...</p> : null}
          {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}
          <div className="mt-6 grid gap-3">
            <div className="neo-tile tilt-card rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/56">Display name</p>
              <p className="mt-2 text-white">{displayName}</p>
            </div>
            <div className="neo-tile tilt-card rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/56">Email</p>
              <p className="mt-2 text-white">{displayEmail}</p>
            </div>
            <div className="neo-tile tilt-card rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/56">Wallet address</p>
              <p className="mt-2 text-white break-all">{displayWallet}</p>
            </div>
          </div>
          <Button variant="outline" className="neo-outline mt-4 w-full" onClick={handleLogout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
      <Card className="shell-card neo-panel fade-rise delay-1 border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">Activity</Badge>
          <CardTitle className="mt-2 font-display text-4xl uppercase tracking-[0.06em] text-white">
            Last 7 days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6 grid gap-3">
            <div className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
              Total points: {user?.points ?? 0}
            </div>
            <div className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
              Keep playing quizzes to increase your leaderboard rank.
            </div>
            <div className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
              Reward claims and activity are synced from your account history.
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
