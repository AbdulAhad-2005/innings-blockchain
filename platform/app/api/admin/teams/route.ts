import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { createTeam, getAllTeams } from "@/services/teamService";

/**
 * @swagger
 * /api/admin/teams:
 *   get:
 *     summary: List all teams (Admin only)
 *     tags: [Admin - Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Register a new team (Admin only)
 *     tags: [Admin - Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, abbreviation]
 *             properties:
 *               name: { type: string, example: "Mumbai Indians" }
 *               abbreviation: { type: string, example: "MI" }
 *               logoUrl: { type: string, example: "https://example.com/logo.png" }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Team created
 */
export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    const teams = await getAllTeams();
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes("Access") ? 403 : 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAdmin(req);
    const body = await req.json();
    const team = await createTeam(body);
    return NextResponse.json(team, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
