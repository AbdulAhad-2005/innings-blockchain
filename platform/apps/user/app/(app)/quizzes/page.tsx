import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const rounds = [
  { name: "Powerplay Prediction", state: "Live", players: "1.2k participants" },
  { name: "Middle Overs Trivia", state: "Starts in 11m", players: "840 participants" },
  { name: "Final Over Rush", state: "Scheduled", players: "Coming tonight" },
];

export default function QuizzesPage() {
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
      <section className="grid gap-4">
        {rounds.map((round) => (
          <Card
            key={round.name}
            className="shell-card neo-panel neo-tile tilt-card border-white/10 bg-white/5"
          >
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="font-display text-3xl uppercase tracking-[0.06em] text-white">
                  {round.name}
                </CardTitle>
                <Badge variant={round.state === "Live" ? "default" : "outline"}>
                  {round.state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/74">{round.players}</p>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/84">
                Timer, progress, and answer interactions here.
              </div>
              <Button
                variant={round.state === "Live" ? "default" : "secondary"} 
                className="neo-button mt-4 w-full"
              >
                {round.state === "Live" ? "Join Now" : "Set Reminder"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
