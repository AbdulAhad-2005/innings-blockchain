import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cards = [
  { title: "Pakistan vs Australia", meta: "Live - Campaign #PAK-AUS-07" },
  { title: "India vs England", meta: "Starts tomorrow - Campaign #IND-ENG-03" },
  { title: "NZ vs South Africa", meta: "Friday prime slot - Campaign #NZ-SA-05" },
  { title: "Sri Lanka vs West Indies", meta: "Weekend special - Campaign #SL-WI-02" },
];

export default function MatchesPage() {
  return (
    <main className="grid gap-6">
      <Card className="glass-panel fade-rise rounded-[2rem] border-white/10 bg-white/5 p-7">
        <CardHeader>
          <Badge variant="secondary">Matches</Badge>
          <CardTitle className="section-title">Fixture-first discovery</CardTitle>
          <CardDescription className="section-copy">
            See featured match campaigns and enter quiz experiences.
          </CardDescription>
        </CardHeader>
      </Card>
      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="shell-card border-white/10 bg-white/5"
          >
            <CardHeader>
              <Badge variant="outline">Featured</Badge>
              <CardTitle className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-7 text-white/72">
                {card.meta}
              </CardDescription>
              <Button variant="secondary" className="mt-4 w-full">
                View Campaign
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
