import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'You are already an instructor or admin' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: { role: 'INSTRUCTOR' },
    });

    return NextResponse.json({
      message: 'Successfully upgraded to instructor',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error upgrading user:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade user' },
      { status: 500 }
    );
  }
}