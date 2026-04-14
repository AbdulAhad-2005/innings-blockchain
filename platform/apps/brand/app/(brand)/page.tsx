"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

interface CampaignItem {
  _id: string;
  status: string;
  budget: number;
  rewardCount?: number;
  matchId?: {
    teamA?: { name?: string };
    teamB?: { name?: string };
  };
}

export default function BrandDashboardPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [error, setError] = useState("");

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
          setError(requestError instanceof Error ? requestError.message : "Failed to load dashboard data.");
        }
      }
    };

    fetchCampaigns();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const activeCount = campaigns.filter((campaign) => campaign.status === "active").length;
    const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
    const totalRewards = campaigns.reduce((sum, campaign) => sum + Number(campaign.rewardCount || 0), 0);
    const scheduled = campaigns.filter((campaign) => campaign.status === "scheduled").length;

    return [
      { label: "Active Campaigns", value: activeCount.toString(), change: `${campaigns.length} total` },
      { label: "Scheduled", value: scheduled.toString(), change: "Awaiting launch" },
      { label: "Total Budget", value: totalBudget.toString(), change: "Across all campaigns" },
      { label: "Rewards Planned", value: totalRewards.toString(), change: "Current commitments" },
    ];
  }, [campaigns]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back! Here&apos;s your campaign overview.</p>
        </div>
        <Button>+ New Campaign</Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="pt-4">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
              <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Match</th>
                  <th>Budget</th>
                  <th>Rewards</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign._id}>
                    <td className="font-medium">{campaign._id.slice(-6).toUpperCase()}</td>
                    <td>{campaign.matchId?.teamA?.name || "Team A"} vs {campaign.matchId?.teamB?.name || "Team B"}</td>
                    <td>{campaign.budget}</td>
                    <td>{campaign.rewardCount ?? 0}</td>
                    <td>
                      <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'scheduled' ? 'warning' : 'neutral'}>
                        {campaign.status}
                      </Badge>
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