// app/api/auth/logout/route.ts
// Since auth is stateless (Bearer tokens), logout is handled client-side by
// discarding the token. This endpoint exists as a documented signal for clients
// to clear their stored token and confirms the logout instruction.

import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: >
 *       Stateless logout endpoint. Because authentication uses JWT Bearer tokens
 *       (not server-side sessions), the server cannot invalidate a token directly.
 *       This endpoint instructs the client to discard its stored token.
 *       For true token revocation, implement a server-side token blocklist.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout acknowledged — client should discard the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully. Please discard your token.
 */
export async function POST() {
  return NextResponse.json(
    { message: "Logged out successfully. Please discard your token." },
    { status: 200 }
  );
}
