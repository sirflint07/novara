import { requireAdmin } from '@/lib/admin-check-access';
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";

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


// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ userId: string }> }
// ) {
//   try {
//     const { userId } = await params;
//     return NextResponse.json({ 
//       message: "Route is working", 
//       userId: userId 
//     });
//   } catch (error) {
//     return NextResponse.json({ error: "Error" }, { status: 500 });
//   }
// }


// app/api/admin/users/[userId]/route.ts



export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify admin
    const admin = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id: params.userId },
      include: {
        courses: {
          include: {
            _count: {
              select: {
                enrollments: true,
                chapters: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            course: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        blogPosts: {
          include: {
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        },
        blogComments: true,
        blogLikes: true,
        notificationSettings: true,
        privacySettings: true,
        adminActions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify admin
    const admin = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { 
      name, 
      email, 
      role, 
      status,
      bio, 
      location, 
      website, 
      skills, 
      interests,
      notificationSettings,
      privacySettings 
    } = body;

    // Update user
    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: {
        name,
        email,
        role,
        status,
        // Update or create profile data
        // You might want to create a separate Profile model
        // or use a JSON field for additional data
      },
    });

    // Log admin action
    await db.adminAction.create({
      data: {
        adminId: userId,
        action: "PROFILE_UPDATED",
        targetId: params.userId,
        details: {
          updatedFields: Object.keys(body),
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ADMIN_USER_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}