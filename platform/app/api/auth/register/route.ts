// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "../../../../services/authService";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account. The `role` field determines which user
 *       collection is used (admin, customer, brand). Extra fields specific
 *       to each role (e.g. `walletAddress` for customers) should be included
 *       in the request body.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *               role:
 *                 type: string
 *                 enum: [admin, customer, brand]
 *                 example: customer
 *               walletAddress:
 *                 type: string
 *                 description: Required when role is 'customer'
 *                 example: "0xABC123"
 *               adminRole:
 *                 type: string
 *                 description: Sub-role label when role is 'admin' (e.g. 'superadmin')
 *                 example: superadmin
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *         description: Validation error or email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, ...extras } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "name, email, password, and role are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const user = await registerUser({ name, email, password, role, ...extras });

    return NextResponse.json(
      { message: "User registered successfully.", user },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
