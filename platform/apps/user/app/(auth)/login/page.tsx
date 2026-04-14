"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";
import { setToken } from "@/lib/auth";

interface LoginResponse {
  token: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          role: "customer",
        }),
      });

      setToken(response.token);
      router.push("/app");
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Login failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-grid md:grid-cols-[1.1fr_0.9fr]">
      <Card className="glass-panel neo-panel fade-rise shimmer-surface rounded-[2rem] border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            Welcome Back
          </Badge>
          <CardTitle className="section-title">Sign in to continue</CardTitle>
          <CardDescription className="section-copy">
            Authenticate to access matches, quizzes, and rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <span className="field-label">Email</span>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <span className="field-label">Password</span>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit" className="neo-button w-full">
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-5 flex items-center justify-between text-sm text-white/70">
            <Link href="/signup" className="hover:text-white">
              Create account
            </Link>
            <a href="#" className="hover:text-white">
              Forgot password
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="shell-card neo-panel fade-rise delay-2 border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">Tonight</Badge>
          <CardTitle className="mt-2 font-display text-4xl uppercase tracking-[0.06em] text-white">
            Pakistan vs Australia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-white/75">
            After login, users land on a personalized hub with
            fixture highlights and live quiz entry points.
          </p>
          <div className="mt-6 grid gap-3">
            <Badge variant="outline" className="neo-outline">Live quiz in 06:12</Badge>
            <Badge variant="outline" className="neo-outline">2 rewards pending</Badge>
            <Badge variant="outline" className="neo-outline">Campaign active</Badge>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
