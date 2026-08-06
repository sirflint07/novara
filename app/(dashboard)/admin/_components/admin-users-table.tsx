"use client";

import { useUser } from "@clerk/nextjs";
import { AdminUserActions } from "@/components/admin-users-actions";
import { Badge } from "@/components/ui/badge";

interface AdminUsersTableProps {
  dbUsers: {
    id: string;
    name: string | null;
    email: string | null;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  }[];
}

export default function AdminUsersTable({ dbUsers }: AdminUsersTableProps) {
  const { user } = useUser();

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">All Users</h2>
        <p className="text-sm text-gray-500">
          Manage instructors, students, and admins
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dbUsers.map((dbUser) => (
              <tr key={dbUser.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user ? user.fullName : dbUser.name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dbUser.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Badge className={getRoleBadgeClass(dbUser.role)}>
                    {dbUser.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm">
                  <AdminUserActions 
                    userId={dbUser.id} 
                    currentRole={dbUser.role} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}