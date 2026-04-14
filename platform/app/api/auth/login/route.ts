// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "../../../../services/authService";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: >
 *       Authenticates a user by email and password. The `role` field narrows
 *       the lookup to the correct user collection. On success, returns a signed
 *       JWT token that must be included in subsequent requests as:
 *       `Authorization: Bearer <token>`
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *               role:
 *                 type: string
 *                 enum: [admin, customer, brand]
 *                 example: customer
 *     responses:
 *       200:
 *         description: Login successful — returns JWT and user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT — valid for 7 days
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "email, password, and role are required." },
        { status: 400 }
      );
    }

    const result = await loginUser({ email, password, role });

    return NextResponse.json(
      { message: "Login successful.", ...result },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
