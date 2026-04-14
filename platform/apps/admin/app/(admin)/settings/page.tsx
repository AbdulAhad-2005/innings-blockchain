import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Settings</h1>
          <p className="text-sm text-slate-500">System configuration.</p>
        </div>
      </div>

      <div className="stat-card">
        <h2 className="font-semibold mb-4">Platform Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform Name</label>
            <Input defaultValue="Innings Blockchain" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Admin Contact Email</label>
            <Input defaultValue="admin@innings.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Support Email</label>
            <Input defaultValue="support@innings.com" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="stat-card">
        <h2 className="font-semibold mb-4">Fee Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform Fee %</label>
            <Input defaultValue="5" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reward Mint Cost (ETH)</label>
            <Input defaultValue="0.01" type="number" />
          </div>
          <Button>Update Fees</Button>
        </div>
      </div>

      <div className="stat-card">
        <h2 className="font-semibold mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
            <span>API Server</span>
            <Badge variant="success">Running</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
            <span>Database</span>
            <Badge variant="success">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
            <span>Blockchain Node</span>
            <Badge variant="success">Healthy</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
            <span>Redis Cache</span>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}