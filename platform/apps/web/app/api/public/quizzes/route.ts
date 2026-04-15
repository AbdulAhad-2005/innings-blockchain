import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"

export async function GET() {
  try {
    await connectDB()

    const quizzes = await Quiz.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean() as Array<{
        _id: { toString(): string }
        title: string
        matchId?: { toString(): string }
        status: string
        questions?: Array<unknown>
        rewardPoints: number
        createdAt: Date
      }>

    const formattedQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id.toString(),
      title: quiz.title,
      matchId: quiz.matchId?.toString(),
      status: quiz.status,
      questionCount: quiz.questions?.length || 0,
      rewardPoints: quiz.rewardPoints,
      createdAt: quiz.createdAt,
    }))

    return NextResponse.json(formattedQuizzes)
  } catch (error) {
    console.error("Quizzes fetch error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
