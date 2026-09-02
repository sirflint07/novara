import { db } from '@/lib/db';
import AdminUsersClient from '../_components/admin-users-clients';
import { requireAdmin } from '@/lib/admin-check-access';


export default async function AdminUsersPage() {

  await requireAdmin();

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      clerkId: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return <AdminUsersClient users={users} />;
}