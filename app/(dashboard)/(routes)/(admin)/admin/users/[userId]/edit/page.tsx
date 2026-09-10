// app/(dashboard)/admin/users/[userId]/edit/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import UserEditClient from "./_components/user-edit-client";


interface UserEditPageProps {
  params: {
    userId: string;
  };
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { userId } = await auth();
  
  // Check authentication
  if (!userId) {
    redirect(`/sign-in?redirect_url=/admin/users/${params.userId}/edit`);
  }

  // Verify admin role
  const adminUser = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!adminUser || adminUser.role !== "ADMIN") {
    redirect("/admin");
  }

  // Fetch user details with all related data
  const user = await db.user.findUnique({
    where: { id: params.userId },
    include: {
      // Courses the user has created (if instructor)
      createdCourses: {
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
      },
      // Courses the user is enrolled in (if student)
      enrolledCourses: {
        select: {
          course: {
            select: {
              id: true,
              title: true,
              price: true,
              isPublished: true,
              instructor: {
                select: {
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          progress: true,
          completed: true,
        },
      },
      // Blog posts created by the user
      blogPosts: {
        select: {
          id: true,
          title: true,
          published: true,
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
          createdAt: 'desc',
        },
      },
      // User's subscriptions
      subscriptions: {
        select: {
          id: true,
          plan: true,
          status: true,
          startDate: true,
          endDate: true,
          autoRenew: true,
        },
      },
      // Payment history
      payments: {
        select: {
          id: true,
          amount: true,
          status: true,
          method: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10, // Last 10 payments
      },
      // User's profile
      profile: {
        select: {
          bio: true,
          avatar: true,
          location: true,
          website: true,
          socialLinks: true,
          skills: true,
          interests: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/admin/users");
  }

  // Get additional stats
  const totalComments = await db.comment.count({
    where: { userId: params.userId },
  });

  const totalLikes = await db.like.count({
    where: { userId: params.userId },
  });

  const totalCoursesCreated = user.createdCourses.length;
  const totalCoursesEnrolled = user.enrolledCourses.length;
  const totalBlogPosts = user.blogPosts.length;

  // Calculate total revenue from courses (if instructor)
  const totalRevenue = user.createdCourses.reduce((sum, course) => {
    return sum + (course.price || 0) * course._count.enrollments;
  }, 0);

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
      }}
    />
  );
}