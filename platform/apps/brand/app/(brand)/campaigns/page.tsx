"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface CampaignItem {
  _id: string;
  status: string;
  budget: number;
  rewardCount?: number;
  startTime?: string;
  endTime?: string;
  matchId?: {
    teamA?: { name?: string };
    teamB?: { name?: string };
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchCampaigns = async () => {
      try {
        const response = await apiRequest<CampaignItem[]>("/api/brands/campaigns");
        if (mounted) {
          setCampaigns(response);
        }
      } catch (requestError: unknown) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load campaigns.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCampaigns();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const matchName = `${campaign.matchId?.teamA?.name || "Team A"} vs ${
        campaign.matchId?.teamB?.name || "Team B"
      }`;

      const matchesQuery =
        normalizedQuery.length === 0 ||
        matchName.toLowerCase().includes(normalizedQuery) ||
        campaign.status.toLowerCase().includes(normalizedQuery);

      const matchesStatus = !statusFilter || campaign.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [campaigns, query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="text-sm text-slate-500">Create and manage your quiz and prediction campaigns.</p>
        </div>
        <Button>+ New Campaign</Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search campaigns..."
          className="max-w-xs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="form-input max-w-xs"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {loading ? <p className="text-sm text-slate-500">Loading campaigns...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {filteredCampaigns.map((campaign) => {
          const matchName = `${campaign.matchId?.teamA?.name || "Team A"} vs ${
            campaign.matchId?.teamB?.name || "Team B"
          }`;
          const start = campaign.startTime ? new Date(campaign.startTime).toLocaleDateString() : "-";
          const end = campaign.endTime ? new Date(campaign.endTime).toLocaleDateString() : "-";

          return (
          <Card key={campaign._id} className="stat-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{matchName}</CardTitle>
                  <CardDescription>Budget campaign</CardDescription>
                </div>
                <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'scheduled' ? 'warning' : campaign.status === 'completed' ? 'info' : 'neutral'}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Budget</p>
                  <p className="font-semibold">{campaign.budget}</p>
                </div>
                <div>
                  <p className="text-slate-500">Rewards</p>
                  <p className="font-semibold">{campaign.rewardCount ?? 0}</p>
                </div>
                <div>
                  <p className="text-slate-500">Dates</p>
                  <p className="font-semibold">{start} - {end}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <Button variant="outline" size="sm" className="flex-1">Analytics</Button>
                {campaign.status === 'draft' && (
                  <Button size="sm" className="flex-1">Launch</Button>
                )}
              </div>
            </CardContent>
          </Card>
          );
        })}
        {!loading && filteredCampaigns.length === 0 ? (
          <p className="text-sm text-slate-500">No campaigns found for this filter.</p>
        ) : null}
      </div>
    </div>
  );
}