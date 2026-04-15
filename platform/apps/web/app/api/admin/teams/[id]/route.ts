import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Team from "@/models/Team"

interface UpdateTeamBody {
  name?: string
  abbreviation?: string
  logoUrl?: string
  description?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(request)
    await connectDB()

    const { id } = await params
    const team = await Team.findById(id)

    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 })
    }

    return NextResponse.json(team)
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
    const body = (await request.json()) as UpdateTeamBody

    const updates: UpdateTeamBody = {}

    if (typeof body.name === "string") {
      updates.name = body.name.trim()
    }

    if (typeof body.abbreviation === "string") {
      updates.abbreviation = body.abbreviation.trim().toUpperCase()
      const existing = await Team.findOne({ abbreviation: updates.abbreviation, _id: { $ne: id } })
      if (existing) {
        return NextResponse.json(
          { error: `A team with abbreviation '${updates.abbreviation}' already exists.` },
          { status: 409 }
        )
      }
    }

    if (typeof body.logoUrl === "string") {
      updates.logoUrl = body.logoUrl.trim()
    }

    if (typeof body.description === "string") {
      updates.description = body.description.trim()
    }

    const team = await Team.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update team." },
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
    const deleted = await Team.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 })
    }

    return NextResponse.json({ message: "Team deleted successfully." })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete team." },
      { status: 400 }
    )
  }
}
