// app/(dashboard)/(routes)/(admin)/admin/users/[userId]/edit/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import UserEditClient from "./_components/user-edit-client";

interface UserEditPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  // ✅ Await params in Next.js 15+
  const { userId: targetUserId } = await params;

  const { userId } = await auth();

  // Check authentication
  if (!userId) {
    redirect(
      `/sign-in?redirect_url=/admin/users/${targetUserId}/edit`
    );
  }

  // Verify admin role
  const adminUser = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!adminUser || adminUser.role !== "ADMIN") {
    redirect("/admin");
  }

  // ✅ Guard against missing userId
  if (!targetUserId) {
    redirect("/admin/users");
  }

  // Fetch user details with all related data
  const user = await db.user.findUnique({
    where: { id: targetUserId },
    include: {
      courses: {
        select: {
          id: true,
          title: true,
          price: true,
          isPublished: true,
          createdAt: true,
          _count: {
            select: {
              enrollments: true,
              chapters: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      enrollments: {
        select: {
          id: true,
          status: true,
          progressPercentage: true,
          completedAt: true,
          enrolledAt: true,
          lastAccessedAt: true,
          expiresAt: true,
          course: {
            select: {
              id: true,
              title: true,
              price: true,
              isPublished: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          enrolledAt: "desc",
        },
      },
      blogPosts: {
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      purchases: {
        select: {
          id: true,
          price: true,
          createdAt: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      notificationSettings: true,
      privacySettings: true,
      userAnalytics: true,
    },
  });

  if (!user) {
    redirect("/admin/users");
  }

  // Additional stats
  const totalComments = await db.blogComment.count({
    where: { authorId: targetUserId },
  });

  const totalLikes = await db.blogLike.count({
    where: { userId: targetUserId },
  });

  const totalCoursesCreated = user.courses.length;
  const totalCoursesEnrolled = user.enrollments.length;
  const totalBlogPosts = user.blogPosts.length;

  const totalRevenue = user.courses.reduce((sum, course) => {
    return sum + (course.price || 0) * course._count.enrollments;
  }, 0);

  const totalSpent = user.purchases.reduce((sum, purchase) => {
    return sum + (purchase.price || 0);
  }, 0);

  const adminActions = await db.adminAction.findMany({
    where: { targetId: targetUserId },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <UserEditClient
      user={user}
      stats={{
        totalComments,
        totalLikes,
        totalCoursesCreated,
        totalCoursesEnrolled,
        totalBlogPosts,
        totalRevenue,
        totalSpent,
      }}
      adminActions={adminActions}
    />
  );
}