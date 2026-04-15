"use client"

import { FormEvent, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Calendar, Play, CheckCircle2, Plus, Trash2 } from "lucide-react"

interface TeamItem {
  _id: string
  name: string
  abbreviation: string
}

interface MatchItem {
  _id: string
  teamA: { name: string; shortName: string }
  teamB: { name: string; shortName: string }
  startTime: string
  endTime?: string
  status: "scheduled" | "live" | "completed"
  venue?: string
}

export default function AdminMatchesPage() {
  const [teams, setTeams] = useState<TeamItem[]>([])
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [actingMatchId, setActingMatchId] = useState<string | null>(null)

  const [teamA, setTeamA] = useState("")
  const [teamB, setTeamB] = useState("")
  const [startTime, setStartTime] = useState("")
  const [venue, setVenue] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")

      const [teamsResponse, matchesResponse] = await Promise.all([
        apiRequest<TeamItem[]>("/api/admin/teams"),
        apiRequest<MatchItem[]>("/api/admin/matches"),
      ])

      setTeams(teamsResponse)
      setMatches(matchesResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load match data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const handleCreateMatch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!teamA || !teamB || !startTime) {
      setError("Select both teams and start time.")
      return
    }

    if (teamA === teamB) {
      setError("A team cannot play against itself.")
      return
    }

    try {
      setCreating(true)
      setError("")

      await apiRequest("/api/admin/matches", {
        method: "POST",
        body: JSON.stringify({
          teamA,
          teamB,
          startTime: new Date(startTime).toISOString(),
          venue: venue.trim() || undefined,
        }),
      })

      setTeamA("")
      setTeamB("")
      setStartTime("")
      setVenue("")

      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create match.")
    } finally {
      setCreating(false)
    }
  }

  const updateMatchStatus = async (matchId: string, status: MatchItem["status"]) => {
    try {
      setActingMatchId(matchId)
      setError("")

      await apiRequest(`/api/admin/matches/${matchId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })

      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update match status.")
    } finally {
      setActingMatchId(null)
    }
  }

  const deleteMatch = async (matchId: string) => {
    const confirmed = window.confirm("Delete this match? This cannot be undone.")
    if (!confirmed) return

    try {
      setActingMatchId(matchId)
      setError("")
      await apiRequest(`/api/admin/matches/${matchId}`, { method: "DELETE" })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete match.")
    } finally {
      setActingMatchId(null)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="accent" className="mb-2 text-black">Matches</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">Match Control</h1>
        <p className="text-gray-600 mt-2">
          Create fixtures, start live matches, and complete match sessions.
        </p>
      </FadeIn>

      {error && (
        <Card className="neo-card border-red-500">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      <SlideUp delay={0.1}>
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateMatch} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team-a">Team A</Label>
                <select
                  id="team-a"
                  className="neo-input h-12 w-full border-[3px] border-black px-3"
                  value={teamA}
                  onChange={(event) => setTeamA(event.target.value)}
                >
                  <option value="">Select Team A</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} ({team.abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-b">Team B</Label>
                <select
                  id="team-b"
                  className="neo-input h-12 w-full border-[3px] border-black px-3"
                  value={teamB}
                  onChange={(event) => setTeamB(event.target.value)}
                >
                  <option value="">Select Team B</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} ({team.abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue (Optional)</Label>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(event) => setVenue(event.target.value)}
                  placeholder="Wankhede Stadium"
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" variant="secondary" disabled={creating || teams.length < 2}>
                  <Plus className="mr-2 h-4 w-4" /> {creating ? "Creating..." : "Create Match"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SlideUp>

      <SlideUp delay={0.2}>
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Match List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Fixture</th>
                    <th>Start</th>
                    <th>Status</th>
                    <th>Venue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match._id}>
                      <td className="font-display font-bold">
                        {match.teamA.shortName} vs {match.teamB.shortName}
                      </td>
                      <td>{new Date(match.startTime).toLocaleString()}</td>
                      <td>
                        <Badge
                          variant={
                            match.status === "live"
                              ? "primary"
                              : match.status === "completed"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {match.status}
                        </Badge>
                      </td>
                      <td>{match.venue || "Venue TBA"}</td>
                      <td className="flex gap-2">
                        {match.status === "scheduled" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateMatchStatus(match._id, "live")}
                            disabled={actingMatchId === match._id}
                          >
                            <Play className="mr-1 h-3 w-3" /> Start Match
                          </Button>
                        )}

                        {match.status === "live" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMatchStatus(match._id, "completed")}
                            disabled={actingMatchId === match._id}
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Complete
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMatch(match._id)}
                          disabled={actingMatchId === match._id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {loading && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500">Loading matches...</td>
                    </tr>
                  )}

                  {!loading && matches.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500">No matches created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
