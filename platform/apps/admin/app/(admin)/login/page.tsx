import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-2">Admin Panel</Badge>
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-slate-500">Administrative access only</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Admin ID</label>
            <Input type="text" placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-4">
          Restricted to authorized administrators only
        </p>
      </div>
    </div>
  );
}