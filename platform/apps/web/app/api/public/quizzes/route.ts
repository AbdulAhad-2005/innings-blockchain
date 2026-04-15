import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"

export async function GET() {
  try {
    await connectDB()

    const quizzes = await Quiz.find({
      status: { $in: ["approved", "active", "scheduled", "completed"] },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean() as Array<{
        _id: { toString(): string }
        title?: string
        matchId?: { toString(): string }
        status: string
        questions?: Array<unknown>
        rewardPoints?: number
        rewardCount?: number
        budget?: number
        createdAt: Date
      }>

    const formattedQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id.toString(),
      title: quiz.title || "Match Quiz",
      matchId: quiz.matchId?.toString(),
      status: quiz.status,
      questionCount: quiz.questions?.length || 0,
      rewardPoints: quiz.rewardPoints ?? quiz.rewardCount ?? 0,
      budget: quiz.budget ?? 0,
      createdAt: quiz.createdAt,
    }))

    return NextResponse.json(formattedQuizzes)
  } catch (error) {
    console.error("Quizzes fetch error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
