import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BrandLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-2">Brand Dashboard</Badge>
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Manage your campaigns and rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="form-group">
              <label className="form-label">Email</label>
              <Input type="email" placeholder="brand@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/brand/signup" className="text-blue-600 hover:underline">
              Apply for Brand Access
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}