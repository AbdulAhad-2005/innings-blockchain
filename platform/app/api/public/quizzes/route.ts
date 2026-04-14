import { NextRequest, NextResponse } from "next/server";
import { getQuizzes } from "@/services/quizService";

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
