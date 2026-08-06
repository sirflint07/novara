import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-check-access';
import AdminUsersTable from './_components/admin-users-table';

export default async function AdminPage() {

  await requireAdmin();

 
  const dbUsers = await db.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <AdminUsersTable dbUsers={dbUsers} />
      </div>
    </div>
  );
}