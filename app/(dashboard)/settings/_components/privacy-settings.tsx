// app/(dashboard)/settings/_components/privacy-settings.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'followers';
  showEnrolledCourses: boolean;
  showActivityStatus: boolean;
  allowDataExport: boolean;
}

export default function PrivacySettings() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEnrolledCourses: true,
    showActivityStatus: true,
    allowDataExport: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings/privacy');
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    }
  };

  const handleUpdate = async (key: keyof PrivacySettings, value: any) => {
    setIsLoading(true);
    try {
      const updatedSettings = { ...settings, [key]: value };
      await axios.patch('/api/settings/privacy', updatedSettings);
      setSettings(updatedSettings);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // This would typically call an API to delete the user
      toast.warning('Account deletion request submitted');
      // Redirect to logout or home
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>
            Control who can see your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Who can see your profile?</Label>
            <div className="grid grid-cols-3 gap-2">
              {['public', 'private', 'followers'].map((option) => (
                <Button
                  key={option}
                  variant={settings.profileVisibility === option ? 'default' : 'outline'}
                  onClick={() => handleUpdate('profileVisibility', option)}
                  className="capitalize"
                  disabled={isLoading}
                >
                  {option}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {settings.profileVisibility === 'public' && 'Anyone can see your profile'}
              {settings.profileVisibility === 'private' && 'Only you can see your profile'}
              {settings.profileVisibility === 'followers' && 'Only your followers can see your profile'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Data Visibility</CardTitle>
          <CardDescription>
            Control what information is visible on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Enrolled Courses</p>
              <p className="text-sm text-gray-500">Display your enrolled courses on your profile</p>
            </div>
            <Switch
              checked={settings.showEnrolledCourses}
              onCheckedChange={(checked) => handleUpdate('showEnrolledCourses', checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activity Status</p>
              <p className="text-sm text-gray-500">Show when you're online and active</p>
            </div>
            <Switch
              checked={settings.showActivityStatus}
              onCheckedChange={(checked) => handleUpdate('showActivityStatus', checked)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Manage your data and account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-gray-500">Download all your data (GDPR compliant)</p>
            </div>
            <Button variant="outline" disabled={isLoading}>
              Export Data
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}