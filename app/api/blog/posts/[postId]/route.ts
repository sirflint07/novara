// app/api/blog/posts/[postId]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { userId: clerkId } = await auth();
    

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 400 }
      );
    }

    if (!user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ✅ Get user and the post
    const dbuser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    const post = await db.blogPost.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // ✅ Check permissions
    const isAdmin = dbuser?.role === 'ADMIN';
    const isAuthor = post.authorId === user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this post' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // ✅ Update post
    const updatedPost = await db.blogPost.update({
      where: { id: postId },
      data,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { userId: clerkId } = await auth();
    

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 400 }
      );
    }

    if (!user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbuser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    const post = await db.blogPost.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const isAdmin = dbuser?.role === 'ADMIN';
    const isAuthor = post.authorId === user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this post' },
        { status: 403 }
      );
    }

    await db.blogPost.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}