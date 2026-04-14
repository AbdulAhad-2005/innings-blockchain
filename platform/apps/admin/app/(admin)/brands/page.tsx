import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const brands = [
  { id: "brd_001", name: "Acme Sports", email: "acme@sports.com", status: "active", campaigns: 8, joined: "Dec 2025" },
  { id: "brd_002", name: "PakCricket", email: "info@pakcricket.com", status: "active", campaigns: 5, joined: "Jan 2026" },
  { id: "brd_003", name: "IPL Official", email: "admin@ipl.com", status: "active", campaigns: 12, joined: "Nov 2025" },
  { id: "brd_004", name: "Tata Crux", email: "brand@crux.com", status: "pending", campaigns: 0, joined: "Jan 2026" },
  { id: "brd_005", name: "Dead Brand", email: "old@brand.com", status: "inactive", campaigns: 0, joined: "Oct 2025" },
];

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand Management</h1>
          <p className="text-sm text-slate-500">Manage brand accounts and approvals.</p>
        </div>
        <Button>+ Add Brand</Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search brands..." className="max-w-xs" />
        <select className="h-9 px-3 rounded-md border border-slate-200 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Brand ID</th>
              <th>Brand Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Campaigns</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className="font-mono text-xs">{brand.id}</td>
                <td className="font-medium">{brand.name}</td>
                <td>{brand.email}</td>
                <td>
                  <Badge variant={brand.status === 'active' ? 'success' : brand.status === 'pending' ? 'warning' : 'secondary'}>
                    {brand.status}
                  </Badge>
                </td>
                <td>{brand.campaigns}</td>
                <td>{brand.joined}</td>
                <td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">Analytics</Button>
                    {brand.status === 'pending' && (
                      <Button size="sm">Approve</Button>
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