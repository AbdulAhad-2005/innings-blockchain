"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FadeIn, SlideUp } from "@/components/animations"
import { getStoredUser, setStoredUser } from "@/lib/auth"
import { apiRequest } from "@/lib/api"
import { Settings, Shield, Bell, Database } from "lucide-react"

interface MeResponse {
  user: {
    id: string
    name: string
    email: string
    role: "customer" | "brand" | "admin"
  }
}

export default function AdminSettingsPage() {
  const [user, setUser] = useState(getStoredUser())
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      const response = await apiRequest<MeResponse>("/api/auth/me")
      setUser(response.user)
      setStoredUser(response.user)
      setName(response.user.name)
      setEmail(response.user.email)
    }

    void loadProfile().catch(() => {
      // Keep local storage fallback if API is temporarily unavailable.
      const fallback = getStoredUser()
      setName(fallback?.name || "")
      setEmail(fallback?.email || "")
    })
  }, [])

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Name and email are required.")
      return
    }

    setSaving(true)

    const nextUser = {
      id: user?.id || "",
      name: name.trim(),
      email: email.trim(),
      role: "admin" as const,
    }

    setStoredUser(nextUser)
    setUser(nextUser)
    setMessage("Profile details saved locally.")
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <FadeIn direction="up">
        <Badge variant="accent" className="mb-2 text-black">Settings</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase">
          Platform Settings
        </h1>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SlideUp delay={0.1}>
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Admin Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && <p className="text-sm text-gray-600">{message}</p>}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Admin Name</Label>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="neo-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="neo-input"
                    />
                  </div>
                </div>
                <Button variant="secondary" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </SlideUp>

          <SlideUp delay={0.2}>
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-display font-bold">Email Alerts</p>
                    <p className="text-sm text-gray-600">Receive email for critical events</p>
                  </div>
                  <Badge variant="primary">Enabled</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-display font-bold">User Registration</p>
                    <p className="text-sm text-gray-600">Alert on new user signups</p>
                  </div>
                  <Badge variant="primary">Enabled</Badge>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>

        <SlideUp delay={0.3}>
          <Card className="neo-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" /> System Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="neo-card p-4 bg-[#fff8e7]">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Version</p>
                <p className="font-display font-bold">1.0.0</p>
              </div>
              <div className="neo-card p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Environment</p>
                <p className="font-display font-bold">Production</p>
              </div>
              <div className="neo-card p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Backup</p>
                <p className="font-display font-bold">2 hours ago</p>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </div>
  )
}
