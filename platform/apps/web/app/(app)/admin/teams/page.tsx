"use client"

import { FormEvent, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Flag, Plus, Trash2 } from "lucide-react"

interface TeamItem {
  _id: string
  name: string
  abbreviation: string
  logoUrl?: string
  description?: string
  createdAt: string
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<TeamItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [abbreviation, setAbbreviation] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [description, setDescription] = useState("")

  const loadTeams = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await apiRequest<TeamItem[]>("/api/admin/teams")
      setTeams(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTeams()
  }, [])

  const handleCreateTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !abbreviation.trim()) {
      setError("Team name and abbreviation are required.")
      return
    }

    try {
      setCreating(true)
      setError("")

      await apiRequest("/api/admin/teams", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          abbreviation: abbreviation.trim().toUpperCase(),
          logoUrl: logoUrl.trim() || undefined,
          description: description.trim() || undefined,
        }),
      })

      setName("")
      setAbbreviation("")
      setLogoUrl("")
      setDescription("")

      await loadTeams()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team.")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTeam = async (id: string) => {
    const confirmed = window.confirm("Delete this team? This cannot be undone.")
    if (!confirmed) return

    try {
      setDeletingId(id)
      setError("")
      await apiRequest(`/api/admin/teams/${id}`, { method: "DELETE" })
      await loadTeams()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="accent" className="mb-2 text-black">Teams</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Team Registry
        </h1>
        <p className="text-gray-600 mt-2">Create and manage teams before scheduling matches.</p>
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
              <Plus className="w-5 h-5" /> Add Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTeam} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Mumbai Indians"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-abbr">Abbreviation</Label>
                <Input
                  id="team-abbr"
                  value={abbreviation}
                  onChange={(event) => setAbbreviation(event.target.value)}
                  placeholder="MI"
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-logo">Logo URL (Optional)</Label>
                <Input
                  id="team-logo"
                  value={logoUrl}
                  onChange={(event) => setLogoUrl(event.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-description">Description (Optional)</Label>
                <Input
                  id="team-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Team details"
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" variant="secondary" disabled={creating}>
                  <Plus className="mr-2 h-4 w-4" /> {creating ? "Creating..." : "Create Team"}
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
              <Flag className="w-5 h-5" /> All Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Abbreviation</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team._id}>
                      <td>
                        <p className="font-display font-bold">{team.name}</p>
                        {team.description && <p className="text-xs text-gray-500">{team.description}</p>}
                      </td>
                      <td>
                        <Badge variant="outline">{team.abbreviation}</Badge>
                      </td>
                      <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeam(team._id)}
                          disabled={deletingId === team._id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {loading && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500">Loading teams...</td>
                    </tr>
                  )}

                  {!loading && teams.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500">No teams created yet.</td>
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
