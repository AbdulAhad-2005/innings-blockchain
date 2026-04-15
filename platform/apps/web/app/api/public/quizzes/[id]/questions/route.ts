import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"
import Question from "@/models/Question"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const quiz = await Quiz.findById(id).select("status")

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 })
    }

    const lowerStatus = String(quiz.status || "").toLowerCase()
    if (["rejected", "cancelled"].includes(lowerStatus)) {
      return NextResponse.json({ error: "Quiz is not available." }, { status: 403 })
    }

    const questions = await Question.find({ quizId: id }).sort({ createdAt: 1 }).lean()

    const publicQuestions = questions.map((question) => ({
      _id: question._id.toString(),
      quizId: question.quizId.toString(),
      questionText: question.questionText,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }))

    return NextResponse.json(publicQuestions)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load questions." },
      { status: 400 }
    )
  }
}
