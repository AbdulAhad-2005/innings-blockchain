"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FadeIn } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Trophy, Brain, CircleCheck, Sparkles, SendHorizontal } from "lucide-react"

interface QuizItem {
  _id: string
  title: string
  status: string
  questionCount: number
  rewardPoints: number
  createdAt: string
}

interface QuestionItem {
  _id: string
  questionText: string
}

interface AnswerResponse {
  isCorrect: boolean
  similarity: number
  pointsAwarded: number
  totalPoints: number
  blockchain?: {
    txHash: string
    proofHash?: string
    contractAddress?: string
  } | null
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [answeringId, setAnsweringId] = useState<string | null>(null)
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({})
  const [answerResults, setAnswerResults] = useState<Record<string, AnswerResponse>>({})

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true)
        const data = await apiRequest<QuizItem[]>("/api/public/quizzes")
        setQuizzes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quizzes.")
      } finally {
        setLoading(false)
      }
    }

    void loadQuizzes()
  }, [])

  const openQuiz = async (quizId: string) => {
    try {
      setLoadingQuestions(true)
      setError("")
      setActiveQuizId(quizId)
      setAnswerResults({})
      setAnswerInputs({})

      const data = await apiRequest<QuestionItem[]>(`/api/public/quizzes/${quizId}/questions`)
      setQuestions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions.")
    } finally {
      setLoadingQuestions(false)
    }
  }

  const submitAnswer = async (questionId: string) => {
    const answer = answerInputs[questionId]?.trim()

    if (!answer) {
      setError("Please type an answer before submitting.")
      return
    }

    try {
      setAnsweringId(questionId)
      setError("")

      const result = await apiRequest<AnswerResponse>(
        `/api/customer/quizzes/questions/${questionId}/answer`,
        {
          method: "POST",
          body: JSON.stringify({ answer }),
        }
      )

      setAnswerResults((prev) => ({ ...prev, [questionId]: result }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer.")
    } finally {
      setAnsweringId(null)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="primary" className="mb-2">Quizzes</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Cricket Quizzes
        </h1>
        <p className="text-gray-600 mt-2">
          Test your cricket knowledge and win rewards
        </p>
      </FadeIn>

      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" /> Available Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="neo-card p-8 text-center text-gray-600">Loading quizzes...</div>}

          {!loading && error && (
            <div className="neo-card p-8 text-center text-red-600">{error}</div>
          )}

          {!loading && !error && quizzes.length === 0 && (
            <div className="neo-card p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-display text-xl font-bold mb-2">No Quizzes Yet</h3>
              <p className="text-gray-600">No quizzes are currently available.</p>
            </div>
          )}

          {!loading && !error && quizzes.length > 0 && (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="neo-card p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display font-bold text-lg">{quiz.title}</p>
                    <p className="text-sm text-gray-600">
                      {quiz.questionCount} questions · {quiz.rewardPoints} pts
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(quiz.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={quiz.status.toLowerCase() === "active" ? "primary" : "outline"}>
                      {quiz.status}
                    </Badge>
                    <Button variant="secondary" size="sm" onClick={() => openQuiz(quiz._id)}>
                      Play Quiz
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {activeQuizId && (
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Quiz Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingQuestions && (
              <div className="neo-card p-6 text-center text-gray-600">Loading questions...</div>
            )}

            {!loadingQuestions && questions.length === 0 && (
              <div className="neo-card p-6 text-center text-gray-600">
                No questions have been added yet for this quiz.
              </div>
            )}

            {!loadingQuestions &&
              questions.map((question) => {
                const result = answerResults[question._id]

                return (
                  <div key={question._id} className="neo-card p-4 space-y-4">
                    <p className="font-display font-bold text-lg">{question.questionText}</p>

                    <div className="flex flex-col md:flex-row gap-2">
                      <Input
                        value={answerInputs[question._id] || ""}
                        onChange={(event) =>
                          setAnswerInputs((prev) => ({
                            ...prev,
                            [question._id]: event.target.value,
                          }))
                        }
                        placeholder="Type your answer"
                        disabled={Boolean(result) || answeringId === question._id}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => submitAnswer(question._id)}
                        disabled={Boolean(result) || answeringId === question._id}
                      >
                        <SendHorizontal className="mr-2 h-4 w-4" />
                        {answeringId === question._id ? "Submitting..." : "Submit"}
                      </Button>
                    </div>

                    {result && (
                      <div className="neo-card p-3 bg-[#fff8e7]">
                        <p className="font-display font-bold flex items-center gap-2">
                          <CircleCheck className="w-4 h-4" />
                          {result.isCorrect
                            ? `Correct! +${result.pointsAwarded} credit`
                            : "Not correct this time"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Similarity: {(result.similarity * 100).toFixed(1)}% · Total Points: {result.totalPoints}
                        </p>
                        {result.blockchain?.txHash && (
                          <p className="text-xs text-gray-500 mt-1">Proof TX: {result.blockchain.txHash}</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
