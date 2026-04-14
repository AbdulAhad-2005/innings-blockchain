import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { getTeamById, updateTeam, deleteTeam } from "@/services/teamService";

/**
 * @swagger
 * /api/admin/teams/{id}:
 *   get:
 *     summary: Get team details (Admin only)
 *     tags: [Admin - Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team details
 *   put:
 *     summary: Update a team (Admin only)
 *     tags: [Admin - Teams]
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
 *               name: { type: string }
 *               abbreviation: { type: string }
 *               logoUrl: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Team updated
 *   delete:
 *     summary: Delete a team (Admin only)
 *     tags: [Admin - Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team deleted
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const team = await getTeamById(id);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const team = await updateTeam(id, body);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const team = await deleteTeam(id);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
