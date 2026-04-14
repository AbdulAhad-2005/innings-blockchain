import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { getQuestionsByQuiz, updateQuestion, deleteQuestion } from "@/services/questionService";

/**
 * @swagger
 * /api/admin/quizzes/{id}/questions:
 *   get:
 *     summary: List all questions for a specific quiz (Admin)
 *     tags: [Admin - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const questions = await getQuestionsByQuiz(id);
    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/admin/questions/{id}:
 *   put:
 *     summary: Update a question (Admin)
 *     tags: [Admin - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText: { type: string }
 *               correctAnswer: { type: string }
 *     responses:
 *       200: { description: Success }
 *   delete:
 *     summary: Delete a question (Admin)
 *     tags: [Admin - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const question = await updateQuestion(id, body);
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const question = await deleteQuestion(id);
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });
    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
