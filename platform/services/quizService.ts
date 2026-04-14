import { connectDB } from "@/lib/db";
import Quiz, { IQuiz } from "@/models/Quiz";
import { saveFile } from "@/lib/storage";
import { formatImageUrl } from "@/lib/utils";

export interface CreateBidPayload {
  matchId: string;
  budget: number;
  startTime: string | Date;
  endTime: string | Date;
}

export async function createBid(data: CreateBidPayload, brandId: string): Promise<IQuiz> {
  await connectDB();
  return await Quiz.create({
    ...data,
    brandId,
    status: "bid_pending",
    adImages: []
  });
}

export async function approveBid(quizId: string): Promise<IQuiz | null> {
  await connectDB();
  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    { status: "approved" },
    { new: true }
  );
  return quiz;
}

export async function rejectBid(quizId: string): Promise<IQuiz | null> {
  await connectDB();
  return await Quiz.findByIdAndUpdate(
    quizId,
    { status: "rejected" },
    { new: true }
  );
}

export async function uploadAdImages(quizId: string, files: File[], brandId: string): Promise<IQuiz | null> {
  await connectDB();
  
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  
  // Security: only the owning brand can upload, and only if approved
  if (quiz.brandId.toString() !== brandId) throw new Error("Unauthorized");
  if (quiz.status !== "approved") throw new Error("Quiz must be approved before uploading ads.");
  
  if (files.length > 10) throw new Error("Maximum 10 ad images allowed.");

  const imageUrls = await Promise.all(
    files.map(file => saveFile(file, "ads"))
  );

  quiz.adImages = imageUrls;
  await quiz.save();
  
  const obj = quiz.toObject();
  obj.adImages = obj.adImages.map((img: string) => formatImageUrl(img));
  return obj;
}

export async function getQuizzes(filter: any = {}) {
  await connectDB();
  const quizzes = await Quiz.find(filter)
    .populate("matchId")
    .populate("brandId", "name email");
    
  return quizzes.map(q => {
    const obj = q.toObject();
    if (obj.adImages) {
      obj.adImages = obj.adImages.map((img: string) => formatImageUrl(img));
    }
    return obj;
  });
}

export async function getQuizById(id: string) {
  await connectDB();
  const quiz = await Quiz.findById(id)
    .populate("matchId")
    .populate("brandId", "name email");
    
  if (!quiz) return null;
  const obj = quiz.toObject();
  if (obj.adImages) {
    obj.adImages = obj.adImages.map((img: string) => formatImageUrl(img));
  }
  return obj;
}
