"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Trophy, Brain } from "lucide-react"

interface QuizItem {
  _id: string
  title: string
  status: string
  questionCount: number
  rewardPoints: number
  createdAt: string
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
            <Brain className="w-5 h-5" /> Coming Soon
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
                  <Badge variant={quiz.status.toLowerCase() === "active" ? "primary" : "outline"}>
                    {quiz.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
