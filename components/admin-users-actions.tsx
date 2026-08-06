// components/admin-users-actions.tsx
"use client";

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useState } from 'react';

interface AdminUserActionsProps {
  userId: string;
  currentRole: string;
}

export const AdminUserActions = ({ userId, currentRole }: AdminUserActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {currentRole !== 'INSTRUCTOR' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRoleChange('INSTRUCTOR')}
          disabled={isLoading}
        >
          Make Instructor
        </Button>
      )}
      {currentRole !== 'ADMIN' && (
        <Button
          size="sm"
          variant="outline"
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
          onClick={() => handleRoleChange('ADMIN')}
          disabled={isLoading}
        >
          Make Admin
        </Button>
      )}
    </div>
  );
};