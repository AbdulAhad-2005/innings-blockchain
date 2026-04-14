import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <main className="auth-grid md:grid-cols-[1.1fr_0.9fr]">
      <Card className="glass-panel fade-rise rounded-[2rem] border-white/10 bg-white/5">
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
          <form className="grid gap-5">
            <div className="grid gap-2">
              <span className="field-label">Email</span>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <span className="field-label">Password</span>
              <Input type="password" placeholder="Enter your password" />
            </div>
            <Button type="submit" className="w-full">
              Sign In
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

      <Card className="shell-card fade-rise delay-2 border-white/10 bg-white/5">
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
            <Badge variant="outline">Live quiz in 06:12</Badge>
            <Badge variant="outline">2 rewards pending</Badge>
            <Badge variant="outline">Campaign active</Badge>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
