import { NextRequest, NextResponse } from "next/server";
import { verifyBrand } from "@/lib/authMiddleware";
import { uploadAdImages } from "@/services/quizService";

/**
 * @swagger
 * /api/brands/quizzes/{id}/ads:
 *   post:
 *     summary: Upload ad images for an approved quiz (Max 10)
 *     tags: [Brand - Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       200: { description: Success }
 *       400: { description: Validation error or quiz not approved }
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = verifyBrand(req);
    const { id } = await params;
    
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    
    if (files.length === 0) {
      return NextResponse.json({ error: "No images provided." }, { status: 400 });
    }

    const quiz = await uploadAdImages(id, files, user.userId);
    return NextResponse.json(quiz);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
