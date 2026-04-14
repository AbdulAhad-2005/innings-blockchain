import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="text-sm text-slate-500">Manage your brand account.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
          <CardDescription>Your brand information visible to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="form-group">
            <label className="form-label">Brand Name</label>
            <Input defaultValue="Acme Sports" />
          </div>
          <div className="form-group">
            <label className="form-label">Brand Logo URL</label>
            <Input defaultValue="https://example.com/logo.png" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input min-h-[100px]" 
              defaultValue="Premium sports brand bringing exciting cricket experiences."
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Login and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="form-group">
            <label className="form-label">Email</label>
            <Input defaultValue="brand@acme.com" type="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <Input type="password" defaultValue="********" />
          </div>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Connection</CardTitle>
          <CardDescription>Blockchain wallet for reward distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-medium">Connected Wallet</p>
              <p className="text-sm text-slate-500">0x7a2...f3d8</p>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>
          <Button variant="outline" className="mt-4">Disconnect</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>Integration credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="form-group">
            <label className="form-label">API Key</label>
            <Input defaultValue="ink_abc123xyz789" type="password" />
          </div>
          <Button variant="outline">Regenerate Key</Button>
        </CardContent>
      </Card>
    </div>
  );
}