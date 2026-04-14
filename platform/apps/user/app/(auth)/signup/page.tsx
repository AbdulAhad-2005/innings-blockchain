import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  return (
    <main className="auth-grid md:grid-cols-[1.1fr_0.9fr]">
      <Card className="glass-panel fade-rise rounded-[2rem] border-white/10 bg-white/5">
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
          <form className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <span className="field-label">Full name</span>
              <Input type="text" placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <span className="field-label">Email</span>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <span className="field-label">Password</span>
              <Input type="password" placeholder="Create password" />
            </div>
            <Button type="submit" className="w-full">
              Create Account
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
      <Card className="shell-card fade-rise delay-2 border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">What you get</Badge>
        </CardHeader>
        <CardContent>
          <ul className="mt-4 grid gap-3 text-sm text-white/78">
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Personalized fixture and quiz feed
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Reward progression and milestones
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Sports-first premium interface
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
