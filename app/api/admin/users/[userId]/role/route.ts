import { requireAdmin } from '@/lib/admin-check-access';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin();

    const { userId } = await params;
    const { role } = await req.json();

    if (!['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}