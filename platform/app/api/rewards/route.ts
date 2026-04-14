import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/authMiddleware";
import { createReward, getRewards } from "@/services/rewardService";

/**
 * @swagger
 * /api/rewards:
 *   get:
 *     summary: List rewards
 *     description: Returns a list of all rewards. Brands and Admins can use `?mine=true` to see only rewards they created.
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mine
 *         schema: { type: boolean }
 *         description: If true, filters by the current user's created rewards.
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create a reward (Brand/Admin only)
 *     description: Creates a new reward with an image upload. Use multipart/form-data.
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [points, startDate, expirationDate, image]
 *             properties:
 *               points: { type: integer, example: 100 }
 *               startDate: { type: string, format: date-time }
 *               expirationDate: { type: string, format: date-time }
 *               description: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Created
 */
export async function GET(req: NextRequest) {
  try {
    const user = verifyToken(req);
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine") === "true";

    const rewards = await getRewards({ 
      mine, 
      userId: user.userId,
      role: user.role 
    });
    
    return NextResponse.json(rewards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyToken(req);
    
    // Auth: Brand or Admin only
    if (user.role !== "brand" && user.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Only Brands and Admins can create rewards." }, { status: 403 });
    }

    const formData = await req.formData();
    
    const data = {
      points: Number(formData.get("points")),
      startDate: formData.get("startDate") as string,
      expirationDate: formData.get("expirationDate") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as File,
    };

    if (isNaN(data.points) || data.points < 1) {
      return NextResponse.json({ error: "Points must be a positive number." }, { status: 400 });
    }

    const reward = await createReward(data, user);
    return NextResponse.json(reward, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
