import { NextResponse } from "next/server";
import { getAllMatches } from "@/services/matchService";

/**
 * @swagger
 * /api/public/matches:
 *   get:
 *     summary: List all public matches with team details
 *     tags: [Public - Matches]
 *     responses:
 *       200: { description: Success }
 */
export async function GET() {
  try {
    const matches = await getAllMatches();
    return NextResponse.json(matches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
