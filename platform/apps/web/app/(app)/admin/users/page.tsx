"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { apiRequest } from "@/lib/api"
import { Users, Shield } from "lucide-react"

interface UserItem {
  _id: string
  name: string
  email: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await apiRequest<UserItem[]>("/api/admin/customers")
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const handleAddUser = async () => {
    const name = window.prompt("Enter full name")?.trim()
    const email = window.prompt("Enter email")?.trim()
    const password = window.prompt("Enter temporary password")?.trim()
    const walletAddress = window.prompt("Enter wallet address")?.trim()

    if (!name || !email || !password || !walletAddress) {
      return
    }

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role: "customer",
          walletAddress,
        }),
      })

      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user.")
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="accent" className="mb-2 text-black">Users</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
              Manage Users
            </h1>
          </div>
          <Button variant="outline" onClick={handleAddUser}>
            <Users className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </FadeIn>

      {error && (
        <Card className="neo-card border-red-500">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      <SlideUp delay={0.1}>
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" /> All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td className="font-display font-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge variant="outline">Customer</Badge>
                      </td>
                      <td>
                        <Badge variant="primary">
                          Active
                        </Badge>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {loading && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  )}
                  {!loading && users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
