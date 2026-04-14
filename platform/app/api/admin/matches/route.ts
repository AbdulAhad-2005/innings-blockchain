import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { createMatch, getAllMatches } from "@/services/matchService";

/**
 * @swagger
 * /api/admin/matches:
 *   get:
 *     summary: List all matches with team details (Admin only)
 *     tags: [Admin - Matches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matches
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new match (Admin only)
 *     description: Registers a match between two teams. Validates that teams exist and that there are no scheduling overlaps.
 *     tags: [Admin - Matches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [teamA, teamB, startTime]
 *             properties:
 *               teamA: { type: string, description: "ObjectId of Team A", example: "64abc123" }
 *               teamB: { type: string, description: "ObjectId of Team B", example: "64abc456" }
 *               startTime: { type: string, format: date-time, example: "2026-05-20T19:00:00Z" }
 *               status: { type: string, enum: [scheduled, live, completed, cancelled], default: scheduled }
 *     responses:
 *       201:
 *         description: Match created
 *       400:
 *         description: Validation error (overlap or missing teams)
 */
export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    const matches = await getAllMatches();
    return NextResponse.json(matches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAdmin(req);
    const body = await req.json();
    const match = await createMatch(body);
    return NextResponse.json(match, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
