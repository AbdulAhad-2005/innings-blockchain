"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import { Gamepad2, Calendar } from "lucide-react"

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="primary" className="mb-2">Matches</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Live & Upcoming Matches
        </h1>
        <p className="text-gray-600 mt-2">
          Catch all the cricket action and participate in quizzes
        </p>
      </FadeIn>

      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="neo-card p-8 text-center">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="font-display text-xl font-bold mb-2">Matches Integration</h3>
            <p className="text-gray-600">
              Match data will be fetched from the Oracle and displayed here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
