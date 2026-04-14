import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/authMiddleware";
import { getBrandBadgeStatus } from "@/services/brandVerificationService";

/**
 * @swagger
 * /api/brands/{id}/badge:
 *   get:
 *     summary: Get a brand's verification badge status
 *     tags: [Brand - Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyToken(req);
    const { id } = await params;

    if (user.role === "brand" && user.userId !== id) {
      return NextResponse.json(
        { error: "Access denied. You can only read your own badge status." },
        { status: 403 }
      );
    }

    const status = await getBrandBadgeStatus(id);
    return NextResponse.json(status);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch badge status.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
