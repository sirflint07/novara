// app/api/users/me/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        role: true,
        onboardingCompleted: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        role: null,
        onboardingCompleted: false,
      });
    }

    return NextResponse.json({
      exists: true,
      ...user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}