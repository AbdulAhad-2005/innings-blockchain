import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { approveBid, rejectBid } from "@/services/quizService";

/**
 * @swagger
 * /api/admin/quizzes/{id}/status:
 *   patch:
 *     summary: Approve or Reject a quiz bid
 *     tags: [Admin - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [approved, rejected] }
 *     responses:
 *       200: { description: Success }
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const { status } = await req.json();
    
    let quiz;
    if (status === "approved") {
      quiz = await approveBid(id);
    } else if (status === "rejected") {
      quiz = await rejectBid(id);
    } else {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    return NextResponse.json(quiz);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
