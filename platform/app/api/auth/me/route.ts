// app/api/auth/me/route.ts
// Returns the currently authenticated user's profile.
// Demonstrates usage of verifyToken — any logged-in user (any role) can call this.

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/authMiddleware";
import { getUserById } from "@/services/authService";

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     description: >
 *       Returns the full profile of the authenticated user (excluding password).
 *       Works for all roles — admin, customer, and brand — as long as a valid
 *       JWT is supplied.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User document (shape depends on role)
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
  try {
    // verifyToken throws if the header is missing or the token is invalid/expired
    const payload = verifyToken(req);

    const user = await getUserById(payload.userId, payload.role);

    return NextResponse.json({
      user: {
        ...user.toObject(),
        role: payload.role, // attach role since it's not stored in the individual collections
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unauthorized.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
