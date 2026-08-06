import { auth } from '@clerk/nextjs/server';
import { db } from './db';
import { redirect } from 'next/navigation';

export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) return false;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return user?.role === 'ADMIN';
};

export const requireAdmin = async () => {
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    redirect('/');
  }

  return true;
};