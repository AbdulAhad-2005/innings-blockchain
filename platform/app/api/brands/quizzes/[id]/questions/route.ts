import { NextRequest, NextResponse } from "next/server";
import { verifyBrand } from "@/lib/authMiddleware";
import { createQuestion, getQuestionsByQuiz } from "@/services/questionService";

/**
 * @swagger
 * /api/brands/quizzes/{id}/questions:
 *   get:
 *     summary: List questions for a quiz owned by the brand
 *     tags: [Brand - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *   post:
 *     summary: Add a question to an approved quiz
 *     tags: [Brand - Quizzes]
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
 *             required: [questionText, correctAnswer]
 *             properties:
 *               questionText: { type: string }
 *               correctAnswer: { type: string }
 *     responses:
 *       201: { description: Success }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = verifyBrand(req);
    const { id } = await params;
    const questions = await getQuestionsByQuiz(id, user.userId);
    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = verifyBrand(req);
    const { id } = await params;
    const body = await req.json();
    const question = await createQuestion({ ...body, quizId: id }, user.userId);
    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
