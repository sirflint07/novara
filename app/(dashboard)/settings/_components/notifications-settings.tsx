// app/(dashboard)/settings/_components/notification-settings.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const notificationOptions = [
  {
    id: 'course_updates',
    label: 'Course Updates',
    description: 'New lessons, announcements, and course changes',
    defaultChecked: true,
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Direct messages from instructors and students',
    defaultChecked: true,
  },
  {
    id: 'comments',
    label: 'Comments',
    description: 'Replies and mentions in comments',
    defaultChecked: true,
  },
  {
    id: 'enrollments',
    label: 'Course Enrollments',
    description: 'New student enrollments (instructors only)',
    defaultChecked: true,
  },
  {
    id: 'marketing',
    label: 'Marketing Emails',
    description: 'Promotions, tips, and special offers',
    defaultChecked: false,
  },
  {
    id: 'system_updates',
    label: 'System Updates',
    description: 'Platform updates and maintenance notices',
    defaultChecked: true,
  },
];

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState(
    notificationOptions.map(opt => ({ ...opt, checked: opt.defaultChecked }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (id: string) => {
    setNotifications(prev =>
      prev.map(opt =>
        opt.id === id ? { ...opt, checked: !opt.checked } : opt
      )
    );

    try {
      setIsLoading(true);
      await axios.patch('/api/settings/notifications', {
        [id]: !notifications.find(n => n.id === id)?.checked,
      });
    } catch (error) {
      toast.error('Failed to update notification settings');
      // Revert the toggle
      setNotifications(prev =>
        prev.map(opt =>
          opt.id === id ? { ...opt, checked: !opt.checked } : opt
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notifications.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">{option.label}</Label>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            <Switch
              checked={option.checked}
              onCheckedChange={() => handleToggle(option.id)}
              disabled={isLoading}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}