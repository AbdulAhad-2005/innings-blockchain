import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type UserRole = "customer" | "brand" | "admin"

const PUBLIC_PATHS = ["/", "/login", "/signup", "/api/public"]
const PROTECTED_PREFIXES = [
  "/user",
  "/brand",
  "/admin",
  "/api/customer",
  "/api/brands",
  "/api/admin",
  "/api/rewards",
]

function decodeRoleFromToken(token: string): UserRole | null {
  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) return null

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const payload = JSON.parse(atob(padded)) as { role?: string }

    if (payload.role === "customer" || payload.role === "brand" || payload.role === "admin") {
      return payload.role
    }

    return null
  } catch {
    return null
  }
}

function getDashboardPath(role: UserRole | null): string {
  switch (role) {
    case "brand":
      return "/brand"
    case "admin":
      return "/admin"
    case "customer":
    default:
      return "/user"
  }
}

function roleAllowedForPath(pathname: string, role: UserRole | null): boolean {
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/")
  const isBrandPath = pathname === "/brand" || pathname.startsWith("/brand/")
  const isUserPath = pathname === "/user" || pathname.startsWith("/user/")

  if (isAdminPath || pathname.startsWith("/api/admin")) {
    return role === "admin"
  }

  if (isBrandPath || pathname.startsWith("/api/brands")) {
    return role === "brand"
  }

  if (isUserPath || pathname.startsWith("/api/customer")) {
    return role === "customer"
  }

  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  const isProtectedPrefix = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (!isPublicPath && !isProtectedPrefix) {
    return NextResponse.next()
  }

  const token = request.cookies.get("innings_token")?.value
  const role = token ? decodeRoleFromToken(token) : null

  if (isProtectedPrefix && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isProtectedPrefix && token && !role) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete("innings_token")
    return response
  }

  if (isProtectedPrefix && !roleAllowedForPath(pathname, role)) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url))
  }

  if ((pathname === "/login" || pathname === "/signup") && token && role) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
