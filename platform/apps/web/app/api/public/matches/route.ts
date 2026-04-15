import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Match from "@/models/Match"

export async function GET() {
  try {
    await connectDB()

    const matches = await Match.find({})
      .sort({ startTime: -1 })
      .limit(20)
      .lean() as Array<{
        _id: { toString(): string }
        teamA: { name: string; shortName: string }
        teamB: { name: string; shortName: string }
        startTime: Date
        status: string
        venue: string
      }>

    const formattedMatches = matches.map((match) => ({
      _id: match._id.toString(),
      teamA: match.teamA,
      teamB: match.teamB,
      startTime: match.startTime,
      status: match.status,
      venue: match.venue,
    }))

    return NextResponse.json(formattedMatches)
  } catch (error) {
    console.error("Matches fetch error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
