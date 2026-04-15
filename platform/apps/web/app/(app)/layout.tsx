import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

type UserRole = "customer" | "brand" | "admin"

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/user"
    case "brand":
      return "/brand"
    case "admin":
      return "/admin"
    default:
      return "/user"
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("innings_token")?.value

  if (!token) {
    redirect("/login")
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured")
    }

    jwt.verify(token, process.env.JWT_SECRET) as {
      role: UserRole
    }

    return <>{children}</>
  } catch {
    redirect("/login")
  }
}
