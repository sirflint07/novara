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
  "/api/blog(.*)",
  "/api/users/me"
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
]);

const isInstructorRoute = createRouteMatcher([
  "/teacher(.*)",
  "/api/teacher(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const pathname = request.nextUrl.pathname;

   if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  if (isRoleApiRoute(request)) {
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  if (isRoleSelectionRoute(request)) {
    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
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

    if (user.role === "INSTRUCTOR") {
      return NextResponse.redirect(
        new URL("/teacher/courses", request.url)
      );
    }

    if (user.role === "STUDENT") {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    return NextResponse.next();
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      role: true,
      onboardingCompleted: true,
    },
  });

  if (!user) {
    return NextResponse.redirect(
      new URL("/onboarding/role-selection", request.url)
    );
  }

  if (!user.role || !user.onboardingCompleted) {
    return NextResponse.redirect(
      new URL("/onboarding/role-selection", request.url)
    );
  }

  if (user.role === "ADMIN") {
    return NextResponse.next();
  }

  if (user.role === "INSTRUCTOR") {
    if (isAdminRoute(request)) {
      return NextResponse.redirect(
        new URL("/teacher/courses", request.url)
      );
    }

    return NextResponse.next();
  }

  if (user.role === "STUDENT") {
    if (
      isAdminRoute(request) ||
      isInstructorRoute(request)
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
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