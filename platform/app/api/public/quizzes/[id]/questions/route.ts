import { NextRequest, NextResponse } from "next/server";
import { getQuestionsByQuiz } from "@/services/questionService";

/**
 * @swagger
 * /api/public/quizzes/{id}/questions:
 *   get:
 *     summary: List questions for a specific quiz (Public - answers masked)
 *     tags: [Public - Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questions = await getQuestionsByQuiz(id);

    const publicQuestions = questions.map((question) => {
      const obj = question.toObject();
      delete obj.correctAnswer;
      return obj;
    });

    return NextResponse.json(publicQuestions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
