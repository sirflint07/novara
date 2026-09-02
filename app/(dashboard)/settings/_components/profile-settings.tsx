// app/(dashboard)/settings/_components/profile-settings.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

interface ProfileSettingsProps {
  dbUser: any;
}

export default function ProfileSettings({ dbUser }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: dbUser?.fullName || '',
    bio: '',
    dbUsername: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch('/api/settings/profile', formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const { user} = useUser();
  const dbUsername = user?.fullName || 'dbUsername';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your personal information and how others see you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={dbUser?.imageUrl} />
            <AvatarFallback>{dbUser?.fullName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <Button variant="outline">Change Avatar</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbUsername">Username</Label>
            <Input
              id="dbUsername"
              value={formData.dbUsername}
              onChange={(e) => setFormData({ ...formData, dbUsername: e.target.value })}
              placeholder="dbUsername"
            />
            <p className="text-xs text-gray-500">This will be your unique URL: novara.com/@{dbUsername}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="ghost">Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}