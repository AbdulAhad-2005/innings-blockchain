import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/authMiddleware";
import { getRewardById, updateReward, deleteReward } from "@/services/rewardService";

/**
 * @swagger
 * /api/rewards/{id}:
 *   get:
 *     summary: Get reward details
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     summary: Update reward (Creator/Admin only)
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
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
 *               points: { type: integer }
 *               startDate: { type: string, format: date-time }
 *               expirationDate: { type: string, format: date-time }
 *               description: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete reward (Creator/Admin only)
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyToken(req);
    const { id } = await params;
    const reward = await getRewardById(id);
    if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    return NextResponse.json(reward);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    
    const formData = await req.formData();
    const data: any = {};
    
    if (formData.has("points")) data.points = Number(formData.get("points"));
    if (formData.has("startDate")) data.startDate = formData.get("startDate");
    if (formData.has("expirationDate")) data.expirationDate = formData.get("expirationDate");
    if (formData.has("description")) data.description = formData.get("description");
    if (formData.has("image")) data.image = formData.get("image");

    const reward = await updateReward(id, data, user);
    return NextResponse.json(reward);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    
    await deleteReward(id, user);
    return NextResponse.json({ message: "Reward deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
