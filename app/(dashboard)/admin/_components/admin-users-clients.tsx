"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { UserRole } from '@prisma/client';

interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
}

interface AdminUsersClientProps {
  users: User[];
}

const roleColors = {
  STUDENT: 'bg-gray-100 text-gray-700',
  INSTRUCTOR: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-purple-100 text-purple-700',
};

export default function AdminUsersClient({ users }: AdminUsersClientProps) {
  const [userList, setUserList] = useState(users);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/admin/users/${userId}/role`, {
        role: newRole,
      });
      
      setUserList(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage user roles and permissions</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userList.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.name || 'Unnamed User'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role !== 'STUDENT' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(user.id, 'STUDENT')}
                          disabled={isLoading}
                        >
                          Set Student
                        </Button>
                      )}
                      {user.role !== 'INSTRUCTOR' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(user.id, 'INSTRUCTOR')}
                          disabled={isLoading}
                        >
                          Set Instructor
                        </Button>
                      )}
                      {user.role !== 'ADMIN' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          onClick={() => handleRoleChange(user.id, 'ADMIN')}
                          disabled={isLoading}
                        >
                          Set Admin
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}