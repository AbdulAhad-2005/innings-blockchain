"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface Campaign {
  _id: string;
  status: string;
  budget: number;
  rewardCount?: number;
  brandId?: {
    name?: string;
  };
  matchId?: {
    teamA?: { name?: string };
    teamB?: { name?: string };
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchCampaigns = async () => {
      try {
        const response = await apiRequest<Campaign[]>("/api/admin/campaigns");
        if (mounted) {
          setCampaigns(response);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load campaigns.");
        }
      }
    };

    fetchCampaigns();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return campaigns;

    return campaigns.filter((campaign) => {
      const brandName = campaign.brandId?.name || "";
      const matchName = `${campaign.matchId?.teamA?.name || ""} ${campaign.matchId?.teamB?.name || ""}`;
      return (
        campaign.status.toLowerCase().includes(normalized) ||
        brandName.toLowerCase().includes(normalized) ||
        matchName.toLowerCase().includes(normalized)
      );
    });
  }, [campaigns, query]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaign Moderation</h1>
          <p className="text-sm text-slate-500">Review and moderate brand campaigns.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search campaigns..."
          className="max-w-xs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="h-9 px-3 rounded-md border border-slate-200 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Rewards</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign._id}>
                <td className="font-mono text-xs">{campaign._id.slice(-8)}</td>
                <td className="font-medium">{campaign.matchId?.teamA?.name || "Team A"} vs {campaign.matchId?.teamB?.name || "Team B"}</td>
                <td>{campaign.brandId?.name || "Unknown"}</td>
                <td>
                  <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'completed' ? 'secondary' : campaign.status === 'cancelled' ? 'destructive' : 'warning'}>
                    {campaign.status}
                  </Badge>
                </td>
                <td>{campaign.budget}</td>
                <td>{campaign.rewardCount ?? 0}</td>
                <td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">Moderate</Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-slate-500">No campaigns found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}