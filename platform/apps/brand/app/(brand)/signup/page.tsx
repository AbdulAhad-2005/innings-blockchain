import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BrandSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Badge variant="secondary" className="w-fit mx-auto mb-2">Brand Dashboard</Badge>
          <CardTitle className="text-2xl">Apply for Brand Access</CardTitle>
          <CardDescription>Create your brand dashboard account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <Input placeholder="Your brand name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <Input type="email" placeholder="brand@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{" "}
            <Link href="/brand/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}