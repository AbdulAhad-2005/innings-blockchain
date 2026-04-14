import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { connectDB } from "@/lib/db";
import BrandUser from "@/models/BrandUser";

/**
 * @swagger
 * /api/admin/brands:
 *   get:
 *     summary: List all brands (Admin only)
 *     tags: [Admin - Brands]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 */
export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    await connectDB();

    const brands = await BrandUser.find()
      .select("name email walletAddress balance verificationStatus verifiedAt createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json(brands);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
