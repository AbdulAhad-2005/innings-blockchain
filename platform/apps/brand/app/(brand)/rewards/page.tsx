import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const distributionStats = [
  { label: "Total Distributed", value: "4,230", type: "rewards" },
  { label: "Pending Claims", value: "342", type: "pending" },
  { label: "Claim Rate", value: "89%", type: "rate" },
  { label: "Total Value", value: "$21,500", type: "value" },
];

const rewards = [
  { 
    id: 1,
    name: "500 Points", 
    claimed: 2400,
    pending: 120,
    value: "$5 each",
    total: "$12,000",
    campaign: "PAK vs AUS" 
  },
  { 
    id: 2,
    name: "NFT Badge", 
    claimed: 890,
    pending: 45,
    value: "$10 each",
    total: "$8,900",
    campaign: "India Quiz" 
  },
  { 
    id: 3,
    name: "$50 Voucher", 
    claimed: 940,
    pending: 177,
    value: "$50 each",
    total: "$47,000",
    campaign: "T20 Preview" 
  },
];

const pendingClaims = [
  { id: 1, user: "user_abc123", reward: "500 Points", requested: "Jan 26, 2026", status: "pending" },
  { id: 2, user: "user_def456", reward: "NFT Badge", requested: "Jan 26, 2026", status: "pending" },
  { id: 3, user: "user_ghi789", reward: "$50 Voucher", requested: "Jan 25, 2026", status: "processing" },
  { id: 4, user: "user_jkl012", reward: "500 Points", requested: "Jan 25, 2026", status: "approved" },
];

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rewards Distribution</h1>
          <p className="text-sm text-slate-500">Track and manage reward claims.</p>
        </div>
        <Button>+ Mint Rewards</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {distributionStats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="pt-4">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Distribution</CardTitle>
          <CardDescription>Rewards by campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reward</th>
                  <th>Campaign</th>
                  <th>Claimed</th>
                  <th>Pending</th>
                  <th>Unit Value</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.name}</td>
                    <td>{r.campaign}</td>
                    <td>{r.claimed.toLocaleString()}</td>
                    <td>{r.pending}</td>
                    <td>{r.value}</td>
                    <td className="font-semibold">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Claims</CardTitle>
          <CardDescription>Claims awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Reward</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="font-mono text-sm">{claim.user}</td>
                    <td>{claim.reward}</td>
                    <td>{claim.requested}</td>
                    <td>
                      <Badge variant={claim.status === 'approved' ? 'success' : claim.status === 'processing' ? 'warning' : 'neutral'}>
                        {claim.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {claim.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">Approve</Button>
                            <Button size="sm" variant="ghost">Decline</Button>
                          </>
                        )}
                        {claim.status === 'processing' && (
                          <Button size="sm" variant="outline">Process</Button>
                        )}
                        {claim.status === 'approved' && (
                          <span className="text-sm text-slate-500">Completed</span>
                        )}
                      </div>
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