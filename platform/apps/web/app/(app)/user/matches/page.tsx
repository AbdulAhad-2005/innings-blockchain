"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Gamepad2, Calendar } from "lucide-react"

interface MatchItem {
  _id: string
  teamA: { name: string; shortName: string }
  teamB: { name: string; shortName: string }
  startTime: string
  status: string
  venue: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        const data = await apiRequest<MatchItem[]>("/api/public/matches")
        setMatches(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load matches.")
      } finally {
        setLoading(false)
      }
    }

    void loadMatches()
  }, [])

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="primary" className="mb-2">Matches</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Live & Upcoming Matches
        </h1>
        <p className="text-gray-600 mt-2">
          Catch all the cricket action and participate in quizzes
        </p>
      </FadeIn>

      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="neo-card p-8 text-center text-gray-600">Loading matches...</div>
          )}

          {!loading && error && (
            <div className="neo-card p-8 text-center text-red-600">{error}</div>
          )}

          {!loading && !error && matches.length === 0 && (
            <div className="neo-card p-8 text-center">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-bold mb-2">No Matches Yet</h3>
              <p className="text-gray-600">No live or upcoming matches are available right now.</p>
            </div>
          )}

          {!loading && !error && matches.length > 0 && (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match._id} className="neo-card p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display font-bold text-lg">
                      {match.teamA.shortName} vs {match.teamB.shortName}
                    </p>
                    <p className="text-sm text-gray-600">{new Date(match.startTime).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{match.venue}</p>
                  </div>
                  <Badge variant={match.status.toLowerCase() === "live" ? "primary" : "outline"}>
                    {match.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
