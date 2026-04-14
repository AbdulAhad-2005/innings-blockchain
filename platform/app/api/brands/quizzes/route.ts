import { NextRequest, NextResponse } from "next/server";
import { verifyBrand, verifyAdmin } from "@/lib/authMiddleware";
import { createBid, getQuizzes, approveBid, rejectBid, uploadAdImages } from "@/services/quizService";

/**
 * @swagger
 * /api/brands/quizzes:
 *   get:
 *     summary: List quizzes for the authenticated brand
 *     tags: [Brand - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 *   post:
 *     summary: Submit a quiz bid for a match
 *     tags: [Brand - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [matchId, budget, startTime, endTime]
 *             properties:
 *               matchId: { type: string }
 *               budget: { type: number }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *     responses:
 *       201: { description: Bid submitted }
 */
export async function GET(req: NextRequest) {
  try {
    const user = verifyBrand(req);
    const quizzes = await getQuizzes({ brandId: user.userId });
    return NextResponse.json(quizzes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyBrand(req);
    const body = await req.json();
    const bid = await createBid(body, user.userId);
    return NextResponse.json(bid, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
