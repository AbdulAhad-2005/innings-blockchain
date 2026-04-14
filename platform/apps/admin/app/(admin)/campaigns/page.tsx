import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const campaigns = [
  { id: "cmp_001", name: "PAK vs AUS Quiz", brand: "Acme Sports", status: "active", participants: 4820, pending: 0 },
  { id: "cmp_002", name: "India Prediction", brand: "PakCricket", status: "active", participants: 2150, pending: 0 },
  { id: "cmp_003", name: "T20 Preview", brand: "IPL Official", status: "pending_review", participants: 0, pending: 5 },
  { id: "cmp_004", name: "Suspicious Quiz", brand: "Unknown", status: "flagged", participants: 15000, pending: 12 },
  { id: "cmp_005", name: "Old Campaign", brand: "Dead Brand", status: "completed", participants: 5400, pending: 0 },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaign Moderation</h1>
          <p className="text-sm text-slate-500">Review and moderate brand campaigns.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search campaigns..." className="max-w-xs" />
        <select className="h-9 px-3 rounded-md border border-slate-200 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending Review</option>
          <option>Flagged</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Participants</th>
              <th>Pending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="font-mono text-xs">{campaign.id}</td>
                <td className="font-medium">{campaign.name}</td>
                <td>{campaign.brand}</td>
                <td>
                  <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'pending_review' ? 'warning' : campaign.status === 'flagged' ? 'destructive' : 'secondary'}>
                    {campaign.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td>{campaign.participants.toLocaleString()}</td>
                <td>{campaign.pending}</td>
                <td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {campaign.status === 'pending_review' && (
                      <>
                        <Button size="sm">Approve</Button>
                        <Button size="sm" variant="destructive">Reject</Button>
                      </>
                    )}
                    {campaign.status === 'flagged' && (
                      <Button size="sm" variant="destructive">Ban</Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button size="sm" variant="outline">Flag</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}