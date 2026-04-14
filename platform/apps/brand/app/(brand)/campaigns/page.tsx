import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const campaigns = [
  { 
    id: 1,
    name: "PAK vs AUS Launch", 
    status: "active", 
    type: "Quiz",
    participants: 4820, 
    conversions: 1240,
    reward: "500 points",
    match: "Pakistan vs Australia",
    dates: "Jan 20 - Feb 10, 2026"
  },
  { 
    id: 2,
    name: "India Cricket Quiz", 
    status: "active", 
    type: "Prediction",
    participants: 2150, 
    conversions: 890,
    reward: "NFT Badge",
    match: "India vs England",
    dates: "Jan 25 - Feb 5, 2026"
  },
  { 
    id: 3,
    name: "T20 World Cup Sprint", 
    status: "scheduled", 
    type: "Trivia",
    participants: 0, 
    conversions: 0,
    reward: "$50 voucher",
    match: "Feb 15, 2026",
    dates: "Feb 1 - Feb 14, 2026"
  },
  { 
    id: 4,
    name: "IPL Preview Quiz", 
    status: "draft", 
    type: "Prediction",
    participants: 0, 
    conversions: 0,
    reward: " merchandise",
    match: "March 2026",
    dates: "Not scheduled"
  },
];

export default function CampaignsPage() {
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
        <Input placeholder="Search campaigns..." className="max-w-xs" />
        <select className="form-input max-w-xs">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="stat-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.type} • {campaign.match}</CardDescription>
                </div>
                <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'scheduled' ? 'warning' : campaign.status === 'completed' ? 'info' : 'neutral'}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Participants</p>
                  <p className="font-semibold">{campaign.participants.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Conversions</p>
                  <p className="font-semibold">{campaign.conversions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Reward</p>
                  <p className="font-semibold">{campaign.reward}</p>
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
        ))}
      </div>
    </div>
  );
}