import { NextRequest, NextResponse } from "next/server"
import { verifyBrand } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"
import Question from "@/models/Question"

interface CreateQuestionBody {
  questionText: string
  options?: string[]
  correctAnswer: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyBrand(request)
    await connectDB()

    const { id } = await params

    const quiz = await Quiz.findOne({ _id: id, brandId: user.userId }).select("_id")
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 })
    }

    const questions = await Question.find({ quizId: id }).sort({ createdAt: 1 }).lean()
    return NextResponse.json(questions)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyBrand(request)
    await connectDB()

    const { id } = await params
    const body = (await request.json()) as CreateQuestionBody

    if (!body.questionText?.trim() || !body.correctAnswer?.trim()) {
      return NextResponse.json(
        { error: "questionText and correctAnswer are required." },
        { status: 400 }
      )
    }

    const quiz = await Quiz.findOne({ _id: id, brandId: user.userId })
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 })
    }

    const options =
      body.options && body.options.length > 1
        ? body.options.map((option) => option.trim()).filter(Boolean)
        : [body.correctAnswer.trim()]

    if (!options.includes(body.correctAnswer.trim())) {
      options.push(body.correctAnswer.trim())
    }

    const correctAnswerIndex = options.findIndex(
      (option) => option.toLowerCase() === body.correctAnswer.trim().toLowerCase()
    )

    const question = await Question.create({
      quizId: id,
      questionText: body.questionText.trim(),
      correctAnswer: body.correctAnswer.trim(),
      options,
    })

    quiz.questions = quiz.questions || []
    quiz.questions.push({
      question: body.questionText.trim(),
      options,
      correctAnswer: Math.max(0, correctAnswerIndex),
    })
    await quiz.save()

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create question." },
      { status: 400 }
    )
  }
}
