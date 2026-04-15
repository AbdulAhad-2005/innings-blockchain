import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Match from "@/models/Match"
import Team from "@/models/Team"

type TeamValue =
  | string
  | { toString(): string }
  | {
      name?: string
      shortName?: string
      abbreviation?: string
      logo?: string
      logoUrl?: string
    }

function getTeamId(value: TeamValue): string | null {
  if (!value) return null

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "object" && "name" in value) {
    return null
  }

  return typeof value.toString === "function" ? value.toString() : null
}

function normalizeTeam(
  value: TeamValue,
  teamsById: Map<string, { name: string; abbreviation: string; logoUrl?: string }>
) {
  if (value && typeof value === "object" && "name" in value && value.name) {
    return {
      name: value.name,
      shortName: value.shortName || value.abbreviation || value.name.slice(0, 3).toUpperCase(),
      logo: value.logo || value.logoUrl,
    }
  }

  const teamId = getTeamId(value)
  if (teamId && teamsById.has(teamId)) {
    const team = teamsById.get(teamId)!
    return {
      name: team.name,
      shortName: team.abbreviation,
      logo: team.logoUrl,
    }
  }

  return {
    name: "TBD",
    shortName: "TBD",
  }
}

export async function GET() {
  try {
    await connectDB()

    const matches = await Match.find({})
      .sort({ startTime: -1 })
      .limit(20)
      .lean() as Array<{
        _id: { toString(): string }
        teamA: TeamValue
        teamB: TeamValue
        startTime: Date
        status: string
        venue?: string
      }>

    const teamIds = Array.from(
      new Set(
        matches
          .flatMap((match) => [getTeamId(match.teamA), getTeamId(match.teamB)])
          .filter((id): id is string => Boolean(id))
      )
    )

    const teams =
      teamIds.length > 0
        ? await Team.find({ _id: { $in: teamIds } })
            .select("name abbreviation logoUrl")
            .lean()
        : []

    const teamsById = new Map(
      teams.map((team) => [team._id.toString(), team])
    )

    const formattedMatches = matches.map((match) => ({
      _id: match._id.toString(),
      teamA: normalizeTeam(match.teamA, teamsById),
      teamB: normalizeTeam(match.teamB, teamsById),
      startTime: match.startTime,
      status: match.status,
      venue: match.venue || "Venue TBA",
    }))

    return NextResponse.json(formattedMatches)
  } catch (error) {
    console.error("Matches fetch error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
