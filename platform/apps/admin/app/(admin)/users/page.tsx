import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const users = [
  { id: "usr_001", email: "john@example.com", name: "John Doe", status: "verified", joined: "Jan 15, 2026", campaigns: 5 },
  { id: "usr_002", email: "sarah@example.com", name: "Sarah Khan", status: "verified", joined: "Jan 18, 2026", campaigns: 12 },
  { id: "usr_003", email: "mike@example.com", name: "Mike Singh", status: "pending", joined: "Jan 20, 2026", campaigns: 0 },
  { id: "usr_004", email: "ali@example.com", name: "Ali Ahmed", status: "verified", joined: "Jan 22, 2026", campaigns: 8 },
  { id: "usr_005", email: "emma@example.com", name: "Emma Wilson", status: "suspended", joined: "Jan 10, 2026", campaigns: 2 },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-sm text-slate-500">Manage user accounts and permissions.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search users..." className="max-w-xs" />
        <select className="h-9 px-3 rounded-md border border-slate-200 text-sm">
          <option>All Status</option>
          <option>Verified</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Campaigns</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-mono text-xs">{user.id}</td>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge variant={user.status === 'verified' ? 'success' : user.status === 'pending' ? 'warning' : 'destructive'}>
                    {user.status}
                  </Badge>
                </td>
                <td>{user.joined}</td>
                <td>{user.campaigns}</td>
                <td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {user.status === 'verified' && (
                      <Button size="sm" variant="secondary">Suspend</Button>
                    )}
                    {user.status === 'suspended' && (
                      <Button size="sm">Reactivate</Button>
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