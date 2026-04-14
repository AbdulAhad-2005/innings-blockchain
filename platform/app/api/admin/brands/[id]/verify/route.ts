import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import {
  getBrandBadgeStatus,
  issueBrandVerificationBadge,
  revokeBrandVerificationBadge,
} from "@/services/brandVerificationService";

interface VerifyActionBody {
  action?: "issue" | "revoke";
  metadataURI?: string;
  walletAddress?: string;
}

/**
 * @swagger
 * /api/admin/brands/{id}/verify:
 *   get:
 *     summary: Get brand verification badge status
 *     tags: [Admin - Brand Verification]
 *     security: [{ bearerAuth: [] }]
 *   patch:
 *     summary: Issue or revoke a brand verification badge
 *     tags: [Admin - Brand Verification]
 *     security: [{ bearerAuth: [] }]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const status = await getBrandBadgeStatus(id);
    return NextResponse.json(status);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch brand status.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAdmin(req);
    const { id } = await params;
    const body = (await req.json()) as VerifyActionBody;

    const action = body.action || "issue";

    if (action === "issue") {
      if (!body.metadataURI) {
        return NextResponse.json(
          { error: "metadataURI is required when action is 'issue'." },
          { status: 400 }
        );
      }

      const result = await issueBrandVerificationBadge({
        brandId: id,
        adminUserId: admin.userId,
        metadataURI: body.metadataURI,
        walletAddress: body.walletAddress,
      });

      return NextResponse.json(result);
    }

    if (action === "revoke") {
      const result = await revokeBrandVerificationBadge({
        brandId: id,
        adminUserId: admin.userId,
      });

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "action must be either 'issue' or 'revoke'." },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update brand verification.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
