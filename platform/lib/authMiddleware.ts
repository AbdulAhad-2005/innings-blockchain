// lib/authMiddleware.ts
// JWT verification utilities — used as middleware inside Next.js App Router route handlers.
// Each function reads the `Authorization: Bearer <token>` header, verifies the token,
// and (for role-specific guards) asserts the encoded role matches the expected type.

import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type UserRole = "admin" | "customer" | "brand";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Extracts and verifies the JWT from the `Authorization: Bearer <token>` header.
 * Returns the decoded payload on success, throws an Error on failure.
 */
export function verifyToken(req: NextRequest): JWTPayload {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided. Add 'Authorization: Bearer <token>' header.");
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired. Please log in again.");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token.");
    }
    throw err;
  }
}

/**
 * Verifies the token AND asserts the user is an Admin.
 * Use this guard in routes that should only be accessible by admins.
 *
 * @example
 * export async function GET(req: NextRequest) {
 *   const payload = verifyAdmin(req); // throws if not admin
 *   // ...
 * }
 */
export function verifyAdmin(req: NextRequest): JWTPayload {
  const payload = verifyToken(req);
  if (payload.role !== "admin") {
    throw new Error("Access denied. This route requires the 'admin' role.");
  }
  return payload;
}

/**
 * Verifies the token AND asserts the user is a Customer.
 * Use this guard in routes that should only be accessible by customers.
 *
 * @example
 * export async function GET(req: NextRequest) {
 *   const payload = verifyCustomer(req); // throws if not customer
 *   // ...
 * }
 */
export function verifyCustomer(req: NextRequest): JWTPayload {
  const payload = verifyToken(req);
  if (payload.role !== "customer") {
    throw new Error("Access denied. This route requires the 'customer' role.");
  }
  return payload;
}

/**
 * Verifies the token AND asserts the user is a Brand.
 * Use this guard in routes that should only be accessible by brands.
 *
 * @example
 * export async function GET(req: NextRequest) {
 *   const payload = verifyBrand(req); // throws if not brand
 *   // ...
 * }
 */
export function verifyBrand(req: NextRequest): JWTPayload {
  const payload = verifyToken(req);
  if (payload.role !== "brand") {
    throw new Error("Access denied. This route requires the 'brand' role.");
  }
  return payload;
}
