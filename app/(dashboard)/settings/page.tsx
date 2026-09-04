"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  User, 
  Bell, 
  Shield, 
  Lock, 
  CreditCard, 
  Settings as SettingsIcon,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from './_components/profile-settings';
import NotificationSettings from './_components/notifications-settings';
import InstructorSettings from './_components/instructor-settings';
import AdminSettings from './_components/admin-settings';
import AccountSettings from './_components/account-settings';
import PrivacySettings from './_components/privacy-settings';


export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  const isInstructor = false; // Replace with actual check
  const isAdmin = false; // Replace with actual check

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          {isInstructor && (
            <TabsTrigger value="instructor" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Instructor
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Admin
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings dbUser={user} />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings user={user} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>

        {isInstructor && (
          <TabsContent value="instructor">
            <InstructorSettings />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="admin">
            <AdminSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}