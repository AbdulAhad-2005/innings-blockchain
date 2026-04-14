import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Active Campaigns", value: "8", change: "+2 this month" },
  { label: "Total Participants", value: "12.4K", change: "+1.2K this week" },
  { label: "Rewards Claimed", value: "3,842", change: "89% claim rate" },
  { label: "Engagement Rate", value: "67%", change: "+5% vs last month" },
];

const campaigns = [
  { name: "PAK vs AUS Launch", status: "active", participants: 4820, conversions: 1240, match: "Pakistan vs Australia" },
  { name: "India Cricket Quiz", status: "active", participants: 2150, conversions: 890, match: "India vs England" },
  { name: "T20 World Cup", status: "scheduled", participants: 0, conversions: 0, match: "Feb 15, 2026" },
  { name: "IPL Sprint", status: "completed", participants: 5400, conversions: 2100, match: "IPL 2025" },
];

export default function BrandDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back! Here&apos;s your campaign overview.</p>
        </div>
        <Button>+ New Campaign</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="pt-4">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
              <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Match</th>
                  <th>Participants</th>
                  <th>Conversions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.name}>
                    <td className="font-medium">{campaign.name}</td>
                    <td>{campaign.match}</td>
                    <td>{campaign.participants.toLocaleString()}</td>
                    <td>{campaign.conversions.toLocaleString()}</td>
                    <td>
                      <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'scheduled' ? 'warning' : 'neutral'}>
                        {campaign.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}