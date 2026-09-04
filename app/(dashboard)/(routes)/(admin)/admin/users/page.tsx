
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-check-access';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUsersTable } from "../_components/admin-users-table";
import { UserRole } from "@prisma/client";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      clerkId: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          courses: true,
          blogPosts: true,
        },
      },
    },
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    clerkId: user.clerkId,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role as UserRole | null,
    createdAt: user.createdAt,
    courses: user._count.courses,
    blogs: user._count.blogPosts,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-sm text-gray-500">Manage all users on the platform</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <AdminUsersTable users={formattedUsers} />
    </div>
  );
}