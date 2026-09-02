// app/(dashboard)/settings/_components/instructor-settings.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

export default function InstructorSettings() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectStripe = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/stripe/connect');
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Failed to connect Stripe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>
            Connect your payment account to receive earnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleConnectStripe} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect Stripe Account'}
          </Button>
          <p className="text-sm text-gray-500">
            You'll receive payouts for course enrollments once connected.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Defaults</CardTitle>
          <CardDescription>Default settings for your courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Course Price</Label>
            <Input type="number" placeholder="49.99" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-publish courses</Label>
              <p className="text-sm text-gray-500">Automatically publish courses when complete</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}