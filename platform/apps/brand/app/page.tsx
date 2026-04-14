import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BrandLandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">Brand Dashboard</Badge>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Innings Brand Platform</h1>
        <p className="text-slate-600 max-w-lg">
          Create engaging cricket quiz campaigns, track participant analytics, and distribute blockchain rewards.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/brand/login">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/brand/signup">
          <Button>Apply for Access</Button>
        </Link>
      </div>

      <div className="grid gap-4 mt-12 md:grid-cols-3 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campaign Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Create and manage quiz and prediction campaigns tied to live cricket matches.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Track engagement, conversions, and ROI with detailed campaign analytics.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reward Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Distribute points, NFTs, and token rewards to participants.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}