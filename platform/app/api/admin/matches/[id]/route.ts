import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "../../../../../lib/authMiddleware";
import { getMatchById, updateMatch, deleteMatch } from "../../../../../services/matchService";

/**
 * @swagger
 * /api/admin/matches/{id}:
 *   get:
 *     summary: Get match details (Admin only)
 *     tags: [Admin - Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Match details
 *   put:
 *     summary: Update a match (Admin only)
 *     description: Updates match details. Re-validates overlaps if startTime or teams are changed.
 *     tags: [Admin - Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamA: { type: string }
 *               teamB: { type: string }
 *               startTime: { type: string, format: date-time }
 *               status: { type: string, enum: [scheduled, live, completed, cancelled] }
 *     responses:
 *       200:
 *         description: Match updated
 *       400:
 *         description: Overlap detected or invalid data
 *   delete:
 *     summary: Delete a match (Admin only)
 *     tags: [Admin - Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Match deleted
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const match = await getMatchById(id);
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    return NextResponse.json(match);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const match = await updateMatch(id, body);
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    return NextResponse.json(match);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const match = await deleteMatch(id);
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    return NextResponse.json({ message: "Match deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
