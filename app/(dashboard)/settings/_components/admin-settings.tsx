"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { BarChart, LineChart, UserCheck } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Manage global platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Maintenance Mode</h4>
              <p className="text-sm text-gray-500">Put the platform in maintenance mode</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Course Creation</h4>
              <p className="text-sm text-gray-500">Allow instructors to create courses</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Button variant="destructive" onClick={() => toast.warning('This feature coming soon')}>
            Clear Cache
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Platform analytics and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <BarChart className="w-4 h-4 mr-2" />
              View Platform Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <UserCheck className="w-4 h-4 mr-2" />
              👥 User Activity Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <LineChart className="w-4 h-4 mr-2" />
              📈 Revenue Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}