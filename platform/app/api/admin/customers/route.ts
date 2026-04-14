import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { connectDB } from "@/lib/db";
import CustomerUser from "@/models/CustomerUser";

/**
 * @swagger
 * /api/admin/customers:
 *   get:
 *     summary: List all customers (Admin only)
 *     tags: [Admin - Customers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Success }
 */
export async function GET(req: NextRequest) {
  try {
    verifyAdmin(req);
    await connectDB();

    const customers = await CustomerUser.find()
      .select("name email walletAddress points createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
