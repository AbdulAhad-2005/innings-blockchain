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

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password || !walletAddress) {
      setError("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);

      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role: "customer",
          walletAddress,
        }),
      });

      const login = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          role: "customer",
        }),
      });

      setToken(login.token);
      router.push("/app");
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Signup failed.";
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
            Create Account
          </Badge>
          <CardTitle className="section-title">Join Innings</CardTitle>
          <CardDescription className="section-copy">
            Fast signup, then straight into the user hub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <span className="field-label">Full name</span>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
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
                placeholder="Create password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <span className="field-label">Wallet address</span>
              <Input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit" className="neo-button w-full">
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-5 text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
      <Card className="shell-card neo-panel fade-rise delay-2 border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">What you get</Badge>
        </CardHeader>
        <CardContent>
          <ul className="mt-4 grid gap-3 text-sm text-white/78">
            <li className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Personalized fixture and quiz feed
            </li>
            <li className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Reward progression and milestones
            </li>
            <li className="neo-tile rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Sports-first premium interface
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
