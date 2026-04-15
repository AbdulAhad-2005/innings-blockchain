const TOKEN_KEY = "innings_token"
const USER_ROLE_KEY = "innings_user_role"

export type UserRole = "customer" | "brand" | "admin"

export interface StoredUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_ROLE_KEY)
}

export function getStoredRole(): UserRole | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(USER_ROLE_KEY) as UserRole | null
}

export function setStoredRole(role: UserRole): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USER_ROLE_KEY, role)
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null
  const userStr = window.localStorage.getItem("innings_user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setStoredUser(user: StoredUser): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem("innings_user", JSON.stringify(user))
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem("innings_user")
}

export function clearStoredRole(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(USER_ROLE_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function isRole(role: UserRole): boolean {
  return getStoredRole() === role
}

export function getDashboardPath(role: UserRole): string {
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
