"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/animations"
import { Users, MoreVertical, Shield } from "lucide-react"

const users = [
  { name: "John Doe", email: "john@example.com", role: "Customer", status: "Active", joined: "Jan 15, 2026" },
  { name: "Jane Smith", email: "jane@example.com", role: "Customer", status: "Active", joined: "Feb 1, 2026" },
  { name: "Bob Wilson", email: "bob@example.com", role: "Customer", status: "Suspended", joined: "Dec 20, 2025" },
]

export default function AdminUsersPage() {
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
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </FadeIn>

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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td className="font-display font-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td>
                        <Badge variant={user.status === "Active" ? "primary" : "destructive"}>
                          {user.status}
                        </Badge>
                      </td>
                      <td>{user.joined}</td>
                      <td>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
