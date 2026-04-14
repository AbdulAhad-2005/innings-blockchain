import { NextRequest, NextResponse } from "next/server";
import { getQuizzes, getQuizById } from "@/services/quizService";
import { getQuestionsByQuiz } from "@/services/questionService";

/**
 * @swagger
 * /api/public/quizzes:
 *   get:
 *     summary: List all approved quizzes across all brands
 *     tags: [Public - Quizzes]
 *     responses:
 *       200: { description: Success }
 */
export async function GET(req: NextRequest) {
  try {
    const quizzes = await getQuizzes({ status: "approved" });
    return NextResponse.json(quizzes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/public/quizzes/{id}/questions:
 *   get:
 *     summary: List questions for a specific quiz (Public - Answers masked)
 *     tags: [Public - Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 */
export async function GET_QUESTIONS(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const questions = await getQuestionsByQuiz(id);
    
    // Mask correct answers before serving to public
    const publicQuestions = questions.map(q => {
      const obj = q.toObject();
      delete obj.correctAnswer;
      return obj;
    });
    
    return NextResponse.json(publicQuestions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
