"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface Customer {
  _id: string;
  name: string;
  email: string;
  points?: number;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        const response = await apiRequest<Customer[]>("/api/admin/customers");
        if (mounted) {
          setUsers(response);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load users.");
        }
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized)
    );
  }, [users, query]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-sm text-slate-500">Manage user accounts and permissions.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search users..."
          className="max-w-xs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="h-9 px-3 rounded-md border border-slate-200 text-sm">
          <option>All Users</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="font-mono text-xs">{user._id.slice(-8)}</td>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge variant={'success'}>
                    active
                  </Badge>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.points ?? 0}</td>
                <td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="secondary">Manage</Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-slate-500">No users found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}