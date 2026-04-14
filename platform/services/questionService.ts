import { connectDB } from "../lib/db";
import Question, { IQuestion } from "../models/Question";
import Quiz from "../models/Quiz";

export interface CreateQuestionPayload {
  quizId: string;
  questionText: string;
  correctAnswer: string;
}

export async function createQuestion(data: CreateQuestionPayload, brandId?: string): Promise<IQuestion> {
  await connectDB();

  const quiz = await Quiz.findById(data.quizId);
  if (!quiz) throw new Error("Quiz not found");

  // If brandId is provided, check ownership and approval status
  if (brandId) {
    if (quiz.brandId.toString() !== brandId) throw new Error("Unauthorized");
    if (quiz.status !== "approved") throw new Error("Cannot add questions to an unapproved quiz bid.");
  }

  return await Question.create(data);
}

export async function getQuestionsByQuiz(quizId: string, brandId?: string): Promise<IQuestion[]> {
  await connectDB();
  
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  if (brandId && quiz.brandId.toString() !== brandId) {
    throw new Error("Unauthorized");
  }

  return await Question.find({ quizId });
}

export async function updateQuestion(id: string, data: Partial<CreateQuestionPayload>, brandId?: string): Promise<IQuestion | null> {
  await connectDB();
  
  const question = await Question.findById(id);
  if (!question) return null;

  const quiz = await Quiz.findById(question.quizId);
  if (brandId && quiz?.brandId.toString() !== brandId) {
    throw new Error("Unauthorized");
  }

  return await Question.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteQuestion(id: string, brandId?: string): Promise<IQuestion | null> {
  await connectDB();

  const question = await Question.findById(id);
  if (!question) return null;

  const quiz = await Quiz.findById(question.quizId);
  if (brandId && quiz?.brandId.toString() !== brandId) {
    throw new Error("Unauthorized");
  }

  return await Question.findByIdAndDelete(id);
}
