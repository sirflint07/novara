import { requireAdmin } from '@/lib/admin-check-access';
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        clerkId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    try {
      const client = await clerkClient();
      await client.users.deleteUser(user.clerkId);
    } catch (clerkError: any) {
      console.error("Error deleting user from Clerk:", clerkError);

      return NextResponse.json(
        { 
          error: "Failed to delete user from Clerk. Database deletion cancelled to maintain consistency.",
          details: clerkError.message || "Unknown Clerk error"
        },
        { status: 500 }
      );
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      { message: "User deleted successfully from both Clerk and database" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);

    if (error.status === 404) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (error.status === 403) {
      return NextResponse.json(
        { error: "Permission denied. Cannot delete this user." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    return NextResponse.json({ 
      message: "Route is working", 
      userId: userId 
    });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}