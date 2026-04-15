import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Match from "@/models/Match"
import Team from "@/models/Team"

interface CreateMatchBody {
  teamA: string
  teamB: string
  startTime: string
  endTime?: string
  status?: "scheduled" | "live" | "completed"
  venue?: string
}

const MATCH_DURATION_HOURS = 4

function getTeamId(value: unknown): string | null {
  if (!value) return null

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "object" && value !== null && "_id" in value) {
    const idValue = (value as { _id?: unknown })._id
    if (typeof idValue === "string") return idValue
    if (idValue && typeof idValue === "object" && "toString" in idValue) {
      return (idValue as { toString(): string }).toString()
    }
  }

  if (typeof value === "object" && value !== null && "toString" in value) {
    return (value as { toString(): string }).toString()
  }

  return null
}

function normalizeTeam(value: unknown) {
  if (value && typeof value === "object" && "name" in value) {
    const team = value as {
      name?: string
      shortName?: string
      abbreviation?: string
      logo?: string
      logoUrl?: string
    }

    return {
      name: team.name || "TBD",
      shortName: team.shortName || team.abbreviation || (team.name ? team.name.slice(0, 3).toUpperCase() : "TBD"),
      logo: team.logo || team.logoUrl,
    }
  }

  return {
    name: "TBD",
    shortName: "TBD",
  }
}

async function checkTeamOverlap(teamId: string, startTime: Date, excludeMatchId?: string) {
  const windowStart = new Date(startTime.getTime() - MATCH_DURATION_HOURS * 60 * 60 * 1000)
  const windowEnd = new Date(startTime.getTime() + MATCH_DURATION_HOURS * 60 * 60 * 1000)

  const query: Record<string, unknown> = {
    $or: [{ teamA: teamId }, { teamB: teamId }],
    startTime: { $gte: windowStart, $lte: windowEnd },
  }

  if (excludeMatchId) {
    query._id = { $ne: excludeMatchId }
  }

  return Match.findOne(query)
}

function normalizeMatch(match: {
  _id: { toString(): string }
  teamA: unknown
  teamB: unknown
  startTime: Date
  endTime?: Date
  status: string
  venue?: string
}) {
  return {
    _id: match._id.toString(),
    teamA: normalizeTeam(match.teamA),
    teamB: normalizeTeam(match.teamB),
    startTime: match.startTime,
    endTime: match.endTime,
    status: match.status,
    venue: match.venue || "Venue TBA",
  }
}

export async function GET(request: NextRequest) {
  try {
    verifyAdmin(request)
    await connectDB()

    const matches = await Match.find({})
      .populate("teamA", "name abbreviation logoUrl")
      .populate("teamB", "name abbreviation logoUrl")
      .sort({ startTime: -1 })
      .lean() as Array<{
        _id: { toString(): string }
        teamA: unknown
        teamB: unknown
        startTime: Date
        endTime?: Date
        status: string
        venue?: string
      }>

    return NextResponse.json(matches.map(normalizeMatch))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAdmin(request)
    await connectDB()

    const body = (await request.json()) as CreateMatchBody

    if (!body.teamA || !body.teamB || !body.startTime) {
      return NextResponse.json(
        { error: "teamA, teamB, and startTime are required." },
        { status: 400 }
      )
    }

    if (body.teamA === body.teamB) {
      return NextResponse.json(
        { error: "A team cannot play against itself." },
        { status: 400 }
      )
    }

    const startTime = new Date(body.startTime)
    if (Number.isNaN(startTime.getTime())) {
      return NextResponse.json({ error: "startTime must be a valid date." }, { status: 400 })
    }

    const endTime = body.endTime ? new Date(body.endTime) : new Date(startTime.getTime() + MATCH_DURATION_HOURS * 60 * 60 * 1000)
    if (Number.isNaN(endTime.getTime())) {
      return NextResponse.json({ error: "endTime must be a valid date." }, { status: 400 })
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        { error: "endTime must be after startTime." },
        { status: 400 }
      )
    }

    const [teamA, teamB] = await Promise.all([
      Team.findById(body.teamA),
      Team.findById(body.teamB),
    ])

    if (!teamA || !teamB) {
      return NextResponse.json(
        { error: "One or both teams were not found." },
        { status: 404 }
      )
    }

    const [overlapA, overlapB] = await Promise.all([
      checkTeamOverlap(body.teamA, startTime),
      checkTeamOverlap(body.teamB, startTime),
    ])

    if (overlapA || overlapB) {
      return NextResponse.json(
        { error: "One of the selected teams has an overlapping match schedule." },
        { status: 409 }
      )
    }

    const created = await Match.create({
      teamA: body.teamA,
      teamB: body.teamB,
      startTime,
      endTime,
      status: body.status || "scheduled",
      venue: body.venue?.trim() || undefined,
    })

    const populated = await Match.findById(created._id)
      .populate("teamA", "name abbreviation logoUrl")
      .populate("teamB", "name abbreviation logoUrl")
      .lean() as {
        _id: { toString(): string }
        teamA: unknown
        teamB: unknown
        startTime: Date
        endTime?: Date
        status: string
        venue?: string
      } | null

    return NextResponse.json(populated ? normalizeMatch(populated) : created, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create match." },
      { status: 400 }
    )
  }
}
