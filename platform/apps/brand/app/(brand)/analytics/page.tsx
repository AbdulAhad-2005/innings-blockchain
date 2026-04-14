import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const overviewStats = [
  { label: "Total Reach", value: "48.2K", change: "+12%" },
  { label: "Engagement Rate", value: "67%", change: "+5%" },
  { label: "Conversions", value: "4,230", change: "+18%" },
  { label: "Avg. Time", value: "4.2 min", change: "+0.3 min" },
];

const campaigns = [
  { name: "PAK vs AUS", reach: 12400, engagement: "72%", conversions: 1240, revenue: "$12,400" },
  { name: "India Quiz", reach: 8900, engagement: "68%", conversions: 890, revenue: "$8,900" },
  { name: "T20 Preview", reach: 15200, engagement: "58%", conversions: 1520, revenue: "$15,200" },
];

const dailyData = [
  { date: "Jan 20", participants: 1200, conversions: 340 },
  { date: "Jan 21", participants: 2100, conversions: 620 },
  { date: "Jan 22", participants: 1800, conversions: 480 },
  { date: "Jan 23", participants: 2400, conversions: 720 },
  { date: "Jan 24", participants: 3200, conversions: 890 },
  { date: "Jan 25", participants: 2800, conversions: 760 },
  { date: "Jan 26", participants: 3500, conversions: 1020 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="text-sm text-slate-500">Track your campaign performance.</p>
        </div>
        <div className="flex gap-2">
          <select className="form-input">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="btn btn-secondary">Export CSV</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="pt-4">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
              <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Conversion rates by campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Reach</th>
                      <th>Engagement</th>
                      <th>Conversions</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.name}>
                        <td className="font-medium">{c.name}</td>
                        <td>{c.reach.toLocaleString()}</td>
                        <td>{c.engagement}</td>
                        <td>{c.conversions.toLocaleString()}</td>
                        <td className="font-semibold">${c.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>User demographics and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Audience analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Reward distribution and ROI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Participants</th>
                      <th>Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.map((d) => (
                      <tr key={d.date}>
                        <td>{d.date}</td>
                        <td>{d.participants.toLocaleString()}</td>
                        <td>{d.conversions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}