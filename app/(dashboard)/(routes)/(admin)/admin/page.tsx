// app/(dashboard)/admin/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminOverviewClient from "./_components/admin-overview";


export default async function AdminOverviewPage() {
  const { userId } = await auth();
  
  // Check authentication
  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // Verify admin role
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    // Redirect based on role
    if (user?.role === "INSTRUCTOR") {
      redirect("/teacher/courses");
    } else if (user?.role === "STUDENT") {
      redirect("/");
    } else {
      redirect("/onboarding/role-selection");
    }
  }

  // Fetch initial stats on the server (optional - for better performance)
  // You can also fetch this on the client
  const initialStats = {
    totalUsers: 0,
    totalCourses: 0,
    totalBlogs: 0,
    totalRevenue: 0,
  };

  // Pass the user role to the client component
  return <AdminOverviewClient initialStats={initialStats} userRole={user.role} />;
}