// app/(dashboard)/settings/_components/account-settings.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

interface AccountSettingsProps {
  user: any;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Clerk handles password changes through their UI
    toast.info('Please use Clerk\'s built-in password change flow');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              // Redirect to Clerk's password change page
              window.location.href = 'https://accounts.clerk.dev/user/password';
            }}
          >
            Change Password
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            You will be redirected to Clerk's secure password change page
          </p>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-gray-500">Use an authenticator app for additional security</p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          {twoFactorEnabled && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Scan the QR code with your authenticator app</p>
              {/* QR code would be generated here */}
              <div className="mt-2 h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">QR Code</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language & Timezone */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>
            Set your preferred language and timezone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              className="w-full p-2 border border-gray-200 rounded-md"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              className="w-full p-2 border border-gray-200 rounded-md"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Dubai">Dubai (GST)</option>
              <option value="Asia/Singapore">Singapore (SGT)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
          </div>

          <Button variant="outline" onClick={() => toast.success('Preferences saved')}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Connect your social media and other accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Google</p>
              <p className="text-sm text-gray-500">Connect your Google account</p>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-gray-500">Connect your GitHub account</p>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}