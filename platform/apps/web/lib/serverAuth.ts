import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export type UserRole = "admin" | "customer" | "brand"

export interface AuthPayload {
  userId: string
  email: string
  name: string
  role: UserRole
  iat?: number
  exp?: number
}

function readBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization")

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }

  return req.cookies.get("innings_token")?.value ?? null
}

export function verifyToken(req: NextRequest): AuthPayload {
  const token = readBearerToken(req)

  if (!token) {
    throw new Error("No token provided. Add Authorization header or login cookie.")
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set")
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as AuthPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired. Please log in again.")
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token.")
    }

    throw error
  }
}

function verifyRole(req: NextRequest, role: UserRole): AuthPayload {
  const payload = verifyToken(req)

  if (payload.role !== role) {
    throw new Error(`Access denied. This route requires the '${role}' role.`)
  }

  return payload
}

export function verifyAdmin(req: NextRequest): AuthPayload {
  return verifyRole(req, "admin")
}

export function verifyBrand(req: NextRequest): AuthPayload {
  return verifyRole(req, "brand")
}

export function verifyCustomer(req: NextRequest): AuthPayload {
  return verifyRole(req, "customer")
}
