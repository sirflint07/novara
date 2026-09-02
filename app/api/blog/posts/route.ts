import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ✅ Check if user has permission to create blogs
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    // ✅ Only ADMIN and INSTRUCTOR can create blogs
    if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
      return NextResponse.json(
        { error: 'You do not have permission to create blog posts' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Create blog post with authorId
    const post = await db.blogPost.create({
      data: {
        ...data,
        authorId: userId,
        status: user.role === 'ADMIN' ? data.status : 'REVIEW', // Instructor posts go to review
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
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
      select: { role: true },
    });

    // ✅ Build where clause based on role
    let where: any = {};

    if (user?.role === 'INSTRUCTOR') {
      // ✅ Instructors only see their own posts
      where.authorId = userId;
    }
    // ✅ Admins see all posts (no filter)

    const posts = await db.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}