import { NextRequest, NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/authMiddleware";
import { submitAnswer } from "@/services/participationService";

/**
 * @swagger
 * /api/customer/quizzes/questions/{id}/answer:
 *   post:
 *     summary: Submit an answer to a quiz question
 *     tags: [Customer - Participation]
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
 *             required: [answer]
 *             properties:
 *               answer: { type: string }
 *     responses:
 *       200:
 *         description: Answer processed. Returns if it was correct and the similarity score.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyCustomer(req);
    const { id } = await params;
    const { answer } = await req.json();
    
    const result = await submitAnswer(user.userId, id, answer);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
