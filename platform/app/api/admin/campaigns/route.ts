import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { connectDB } from "@/lib/db";
import Quiz from "@/models/Quiz";

/**
 * @swagger
 * /api/admin/campaigns:
 *   get:
 *     summary: List all campaigns (Admin only)
 *     tags: [Admin - Campaigns]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 */
export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    await connectDB();

    const campaigns = await Quiz.find()
      .populate("brandId", "name email")
      .populate("matchId")
      .sort({ createdAt: -1 });

    return NextResponse.json(campaigns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
