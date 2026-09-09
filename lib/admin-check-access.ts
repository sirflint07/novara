// lib/admin-check-access.ts
import { auth } from '@clerk/nextjs/server';
import { db } from './db';
import { redirect } from 'next/navigation';

export const isAdmin = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    // ✅ Add timeout to the query
    const user = await db.$transaction(
      async (tx) => {
        return await tx.user.findUnique({
          where: { clerkId: userId },
          select: { role: true },
        });
      },
      {
        timeout: 5000, // 5 seconds timeout
      }
    );

    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const requireAdmin = async () => {
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    redirect('/');
  }

  return true;
};