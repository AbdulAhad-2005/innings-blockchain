import { connectDB } from "../lib/db";
import Question from "../models/Question";
import Quiz from "../models/Quiz";
import UserAnswer from "../models/UserAnswer";
import CustomerUser from "../models/CustomerUser";
import Match from "../models/Match";
// @ts-ignore - string-similarity might not have types installed
import stringSimilarity from "string-similarity";

export async function submitAnswer(userId: string, questionId: string, providedAnswer: string) {
  await connectDB();

  // 1. Check if user already answered this question
  const existing = await UserAnswer.findOne({ userId, questionId });
  if (existing) {
    throw new Error("You have already attempted this question.");
  }

  // 2. Fetch question and quiz/match info for timing check
  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question not found");

  const quiz = await Quiz.findById(question.quizId);
  if (!quiz) throw new Error("Quiz not found");

  const match = await Match.findById(quiz.matchId);
  if (!match) throw new Error("Match not found");
  if (!match.endTime) throw new Error("Match has not ended yet.");

  // 3. Timing Check: availability window = match.endTime to match.endTime + 1 hour
  const now = new Date();
  const windowStart = new Date(match.endTime);
  const windowEnd = new Date(match.endTime.getTime() + 60 * 60 * 1000); // 1 hour later

  if (now < windowStart || now > windowEnd) {
    throw new Error("This quiz is only available for 1 hour after the match ends.");
  }

  // 4. Semantic Similarity Check (threshold: 0.85)
  const similarity = stringSimilarity.compareTwoStrings(
    providedAnswer.toLowerCase().trim(),
    question.correctAnswer.toLowerCase().trim()
  );

  const isCorrect = similarity >= 0.85;

  // 5. Create record
  await UserAnswer.create({
    userId,
    questionId,
    answer: providedAnswer,
    isCorrect
  });

  // 6. Reward user if correct
  if (isCorrect) {
    await CustomerUser.findByIdAndUpdate(userId, { $inc: { points: 1 } });
  }

  return { isCorrect, similarity };
}
