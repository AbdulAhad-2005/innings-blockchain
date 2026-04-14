import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="shell-card fade-rise border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">Profile</Badge>
          <CardTitle className="mt-2 font-display text-4xl uppercase tracking-[0.06em] text-white">
            Fan identity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6 grid gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/56">Display name</p>
              <p className="mt-2 text-white">Waleed Khan</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/56">Email</p>
              <p className="mt-2 text-white">waleed@example.com</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-white/56">Favorite team</p>
              <p className="mt-2 text-white">Pakistan</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            Edit Profile
          </Button>
        </CardContent>
      </Card>
      <Card className="shell-card fade-rise delay-1 border-white/10 bg-white/5">
        <CardHeader>
          <Badge variant="secondary">Activity</Badge>
          <CardTitle className="mt-2 font-display text-4xl uppercase tracking-[0.06em] text-white">
            Last 7 days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6 grid gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
              Completed 5 quizzes with 82% average accuracy.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
              Participated in 3 featured campaigns.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
              Earned 126 points toward the monthly reward target.
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
