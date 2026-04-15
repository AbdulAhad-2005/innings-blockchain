import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Team from "@/models/Team"

interface CreateTeamBody {
  name: string
  abbreviation: string
  logoUrl?: string
  description?: string
}

export async function GET(request: NextRequest) {
  try {
    verifyAdmin(request)
    await connectDB()

    const teams = await Team.find({}).sort({ name: 1 }).lean()
    return NextResponse.json(teams)
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

    const body = (await request.json()) as CreateTeamBody

    if (!body.name?.trim() || !body.abbreviation?.trim()) {
      return NextResponse.json(
        { error: "name and abbreviation are required." },
        { status: 400 }
      )
    }

    const abbreviation = body.abbreviation.trim().toUpperCase()

    const existing = await Team.findOne({ abbreviation })
    if (existing) {
      return NextResponse.json(
        { error: `A team with abbreviation '${abbreviation}' already exists.` },
        { status: 409 }
      )
    }

    const team = await Team.create({
      name: body.name.trim(),
      abbreviation,
      logoUrl: body.logoUrl?.trim() || undefined,
      description: body.description?.trim() || undefined,
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create team." },
      { status: 400 }
    )
  }
}
