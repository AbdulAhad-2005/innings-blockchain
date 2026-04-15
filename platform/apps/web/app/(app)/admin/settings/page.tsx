"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FadeIn, SlideUp } from "@/components/animations"
import { getStoredUser } from "@/lib/auth"
import { Settings, Shield, Bell, Database } from "lucide-react"

export default function AdminSettingsPage() {
  const user = getStoredUser()

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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Admin Name</Label>
                    <Input defaultValue={user?.name || ""} className="neo-input" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={user?.email || ""} className="neo-input" />
                  </div>
                </div>
                <Button variant="secondary">Save Changes</Button>
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
