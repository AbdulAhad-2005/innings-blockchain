"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

interface Customer {
  _id: string;
  name: string;
  createdAt: string;
}

interface Brand {
  _id: string;
  name: string;
  verificationStatus?: string;
  createdAt: string;
}

interface Campaign {
  _id: string;
  status: string;
  createdAt: string;
  brandId?: {
    name?: string;
  };
}

export default function AdminDashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const [customerData, brandData, campaignData] = await Promise.all([
          apiRequest<Customer[]>("/api/admin/customers"),
          apiRequest<Brand[]>("/api/admin/brands"),
          apiRequest<Campaign[]>("/api/admin/campaigns"),
        ]);

        if (mounted) {
          setCustomers(customerData);
          setBrands(brandData);
          setCampaigns(campaignData);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load dashboard data.");
        }
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Users", value: customers.length.toString(), change: "Customer accounts" },
      {
        label: "Active Brands",
        value: brands.filter((brand) => brand.verificationStatus === "verified").length.toString(),
        change: "Verified on platform",
      },
      {
        label: "Active Campaigns",
        value: campaigns.filter((campaign) => campaign.status === "active").length.toString(),
        change: "Currently running",
      },
      { label: "Total Campaigns", value: campaigns.length.toString(), change: "All statuses" },
    ],
    [customers, brands, campaigns]
  );

  const recentActivity = useMemo(() => {
    const entries = campaigns.slice(0, 5).map((campaign) => ({
      action: `Campaign ${campaign.status}`,
      user: campaign.brandId?.name || "Unknown brand",
      time: new Date(campaign.createdAt).toLocaleString(),
    }));

    return entries;
  }, [campaigns]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">System overview and key metrics.</p>
        </div>
        <Badge variant="success">System Healthy</Badge>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

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
            {recentActivity.length === 0 ? (
              <tr>
                <td className="text-slate-500" colSpan={3}>No recent campaign activity yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}