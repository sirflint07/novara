import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about",
  "/pricing",
  "/api/uploadthing(.*)",
  "/api/webhooks(.*)",
  "/api/blog/posts",
  "/api/blog/posts/(.*)",
  "/blogs(.*)"
]);

const isRoleSelectionRoute = createRouteMatcher([
  "/onboarding/role-selection",
]);

const isRoleApiRoute = createRouteMatcher([
  "/api/users(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/blog/categories",
  "/api/blog/tags",
]);

const isInstructorRoute = createRouteMatcher([
  "/teacher(.*)",
  "/api/teacher(.*)",
  "/api/blog/posts/create",
  "/api/blog/posts/(.*)/edit",
  "/api/blog/posts/(.*)/delete",
  "/teacher/blogs(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const pathname = request.nextUrl.pathname;

  // IMPORTANT: Always allow public routes first
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Handle API routes - but be more specific
  if (pathname.startsWith('/api')) {
    // If it's a public API route, we already returned above
    // For protected API routes, check authentication
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Redirect to sign-in if not authenticated for protected routes
  if (!userId) {
    // Create the redirect URL with a return_to parameter
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle role selection route
  if (isRoleSelectionRoute(request)) {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        role: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.next();
    }

    if (!user.role || !user.onboardingCompleted) {
      return NextResponse.next();
    }

    // Redirect based on role
    if (user.role === "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/teacher/courses", request.url));
    }
    if (user.role === "STUDENT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Now we know user is authenticated, fetch user data
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: {
      role: true,
      onboardingCompleted: true,
    },
  });

  // If user doesn't exist in DB, redirect to onboarding
  if (!user) {
    return NextResponse.redirect(
      new URL("/onboarding/role-selection", request.url)
    );
  }

  // If onboarding not completed, redirect to onboarding
  if (!user.role || !user.onboardingCompleted) {
    return NextResponse.redirect(
      new URL("/onboarding/role-selection", request.url)
    );
  }

  // Role-based access control
  const isAdmin = user.role === "ADMIN";
  const isInstructor = user.role === "INSTRUCTOR";
  const isStudent = user.role === "STUDENT";

  // Admin can access everything
  if (isAdmin) {
    return NextResponse.next();
  }

  // Instructor access
  if (isInstructor) {
    if (isAdminRoute(request)) {
      return NextResponse.redirect(new URL("/teacher/courses", request.url));
    }
    return NextResponse.next();
  }

  // Student access
  if (isStudent) {
    if (isAdminRoute(request) || isInstructorRoute(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};