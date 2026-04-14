import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Users", value: "24,832", change: "+1,204 this week" },
  { label: "Active Brands", value: "156", change: "+12 this month" },
  { label: "Active Campaigns", value: "42", change: "+8 this week" },
  { label: "Total Transactions", value: "89,432", change: "+12.4K this week" },
];

const recentActivity = [
  { action: "New user registered", user: "user_abc123", time: "2 mins ago" },
  { action: "Brand created campaign", user: "Acme Sports", time: "15 mins ago" },
  { action: "Reward claimed", user: "user_def456", time: "32 mins ago" },
  { action: "Campaign approved", user: "Admin", time: "1 hour ago" },
  { action: "User KYC verified", user: "user_ghi789", time: "2 hours ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">System overview and key metrics.</p>
        </div>
        <Badge variant="success">System Healthy</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
            <p className="text-xs text-green-600 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="font-semibold">Recent Activity</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((item, i) => (
              <tr key={i}>
                <td className="font-medium">{item.action}</td>
                <td>{item.user}</td>
                <td className="text-slate-500">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}