import { NextRequest, NextResponse } from "next/server"
import { verifyCustomer } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Question from "@/models/Question"
import Quiz from "@/models/Quiz"
import UserAnswer from "@/models/UserAnswer"
import CustomerUser from "@/models/CustomerUser"
import { hasBlockchainSigningConfig, recordRewardWinOnChain } from "@/lib/blockchain"

interface SubmitAnswerBody {
  answer: string
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function diceCoefficient(source: string, target: string): number {
  if (source === target) return 1
  if (source.length < 2 || target.length < 2) return 0

  const sourceBigrams = new Map<string, number>()
  for (let i = 0; i < source.length - 1; i += 1) {
    const pair = source.slice(i, i + 2)
    sourceBigrams.set(pair, (sourceBigrams.get(pair) || 0) + 1)
  }

  let intersection = 0
  for (let i = 0; i < target.length - 1; i += 1) {
    const pair = target.slice(i, i + 2)
    const count = sourceBigrams.get(pair) || 0
    if (count > 0) {
      sourceBigrams.set(pair, count - 1)
      intersection += 1
    }
  }

  return (2 * intersection) / (source.length + target.length - 2)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyCustomer(request)
    await connectDB()

    const { id } = await params
    const body = (await request.json()) as SubmitAnswerBody

    if (!body.answer?.trim()) {
      return NextResponse.json({ error: "answer is required." }, { status: 400 })
    }

    const alreadyAnswered = await UserAnswer.findOne({ userId: user.userId, questionId: id })
    if (alreadyAnswered) {
      return NextResponse.json(
        { error: "You have already attempted this question." },
        { status: 409 }
      )
    }

    const question = await Question.findById(id)
    if (!question) {
      return NextResponse.json({ error: "Question not found." }, { status: 404 })
    }

    const quiz = await Quiz.findById(question.quizId)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 })
    }

    const quizStatus = String(quiz.status || "").toLowerCase()
    if (["draft", "rejected", "cancelled"].includes(quizStatus)) {
      return NextResponse.json({ error: "Quiz is not available." }, { status: 403 })
    }

    const now = new Date()
    if (quiz.startTime && now < new Date(quiz.startTime)) {
      return NextResponse.json({ error: "Quiz has not started yet." }, { status: 403 })
    }

    if (quiz.endTime && now > new Date(quiz.endTime)) {
      return NextResponse.json({ error: "Quiz has already ended." }, { status: 403 })
    }

    const similarity = diceCoefficient(
      normalizeText(body.answer),
      normalizeText(question.correctAnswer)
    )

    const isCorrect = similarity >= 0.85
    const pointsAwarded = isCorrect ? 1 : 0

    let proofHash: string | undefined
    let proofTxHash: string | undefined
    let proofContractAddress: string | undefined

    if (isCorrect && hasBlockchainSigningConfig()) {
      try {
        const chainResult = await recordRewardWinOnChain({
          userId: user.userId,
          matchId: quiz.matchId?.toString() || `quiz-${quiz._id.toString()}`,
          rewardId: quiz._id.toString(),
          credits: pointsAwarded,
          rewardType: "quiz_credit",
        })

        proofHash = chainResult.proofHash
        proofTxHash = chainResult.txHash
        proofContractAddress = chainResult.contractAddress
      } catch {
        // Keep answer flow available even if chain write fails.
      }
    }

    const answerRecord = await UserAnswer.create({
      userId: user.userId,
      questionId: question._id,
      answer: body.answer.trim(),
      isCorrect,
      similarity,
      pointsAwarded,
      proofHash,
      proofTxHash,
      proofContractAddress,
    })

    const updatedUser =
      pointsAwarded > 0
        ? await CustomerUser.findByIdAndUpdate(
            user.userId,
            { $inc: { points: pointsAwarded } },
            { new: true }
          )
        : await CustomerUser.findById(user.userId)

    return NextResponse.json({
      questionId: question._id,
      answerId: answerRecord._id,
      isCorrect,
      similarity,
      pointsAwarded,
      totalPoints: updatedUser?.points ?? 0,
      blockchain: proofTxHash
        ? {
            txHash: proofTxHash,
            proofHash,
            contractAddress: proofContractAddress,
          }
        : null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit answer." },
      { status: 400 }
    )
  }
}
