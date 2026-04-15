import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Match from "@/models/Match"
import Team from "@/models/Team"

interface UpdateMatchBody {
  teamA?: string
  teamB?: string
  startTime?: string
  endTime?: string
  status?: "scheduled" | "live" | "completed"
  venue?: string
  score?: {
    teamA: number
    teamB: number
  }
}

const MATCH_DURATION_HOURS = 4

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

function normalizeMatch(match: {
  _id: { toString(): string }
  teamA: unknown
  teamB: unknown
  startTime: Date
  endTime?: Date
  status: string
  venue?: string
  score?: { teamA: number; teamB: number }
}) {
  return {
    _id: match._id.toString(),
    teamA: normalizeTeam(match.teamA),
    teamB: normalizeTeam(match.teamB),
    startTime: match.startTime,
    endTime: match.endTime,
    status: match.status,
    venue: match.venue || "Venue TBA",
    score: match.score,
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request)
    await connectDB()

    const { id } = await params
    const match = await Match.findById(id)
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
      score?: { teamA: number; teamB: number }
    } | null

    if (!match) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 })
    }

    return NextResponse.json(normalizeMatch(match))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request)
    await connectDB()

    const { id } = await params
    const body = (await request.json()) as UpdateMatchBody

    const existing = await Match.findById(id)
    if (!existing) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 })
    }

    const nextTeamA = body.teamA || String(existing.teamA)
    const nextTeamB = body.teamB || String(existing.teamB)

    if (nextTeamA === nextTeamB) {
      return NextResponse.json(
        { error: "A team cannot play against itself." },
        { status: 400 }
      )
    }

    if (body.teamA || body.teamB) {
      const [teamAExists, teamBExists] = await Promise.all([
        Team.exists({ _id: nextTeamA }),
        Team.exists({ _id: nextTeamB }),
      ])

      if (!teamAExists || !teamBExists) {
        return NextResponse.json(
          { error: "One or both teams were not found." },
          { status: 404 }
        )
      }
    }

    const nextStartTime = body.startTime ? new Date(body.startTime) : existing.startTime
    if (Number.isNaN(nextStartTime.getTime())) {
      return NextResponse.json({ error: "startTime must be a valid date." }, { status: 400 })
    }

    const nextEndTime = body.endTime
      ? new Date(body.endTime)
      : existing.endTime || new Date(nextStartTime.getTime() + MATCH_DURATION_HOURS * 60 * 60 * 1000)

    if (Number.isNaN(nextEndTime.getTime())) {
      return NextResponse.json({ error: "endTime must be a valid date." }, { status: 400 })
    }

    if (nextEndTime <= nextStartTime) {
      return NextResponse.json(
        { error: "endTime must be after startTime." },
        { status: 400 }
      )
    }

    if (body.teamA || body.teamB || body.startTime) {
      const [overlapA, overlapB] = await Promise.all([
        checkTeamOverlap(nextTeamA, nextStartTime, id),
        checkTeamOverlap(nextTeamB, nextStartTime, id),
      ])

      if (overlapA || overlapB) {
        return NextResponse.json(
          { error: "One of the selected teams has an overlapping match schedule." },
          { status: 409 }
        )
      }
    }

    const updates: Record<string, unknown> = {
      teamA: nextTeamA,
      teamB: nextTeamB,
      startTime: nextStartTime,
      endTime: nextEndTime,
    }

    if (body.status) {
      updates.status = body.status
    }

    if (typeof body.venue === "string") {
      updates.venue = body.venue.trim()
    }

    if (body.score && Number.isFinite(body.score.teamA) && Number.isFinite(body.score.teamB)) {
      updates.score = {
        teamA: Number(body.score.teamA),
        teamB: Number(body.score.teamB),
      }
    }

    const updated = await Match.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
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
      score?: { teamA: number; teamB: number }
    } | null

    if (!updated) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 })
    }

    return NextResponse.json(normalizeMatch(updated))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update match." },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request)
    await connectDB()

    const { id } = await params
    const deleted = await Match.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 })
    }

    return NextResponse.json({ message: "Match deleted successfully." })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete match." },
      { status: 400 }
    )
  }
}
