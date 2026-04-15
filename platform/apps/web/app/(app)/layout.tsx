import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

type UserRole = "customer" | "brand" | "admin"

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/app/user"
    case "brand":
      return "/app/brand"
    case "admin":
      return "/app/admin"
    default:
      return "/app/user"
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      role: UserRole
    }

    return <>{children}</>
  } catch {
    redirect("/login")
  }
}
